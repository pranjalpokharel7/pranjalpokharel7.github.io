import subprocess
import sys
from pathlib import Path

if len(sys.argv) != 2:
    print("Usage: python md-to-post.py <path/to/markdown-file.md>")
    sys.exit(1)

md_path = Path(sys.argv[1])
if not md_path.exists() or md_path.suffix != ".md":
    print("Invalid markdown file.")
    sys.exit(1)

html_filename = md_path.stem + ".html"
html_path = f"posts/{html_filename}"
boilerplate_path = Path("boilerplate.html")

subprocess.run([
    "pandoc", "-f", "markdown-smart", "-t", "html",
    str(md_path), "-o", str(html_path)
], check=True)

with open(boilerplate_path) as f:
    boilerplate = f.read()
with open(html_path) as f:
    post_html = f.read()

# TODO: a better solution would be to parse the html tree
# and replace the contents of the main tag
full_html = boilerplate.replace("CONTENTS GO HERE", post_html)

with open(html_path, "w") as f:
    f.write(full_html)

print(f"Written post to {html_path}")
