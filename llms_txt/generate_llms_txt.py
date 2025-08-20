#!/usr/bin/env python3
"""
Tool for generating llms.txt & llms-full.txt
"""

import os
import argparse
import yaml
import requests
import re
from pathlib import Path
from mistralai import Mistral

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

def clean_content(content, for_summary=False):
    """Clean markdown content"""
    # Remove frontmatter
    if content.startswith('---'):
        content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
    
    # Remove import/export statements (MDX specific)
    content = re.sub(r'^import\s+.*?$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^export\s+.*?$', '', content, flags=re.MULTILINE)
    
    if for_summary:
        # More aggressive cleaning for summaries
        content = re.sub(r'```[\s\S]*?```', '', content)  # Remove code blocks
        content = re.sub(r'<[^>]+>', '', content)  # Remove HTML/MDX components
        content = re.sub(r' {2,}', ' ', content)  # Remove excessive spaces
        content = content[:1000]  # Limit length for summary generation
    
    # Clean up excessive newlines (more than 3 in a row)
    content = re.sub(r'\n{4,}', '\n\n\n', content)
    
    return content.strip()

def path_to_url(file_path, include_md_extension=False):
    """Convert local file path to docs.mistral.ai URL"""
    # Remove repo name and static/docs prefix
    relative_path = str(file_path).replace(f"{REPO_NAME}/", "")
    relative_path = relative_path.replace(f"{DOCS_PATH}/", "")
    # Remove .md or .mdx extension
    relative_path = re.sub(r'\.(md|mdx)$', '', relative_path)
    # Return URL with or without .md extension
    if include_md_extension:
        return f"{DOCS_BASE_URL}/{relative_path}.md"
    else:
        return f"{DOCS_BASE_URL}/{relative_path}"

