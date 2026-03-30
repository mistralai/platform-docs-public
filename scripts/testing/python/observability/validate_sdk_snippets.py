#!/usr/bin/env python3
"""
Validate SDK code snippets in observability docs against the actual mistralai SDK.

Checks that:
- Import statements actually work (e.g. from mistralai.client import Mistral)
- All referenced methods exist on the Mistral client
- All keyword argument names match the method signatures
- Attributes accessed on SDK response objects exist on the return types
- Attribute access on void methods (bare return / no body) is flagged as an error
- Required parameters aren't missing (warning only, since positional args are valid)

Usage:
    uv run --with "mistralai>=2" python scripts/testing/python/observability/validate_sdk_snippets.py
"""

import ast
import importlib
import inspect
import sys
import textwrap
import typing
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[4]
DOCS_DIR = PROJECT_ROOT / "src/app/(docs)/capabilities/observability"

RED = "\033[91m"
YELLOW = "\033[93m"
GREEN = "\033[92m"
DIM = "\033[2m"
RESET = "\033[0m"


# ---------------------------------------------------------------------------
# MDX extraction
# ---------------------------------------------------------------------------

def extract_python_snippets(mdx_path: Path) -> list[tuple[str, int]]:
    """Extract Python code blocks from an MDX file. Returns (code, start_line) tuples."""
    content = mdx_path.read_text()
    snippets = []
    in_block = False
    current = []
    start = 0

    for i, line in enumerate(content.split("\n"), 1):
        stripped = line.strip()
        if stripped.startswith("```python"):
            in_block = True
            current = []
            start = i + 1  # code starts on next line
        elif stripped == "```" and in_block:
            in_block = False
            snippets.append(("\n".join(current), start))
        elif in_block:
            current.append(line)

    return snippets


# ---------------------------------------------------------------------------
# AST helpers
# ---------------------------------------------------------------------------

def get_call_chain(node: ast.expr) -> str | None:
    """Recursively build a dotted name from an AST Attribute/Name node."""
    if isinstance(node, ast.Attribute):
        parent = get_call_chain(node.value)
        return f"{parent}.{node.attr}" if parent else None
    if isinstance(node, ast.Name):
        return node.id
    return None


def extract_sdk_calls(code: str) -> list[dict]:
    """Parse code and find all mistral.* method calls with their kwargs."""
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return []

    calls = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue
        chain = get_call_chain(node.func)
        if not chain or not chain.startswith("mistral."):
            continue
        method_path = chain[len("mistral."):]  # strip the variable name
        kwargs = [kw.arg for kw in node.keywords if kw.arg is not None]
        calls.append({
            "method": method_path,
            "kwargs": kwargs,
            "line": node.lineno,
        })

    return calls


# ---------------------------------------------------------------------------
# Check 1: imports
# ---------------------------------------------------------------------------

def extract_imports(code: str) -> list[tuple[str, int]]:
    """Extract import statements from code. Returns (import_line, lineno) tuples."""
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return []

    imports = []
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom) and node.module:
            # Only check mistralai imports — we don't care about stdlib
            if node.module.startswith("mistralai"):
                names = ", ".join(alias.name for alias in node.names)
                imports.append((f"from {node.module} import {names}", node.lineno))
        elif isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name.startswith("mistralai"):
                    imports.append((f"import {alias.name}", node.lineno))

    return imports


def validate_import(import_stmt: str) -> str | None:
    """Try to execute an import statement. Returns error message or None."""
    # Parse into structured form to use importlib (safer than exec)
    try:
        tree = ast.parse(import_stmt)
    except SyntaxError:
        return f"syntax error in `{import_stmt}`"

    node = tree.body[0]

    if isinstance(node, ast.ImportFrom):
        module_name = node.module
        try:
            mod = importlib.import_module(module_name)
        except ImportError:
            return f"module `{module_name}` does not exist"

        for alias in node.names:
            if not hasattr(mod, alias.name):
                return f"`{alias.name}` not found in `{module_name}`"

    elif isinstance(node, ast.Import):
        for alias in node.names:
            try:
                importlib.import_module(alias.name)
            except ImportError:
                return f"module `{alias.name}` does not exist"

    return None


# ---------------------------------------------------------------------------
# Check 2: response attribute access
# ---------------------------------------------------------------------------

