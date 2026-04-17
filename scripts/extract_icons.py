import os
import re
import sys

def get_coords(tag_str):
    # Extract all coordinate numbers
    m = re.findall(r'[+-]?\d+\.?\d*', tag_str)
    return [float(x) for x in m]

def get_bbox(cluster):
    xs = []
    ys = []
    for tag in cluster:
        coords = get_coords(tag)
        # Pairs of X, Y. Very roughly taking all numbers and assuming X, Y pairs.
        # This is a heuristic that works well for standard vector paths
        if len(coords) >= 2:
            xs.extend(coords[0::2])
            ys.extend(coords[1::2])
    if not xs:
        return 0, 0, 24, 24
    return min(xs), min(ys), max(xs), max(ys)

def get_start(tag_str):
    m = re.search(r'[Mm]\s*([+-]?\d+\.?\d*)[,\s]+([+-]?\d+\.?\d*)', tag_str)
    if m:
        return float(m.group(1)), float(m.group(2))
    return 0, 0

def dist(p1, p2):
    return ((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)**0.5

def extract_icons(input_file, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    with open(input_file, 'r', encoding='utf-8') as f:
        svg_content = f.read()

    tags = []
    
    # We find all path tags
    paths = re.findall(r'<path[^>]*>', svg_content, re.IGNORECASE)
    
    # Simple spatial clustering to separate the icons
    clusters = []
    for p in paths:
        sx, sy = get_start(p)
        placed = False
        for c in clusters:
            for cp, cx, cy in c:
                if dist((sx, sy), (cx, cy)) < 45:  # 45 is roughly half of 104 spacing
                    c.append((p, sx, sy))
                    placed = True
                    break
            if placed:
                break
        if not placed:
            clusters.append([(p, sx, sy)])

    print(f"Found {len(clusters)} unique icons!")

    count = 1
    for i, cluster in enumerate(clusters):
        tags = [p for p, x, y in cluster]
        
        # Calculate the average center of this icon cluster
        avg_cx = sum(x for p, x, y in cluster) / len(cluster)
        avg_cy = sum(y for p, x, y in cluster) / len(cluster)
        
        # Determine the column and row on the 104px grid. 
        # Base origin in 24x24 box is roughly 12.
        # Sometimes there's an offset between SVG global coordinates and the 104px grid.
        # By doing (X % 104), we can find the inner frame coordinate.
        
        # Instead of strict offsets, we simply shift the entire cluster so its average center
        # aligns perfectly with (12, 12).
        dx = 12 - avg_cx
        dy = 12 - avg_cy
        
        content = ""
        for tag in tags:
            tag = re.sub(r'stroke="(?:black|#000000)"', 'stroke="currentColor"', tag, flags=re.IGNORECASE)
            tag = re.sub(r'fill="(?:black|#000000)"', 'fill="currentColor"', tag, flags=re.IGNORECASE)
            if not tag.endswith('/>'):
                tag = tag.replace('>', '/>')
            content += "    " + tag + "\n"
            
        # The translation aligns the *center* of the paths to 12, 12. This works well generally!
        svg_out = f'''<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate({dx:.2f}, {dy:.2f})">
{content}  </g>
</svg>'''
        
        out_path = os.path.join(output_dir, f"icon_{count}.svg")
        with open(out_path, "w") as f:
            f.write(svg_out)
        count += 1
        
    print(f"Successfully extracted {count-1} icons to {output_dir}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python extract_icons.py <input.svg> <output_dir>")
        sys.exit(1)
    extract_icons(sys.argv[1], sys.argv[2])