def get_mistral_client():
    """Initialize Mistral client"""
    api_key = os.environ.get("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("MISTRAL_API_KEY environment variable not set")
    return Mistral(api_key=api_key)

def generate_summary(client, title, content):
    """Generate a one-line summary using Mistral API"""
    prompt = f"""Generate a concise one-line summary (max 100 characters) for this documentation page.

Title: {title}

Content preview:
{content}

Respond with ONLY the one-line summary, no additional text."""
    
    try:
        response = client.chat.complete(
            model="mistral-small-latest",  # Using small model to save costs
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=50,
            temperature=0.3
        )
        summary = response.choices[0].message.content.strip()
        # Clean up the summary
        summary = summary.replace('\n', ' ').strip('"\'.')
        return summary
    except Exception as e:
        print(f"  ⚠️  Error generating summary: {e}")
        return "Documentation page"

def process_markdown_files(mode="full", client=None):
    """Process all markdown files in the docs directory"""
    docs = []
    docs_dir = Path(REPO_NAME) / DOCS_PATH
    
    if not docs_dir.exists():
        print(f"❌ Docs directory not found: {docs_dir}")
        return docs
    
    # Get all .md and .mdx files recursively
    md_files = list(docs_dir.rglob("*.md")) + list(docs_dir.rglob("*.mdx"))
    
    # Filter out changelog and stories files
    md_files = [f for f in md_files if not any(skip in str(f).lower() for skip in ['changelog', 'stories', 'story', 'robots'])]
    
    md_files.sort()  # Sort for consistent output
    
    print(f"📚 Found {len(md_files)} documentation files")
    if mode == "summary":
        print()
    
    for i, file_path in enumerate(md_files, 1):
        relative_path = file_path.relative_to(Path(REPO_NAME))
        
        # Show different progress for different modes
        if mode == "full":
            if i % 10 == 0 or i == len(md_files):
                print(f"   Processing: {i}/{len(md_files)} files...")
        else:  # summary mode
            print(f"[{i}/{len(md_files)}] 📄 Processing: {relative_path}")
        
        try:
            # Read content
            content = file_path.read_text(encoding='utf-8')
            
            # Extract title
            title = extract_title(content, file_path.name)
            
            # Generate URL
            url = path_to_url(file_path, include_md_extension=(mode == "summary"))
            
            # Process content based on mode
            if mode == "full":
                # Clean content for full documentation
                cleaned_content = clean_content(content, for_summary=False)
                docs.append({
                    'title': title,
                    'url': url,
                    'content': cleaned_content,
                    'path': str(relative_path)
                })
            else:  # summary mode
                # Generate summary
                if mode == "summary":
                    print(f"       🤖 Generating summary...")
                
                cleaned = clean_content(content, for_summary=True)
                summary = generate_summary(client, title, cleaned) if client else "Documentation page"
                
                docs.append({
                    'title': title,
                    'url': url,
                    'summary': summary,
                    'path': str(relative_path)
                })
                
                if mode == "summary":
                    print(f"       ✓ {summary}")
            
        except Exception as e:
            if mode == "full":
                print(f"   ⚠️  Error processing {file_path.name}: {e}")
            else:
                print(f"       ⚠️  Error: {e}")
    
    return docs

def format_docs_content(docs):
    """Format documentation to text for full mode"""
    lines = []
    
    for doc in docs:
        # Add title in brackets
        lines.append(f"[{doc['title']}]")
        # Add source URL
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
# FILE GENERATION FUNCTIONS
# ============================================================================

def create_full_file(api_lines, docs_lines, output_file="static/llms-full.txt"):
    """Create comprehensive documentation file"""
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

def create_summary_file(docs, output_file="static/llms.txt"):
    """Create summary index file"""
    lines = []
    
    # Add header structure
    lines.append("# MistralAI")
    lines.append("")
    lines.append("## Docs")
    lines.append("")
    
    # Add all entries as a flat list
    for doc in docs:
        lines.append(f"[{doc['title']}]({doc['url']}): {doc['summary']}")
    
    content = '\n'.join(lines)
    Path(output_file).write_text(content, encoding='utf-8')
    return len(lines)

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def generate_llms_full_txt():
    """Generate comprehensive documentation file"""
    print("📌 Step 1: Extracting API Endpoints")
    print("-" * 40)
    spec = fetch_openapi_spec()
    endpoints = extract_endpoints(spec)
    api_lines = format_api_content(endpoints)
    print(f"✓ Extracted {len(endpoints)} API endpoints")
    print()
    
    print("📌 Step 2: Extracting Documentation")
    print("-" * 40)
    docs = process_markdown_files(mode="full")
    docs_lines = format_docs_content(docs)
    print(f"✓ Processed {len(docs)} documentation files")
    print()
    
    print("📌 Step 3: Creating Combined File")
    print("-" * 40)
    output_file = "static/llms-full.txt"
    stats = create_full_file(api_lines, docs_lines, output_file)
    
    print(f"✅ Successfully created {output_file}")
    print()
    print("📊 Statistics:")
    print(f"   • API endpoints: {len(endpoints)}")
    print(f"   • Documentation files: {len(docs)}")
    print(f"   • Total lines: {stats['total_lines']:,}")
    print(f"   • Total size: {stats['char_count']:,} characters")
    
    return output_file

def generate_llms_txt():
    """Generate llms.txt file"""
    # Check for required environment variables
    if not os.getenv("MISTRAL_API_KEY"):
        print("❌ MISTRAL_API_KEY environment variable not set")
        return None
    
    print("🤖 Initializing Mistral API client...")
    client = get_mistral_client()
    print()
    
    # Process all markdown files with summary generation
    docs = process_markdown_files(mode="summary", client=client)
    
    print()
    print(f"✅ Processed {len(docs)} documentation files")
    
    if docs:
        output_file = "static/llms.txt"
        line_count = create_summary_file(docs, output_file)
        
        print(f"💾 Saved to {output_file} ({line_count} lines)")
        
        # Show sample
        print()
        print("📝 Sample output:")
        print("=" * 50)
        sample_lines = Path(output_file).read_text().split('\n')[:10]
        for line in sample_lines:
            print(line)
        print("...")
        print("=" * 50)
        
        return output_file
    else:
        print("❌ No documentation files found")
        return None

def main():
    parser = argparse.ArgumentParser(description='Generate Mistral documentation files')
    parser.add_argument('mode', 
                       choices=['full', 'summary', 'both'], 
                       default='both',
                       nargs='?',
                       help='Generation mode: full (comprehensive), summary (index with AI summaries), or both')
    
    args = parser.parse_args()
    
    print("🚀 Mistral Documentation Generator")
    print("=" * 50)
    print(f"Mode: {args.mode}")
    print()
    
    success = True
    
    try:
        if args.mode in ['full', 'both']:
            print("📋 GENERATING LLMs FULL TXT FILE")
            print("=" * 50)
            result = generate_llms_full_txt()
            if not result:
                success = False
            print()
        
        if args.mode in ['summary', 'both']:
            print("📋 GENERATING LLMs TXT FILE")
            print("=" * 50)
            result = generate_llms_txt()
            if not result:
                success = False
            print()
        
        if success:
            print("🎉 All tasks completed successfully!")
        else:
            print("⚠️ Some tasks failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())