def extract_result_attr_accesses(code: str) -> list[dict]:
    """Find variables assigned from mistral.* calls and track attribute accesses on them.

    For example, given:
        campaign = mistral.beta.observability.campaigns.create(...)
        print(campaign.id)
        print(campaign.name)

    Returns:
        [{"var": "campaign", "method": "beta.observability.campaigns.create",
          "attrs": [("id", 3), ("name", 4)]}]
    """
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return []

    # Pass 1: find assignments like `var = mistral.xxx.yyy(...)`
    var_to_method: dict[str, str] = {}
    for node in ast.walk(tree):
        if not isinstance(node, ast.Assign):
            continue
        if not isinstance(node.value, ast.Call):
            continue
        chain = get_call_chain(node.value.func)
        if not chain or not chain.startswith("mistral."):
            continue
        method_path = chain[len("mistral."):]
        for target in node.targets:
            if isinstance(target, ast.Name):
                var_to_method[target.id] = method_path

    if not var_to_method:
        return []

    # Pass 2: find attribute accesses on those variables
    # We look for `var.attr` patterns (direct attribute access, not chained calls)
    var_attrs: dict[str, list[tuple[str, int]]] = {v: [] for v in var_to_method}

    for node in ast.walk(tree):
        if not isinstance(node, ast.Attribute):
            continue
        if isinstance(node.value, ast.Name) and node.value.id in var_to_method:
            var_attrs[node.value.id].append((node.attr, node.lineno))

    results = []
    for var, method in var_to_method.items():
        attrs = var_attrs.get(var, [])
        if attrs:
            results.append({
                "var": var,
                "method": method,
                "attrs": attrs,
            })

    return results


def method_returns_none(method_obj: object) -> bool:
    """Check if a method only has bare `return` statements (i.e. returns None).

    Inspects the source code to detect methods with no return type hint
    that only use `return` without a value. This catches void SDK methods
    like judges.update() and judges.delete().
    """
    try:
        source = inspect.getsource(method_obj)
        tree = ast.parse(textwrap.dedent(source))
    except (OSError, TypeError, SyntaxError):
        return False

    func_node = None
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            func_node = node
            break

    if func_node is None:
        return False

    # Check return annotation — if it exists and isn't None, trust it
    if func_node.returns is not None:
        return False

    # Find all return statements in the function body
    returns = [
        node for node in ast.walk(func_node)
        if isinstance(node, ast.Return)
    ]

    if not returns:
        return True  # no return at all → returns None

    # All returns must be bare (return without a value)
    return all(r.value is None for r in returns)


def get_return_type_attrs(method_obj: object) -> set[str] | None:
    """Inspect a method's return type annotation and return its known attributes.

    Returns None if the return type can't be inspected (no annotation, complex Union, etc.).
    Returns a set of attribute names if the return type is a concrete class.
    """
    try:
        hints = typing.get_type_hints(method_obj)
    except Exception:
        return None

    ret_type = hints.get("return")
    if ret_type is None:
        return None

    # Unwrap Optional[X] / Union[X, None]
    origin = getattr(ret_type, "__origin__", None)
    if origin is type(None):
        return None

    # Handle Optional = Union[X, None]
    args = getattr(ret_type, "__args__", None)
    if origin is typing.Union and args:
        # Filter out NoneType
        non_none = [a for a in args if a is not type(None)]
        if len(non_none) == 1:
            ret_type = non_none[0]
        else:
            return None  # complex Union, skip

    # At this point ret_type should be a concrete class (or something we can inspect)
    if not isinstance(ret_type, type):
        return None

    # Collect attributes: class __annotations__ + properties + defined in __init__
    attrs: set[str] = set()

    # Walk MRO for all annotations
    for cls in ret_type.__mro__:
        if cls is object:
            continue
        attrs.update(getattr(cls, "__annotations__", {}).keys())

    # Also check for @property and descriptors
    for name in dir(ret_type):
        if name.startswith("_"):
            continue
        attrs.add(name)

    return attrs if attrs else None


def resolve_attr(obj: object, dotted_path: str):
    """Walk obj.a.b.c and return the final attribute, or None."""
    for part in dotted_path.split("."):
        obj = getattr(obj, part, None)
        if obj is None:
            return None
    return obj


# ---------------------------------------------------------------------------
# Main validation
# ---------------------------------------------------------------------------

