#!/usr/bin/env python3
"""
Validate that L2 mock return values match real SDK behavior.

Parses build_mock_client() in test_sdk_snippets.py, extracts every
.return_value assignment, then inspects the real SDK method source to
check whether it returns None (void) or a typed object.

Catches the class of bug where a mock returns a rich object but the
real SDK returns None (or vice-versa).

Usage:
    uv run --with "mistralai>=2" python scripts/testing/python/observability/validate_mock_returns.py
"""

import ast
import inspect
import sys
import textwrap
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
TEST_FILE = SCRIPT_DIR / "test_sdk_snippets.py"

RED = "\033[91m"
YELLOW = "\033[93m"
GREEN = "\033[92m"
DIM = "\033[2m"
RESET = "\033[0m"


# ---------------------------------------------------------------------------
# AST helpers
# ---------------------------------------------------------------------------

def get_chain(node: ast.expr) -> str | None:
    """Build a dotted name from an AST node: a.b.c -> 'a.b.c'."""
    if isinstance(node, ast.Attribute):
        parent = get_chain(node.value)
        return f"{parent}.{node.attr}" if parent else None
    if isinstance(node, ast.Name):
        return node.id
    return None


def is_none_value(node: ast.expr) -> bool:
    """Check if an AST node represents None."""
    return isinstance(node, ast.Constant) and node.value is None


# ---------------------------------------------------------------------------
# Parse build_mock_client() for return_value assignments
# ---------------------------------------------------------------------------

def extract_mock_return_values() -> list[dict]:
    """Parse test_sdk_snippets.py and extract all .return_value = ... in build_mock_client().

    Returns list of:
        {"sdk_path": "beta.observability.judges.update",
         "mock_is_none": True/False,
         "line": 154}
    """
    source = TEST_FILE.read_text()
    tree = ast.parse(source)

    # Find build_mock_client function
    func_node = None
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name == "build_mock_client":
            func_node = node
            break

    if func_node is None:
        print(f"{RED}Could not find build_mock_client() in {TEST_FILE.name}{RESET}")
        return []

    # Pass 1: resolve local aliases
    # e.g. judges = client.beta.observability.judges  ->  {"judges": "beta.observability.judges"}
    aliases: dict[str, str] = {}

    for node in ast.walk(func_node):
        if not isinstance(node, ast.Assign):
            continue
        if len(node.targets) != 1 or not isinstance(node.targets[0], ast.Name):
            continue
        chain = get_chain(node.value)
        if chain and chain.startswith("client."):
            aliases[node.targets[0].id] = chain[len("client."):]

    # Pass 2: find all .return_value = ... assignments
    results = []

    for node in ast.walk(func_node):
        if not isinstance(node, ast.Assign):
            continue

        for target in node.targets:
            if not isinstance(target, ast.Attribute) or target.attr != "return_value":
                continue

            chain = get_chain(target.value)
            if not chain:
                continue

            # Resolve alias: "judges.create" -> "beta.observability.judges.create"
            parts = chain.split(".", 1)
            if parts[0] in aliases:
                sdk_path = aliases[parts[0]] + ("." + parts[1] if len(parts) > 1 else "")
            elif parts[0] == "client":
                sdk_path = parts[1] if len(parts) > 1 else ""
            else:
                # e.g. list_records_resp.records.results — not a mock assignment
                continue

            results.append({
                "sdk_path": sdk_path,
                "mock_is_none": is_none_value(node.value),
                "line": node.lineno,
            })

    return results


# ---------------------------------------------------------------------------
# Check real SDK method return behavior
# ---------------------------------------------------------------------------

def sdk_returns_none(method) -> bool | None:
    """Inspect whether an SDK method only has bare return statements.

    Returns True if the method returns None, False if it returns a value,
    None if we can't determine.
    """
    try:
        source = inspect.getsource(method)
        tree = ast.parse(textwrap.dedent(source))
    except (OSError, TypeError, SyntaxError):
        return None

    func_node = None
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            func_node = node
            break

    if func_node is None:
        return None

    returns = [n for n in ast.walk(func_node) if isinstance(n, ast.Return)]

    if not returns:
        return True  # no return statement -> returns None

    return all(r.value is None for r in returns)


def resolve_sdk_method(client, dotted_path: str):
    """Walk client.a.b.c and return the method object."""
    obj = client
    for part in dotted_path.split("."):
        obj = getattr(obj, part, None)
        if obj is None:
            return None
    return obj


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def validate():
    from mistralai.client import Mistral

    client = Mistral(api_key="validation-only-not-used")
    mocks = extract_mock_return_values()

    if not mocks:
        print(f"{RED}No mock return_value assignments found{RESET}")
        return 1

    errors: list[str] = []
    warnings: list[str] = []
    checked = 0

    for mock in mocks:
        sdk_path = mock["sdk_path"]
        method = resolve_sdk_method(client, sdk_path)

        if method is None:
            warnings.append(
                f"L{mock['line']}: `{sdk_path}` — method not found on SDK client"
            )
            continue

        if not callable(method):
            continue

        returns_none = sdk_returns_none(method)

        if returns_none is None:
            warnings.append(
                f"L{mock['line']}: `{sdk_path}` — could not inspect return behavior"
            )
            continue

        checked += 1

        if returns_none and not mock["mock_is_none"]:
            errors.append(
                f"L{mock['line']}: `{sdk_path}` — SDK returns None but mock returns an object. "
                f"Set return_value = None"
            )
        elif not returns_none and mock["mock_is_none"]:
            errors.append(
                f"L{mock['line']}: `{sdk_path}` — SDK returns a value but mock returns None. "
                f"Set return_value to a realistic response object"
            )

    # --- Report ---
    print(f"\nValidated {checked} mock return values against SDK\n")

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
        print(f"{GREEN}All mock return values match SDK behavior!{RESET}")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(validate())
