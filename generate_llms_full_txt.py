#!/usr/bin/env python3
"""
Mistral llms-full.txt generator
Generates a single file with API endpoints and full documentation
"""

import yaml
import requests
import re
from pathlib import Path

# Configuration
REPO_NAME = "."  # Current directory since we're IN the repo
DOCS_PATH = "static/docs"
DOCS_BASE_URL = "https://docs.mistral.ai/docs"
API_BASE_URL = "https://docs.mistral.ai/api/"
OPENAPI_URL = "https://raw.githubusercontent.com/mistralai/platform-docs-public/main/openapi.yaml"

# ============================================================================
# API EXTRACTION FUNCTIONS
# ============================================================================

def fetch_openapi_spec():
    """Fetch the OpenAPI spec from Mistral's GitHub"""
    print("📡 Fetching OpenAPI spec...")
    response = requests.get(OPENAPI_URL)
    response.raise_for_status()
    return yaml.safe_load(response.text)

def extract_endpoints(spec):
    """Extract endpoint information from OpenAPI spec"""
    endpoints = []
    
    for path, methods in spec.get('paths', {}).items():
        for method, details in methods.items():
            if method in ['get', 'post', 'put', 'patch', 'delete']:
                # Get operation info
                operation_id = details.get('operationId', '')
                summary = details.get('summary', '')
                
                # Use summary as title, fallback to operation ID
                title = summary if summary else operation_id.replace('_', ' ').title()
                
                # Format method (del for delete)
                method_str = 'del' if method == 'delete' else method
                
                # Create endpoint entry
                endpoint = {
                    'title': title,
                    'method': method_str,
                    'path': path,
                    'source': f"{API_BASE_URL}#tag/{operation_id}" if operation_id else API_BASE_URL
                }
                endpoints.append(endpoint)
    
    return endpoints

def format_api_content(endpoints):
    """Format API endpoints to text"""
    lines = []
    
    # Add API section header
    
    for ep in endpoints:
        lines.append(f"# {ep['title']}")
        lines.append(f"Source: {ep['source']}")
        lines.append("")
        lines.append(f"{ep['method']} {ep['path']}")
        lines.append("")
    
    return lines

# ============================================================================
# DOCUMENTATION EXTRACTION FUNCTIONS
# ============================================================================

def extract_title(content, filename):
    """Extract title from markdown content"""
    # Try frontmatter first
    if content.startswith('---'):
        frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if frontmatter_match:
            frontmatter = frontmatter_match.group(1)
            title_match = re.search(r'^title:\s*["\']?(.+?)["\']?\s*$', frontmatter, re.MULTILINE)
            if title_match:
                return title_match.group(1).strip('"\'')
    
    # Try first # heading
    heading_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if heading_match:
        return heading_match.group(1).strip()
    
    # Fallback to filename
    name = Path(filename).stem
    return name.replace('-', ' ').replace('_', ' ').title()

def clean_content(content):
    """Clean markdown content - remove frontmatter but keep everything else"""
    # Remove frontmatter only
    if content.startswith('---'):
        content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
    
    # Remove import/export statements (MDX specific)
    content = re.sub(r'^import\s+.*?$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^export\s+.*?$', '', content, flags=re.MULTILINE)
    
    # Clean up excessive newlines (more than 3 in a row)
    content = re.sub(r'\n{4,}', '\n\n\n', content)
    
    return content.strip()

def path_to_url(file_path):
    """Convert local file path to docs.mistral.ai URL (without .md extension)"""
    # Remove repo name and static/docs prefix
    relative_path = str(file_path).replace(f"{REPO_NAME}/", "")
    relative_path = relative_path.replace(f"{DOCS_PATH}/", "")
    # Remove .md or .mdx extension
    relative_path = re.sub(r'\.(md|mdx)$', '', relative_path)
    # Return URL WITHOUT .md extension
    return f"{DOCS_BASE_URL}/{relative_path}"

def process_markdown_files():
    """Process all markdown files in the docs directory"""
    docs = []
    docs_dir = Path(REPO_NAME) / DOCS_PATH
    
    if not docs_dir.exists():
        print(f"❌ Docs directory not found: {docs_dir}")
        return docs
    
    # Get all .md and .mdx files recursively
    md_files = list(docs_dir.rglob("*.md")) + list(docs_dir.rglob("*.mdx"))
    
    # Filter out changelog and stories files
    md_files = [f for f in md_files if not any(skip in str(f).lower() for skip in ['changelog', 'stories', 'story'])]
    
    md_files.sort()  # Sort for consistent output
    
    print(f"📚 Found {len(md_files)} documentation files")
    
    for i, file_path in enumerate(md_files, 1):
        relative_path = file_path.relative_to(Path(REPO_NAME))
        
        # Show progress every 10 files
        if i % 10 == 0 or i == len(md_files):
            print(f"   Processing: {i}/{len(md_files)} files...")
        
        try:
            # Read content
            content = file_path.read_text(encoding='utf-8')
            
            # Extract title
            title = extract_title(content, file_path.name)
            
            # Generate URL (without .md)
            url = path_to_url(file_path)
            
            # Clean content
            cleaned_content = clean_content(content)
            
            docs.append({
                'title': title,
                'url': url,
                'content': cleaned_content,
                'path': str(relative_path)
            })
            
        except Exception as e:
            print(f"   ⚠️  Error processing {file_path.name}: {e}")
    
    return docs

def format_docs_content(docs):
    """Format documentation to text"""
    lines = []
    
    # Add documentation section header
    
    for doc in docs:
        # Add title in brackets
        lines.append(f"[{doc['title']}]")
        # Add source URL (without .md)
        lines.append(f"Source: {doc['url']}")
        # Add blank line
        lines.append("")
        # Add full content
        lines.append(doc['content'])
        # Add blank lines between documents
        lines.append("")
        lines.append("")
    
    return lines

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def create_combined_file(api_lines, docs_lines, output_file="static/llms-full.txt"):
    """Combine API and documentation content into single file"""
    # Combine all lines
    all_lines = api_lines + docs_lines
    content = '\n'.join(all_lines)
    
    # Write to file
    Path(output_file).write_text(content, encoding='utf-8')
    
    # Return statistics
    return {
        'total_lines': len(all_lines),
        'api_lines': len(api_lines),
        'docs_lines': len(docs_lines),
        'char_count': len(content)
    }

def main():
    print("🚀 Mistral Combined API & Documentation Extractor")
    print("=" * 50)
    print()
    
    try:
        # Step 1: Extract API endpoints
        print("📌 Step 1: Extracting API Endpoints")
        print("-" * 40)
        spec = fetch_openapi_spec()
        endpoints = extract_endpoints(spec)
        api_lines = format_api_content(endpoints)
        print(f"✓ Extracted {len(endpoints)} API endpoints")
        print()
        
        # Step 2: Extract documentation
        print("📌 Step 2: Extracting Documentation")
        print("-" * 40)
        docs = process_markdown_files()
        docs_lines = format_docs_content(docs)
        print(f"✓ Processed {len(docs)} documentation files")
        print()
        
        # Step 3: Combine and save
        print("📌 Step 3: Creating Combined File")
        print("-" * 40)
        output_file = "static/llms-full.txt"
        stats = create_combined_file(api_lines, docs_lines, output_file)
        
        print(f"✅ Successfully created {output_file}")
        print()
        print("📊 Statistics:")
        print(f"   • API endpoints: {len(endpoints)}")
        print(f"   • Documentation files: {len(docs)}")
        print(f"   • Total lines: {stats['total_lines']:,}")
        print(f"   • Total size: {stats['char_count']:,} characters")
        print()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())