def validate():
    from mistralai.client import Mistral

    client = Mistral(api_key="validation-only-not-used")

    mdx_files = sorted(DOCS_DIR.rglob("page.mdx"))
    if not mdx_files:
        print(f"{RED}No MDX files found in {DOCS_DIR}{RESET}")
        return 1

    errors: list[str] = []
    warnings: list[str] = []
    total_calls = 0
    total_imports = 0
    total_attr_checks = 0

    for mdx_file in mdx_files:
        rel = mdx_file.relative_to(PROJECT_ROOT)
        snippets = extract_python_snippets(mdx_file)

        for code, code_start in snippets:

            # --- Check imports ---
            imports = extract_imports(code)
            for import_stmt, lineno in imports:
                total_imports += 1
                loc = f"{rel}:{code_start + lineno - 1}"
                err = validate_import(import_stmt)
                if err:
                    errors.append(f"{loc}: import error — {err}")

            # --- Check SDK method calls and kwargs ---
            calls = extract_sdk_calls(code)

            for call in calls:
                total_calls += 1
                method_path = call["method"]
                loc = f"{rel}:{code_start + call['line'] - 1}"

                # 1. Does the method exist?
                method = resolve_attr(client, method_path)
                if method is None:
                    errors.append(
                        f"{loc}: method `{method_path}` does not exist on Mistral client"
                    )
                    continue

                if not callable(method):
                    errors.append(
                        f"{loc}: `{method_path}` exists but is not callable"
                    )
                    continue

                # 2. Inspect signature
                try:
                    sig = inspect.signature(method)
                except (ValueError, TypeError):
                    warnings.append(f"{loc}: could not inspect `{method_path}` signature")
                    continue

                # Ignore internal params
                skip = {"self", "retries", "server_url", "timeout_ms"}
                valid_params = {
                    name for name in sig.parameters if name not in skip
                }

                # 3. Check each kwarg exists
                for kwarg in call["kwargs"]:
                    if kwarg not in valid_params:
                        errors.append(
                            f"{loc}: `{method_path}()` has no parameter `{kwarg}` "
                            f"(valid: {', '.join(sorted(valid_params))})"
                        )

                # 4. Warn on missing required params (could be positional)
                required = set()
                for name, p in sig.parameters.items():
                    if name in skip:
                        continue
                    if p.kind in (
                        inspect.Parameter.VAR_POSITIONAL,
                        inspect.Parameter.VAR_KEYWORD,
                    ):
                        continue
                    if p.default is inspect.Parameter.empty:
                        required.add(name)

                provided = set(call["kwargs"])
                missing = required - provided
                if missing:
                    warnings.append(
                        f"{loc}: `{method_path}()` may be missing required params: "
                        f"{', '.join(sorted(missing))}"
                    )

            # --- Check response attribute access ---
            accesses = extract_result_attr_accesses(code)
            for access in accesses:
                method_path = access["method"]
                method = resolve_attr(client, method_path)
                if method is None or not callable(method):
                    continue  # already reported above

                # Check if method returns None (bare return, no type hint)
                if method_returns_none(method):
                    for attr_name, lineno in access["attrs"]:
                        total_attr_checks += 1
                        loc = f"{rel}:{code_start + lineno - 1}"
                        errors.append(
                            f"{loc}: `{access['var']}.{attr_name}` — "
                            f"`{method_path}()` returns None (void method), "
                            f"cannot access `.{attr_name}`"
                        )
                    continue

                known_attrs = get_return_type_attrs(method)
                if known_attrs is None:
                    continue  # can't inspect return type

                for attr_name, lineno in access["attrs"]:
                    total_attr_checks += 1
                    loc = f"{rel}:{code_start + lineno - 1}"
                    if attr_name not in known_attrs:
                        warnings.append(
                            f"{loc}: `{access['var']}.{attr_name}` — "
                            f"attribute `{attr_name}` not found on return type of "
                            f"`{method_path}()`"
                        )

    # --- Report ---
    checked = []
    if total_imports:
        checked.append(f"{total_imports} imports")
    checked.append(f"{total_calls} SDK calls")
    if total_attr_checks:
        checked.append(f"{total_attr_checks} response attrs")

    print(f"\nScanned {len(mdx_files)} files, checked {', '.join(checked)}\n")

    if errors:
        print(f"{RED}ERRORS ({len(errors)}):{RESET}")
        for e in errors:
            print(f"  {RED}x{RESET} {e}")
        print()

    if warnings:
        print(f"{YELLOW}WARNINGS ({len(warnings)}):{RESET}")
        for w in warnings:
            print(f"  {YELLOW}!{RESET} {w}")
        print()

    if not errors and not warnings:
        print(f"{GREEN}All checks passed!{RESET}")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(validate())
