#!/usr/bin/env python3
import json
import sys
import os

# Next.js audit
nextjs_path = "/var/folders/1n/rvdfq5wd63q750zb82m20jb40000gn/T/claude-hostloop-plugins/5073fce4626f6129/projects/-Users-saintlammy-Library-Application-Support-Claude-local-agent-mode-sessions-254a51d0-467c-44e6-a1da-7bd1b8787fa2-4f99f6fc-c037-4b23-8902-01b534a510e7-local-aafea8e9-38e4-4a85-a2dc-ae937dad352d-outp-qmvw3f/409c155b-0bba-423a-886f-b078e6152f6d/tool-results/toolu_01UFAhciNh1MKH9Sk1BYXeXv.json"

# Django audit
django_path = "/var/folders/1n/rvdfq5wd63q750zb82m20jb40000gn/T/claude-hostloop-plugins/5073fce4626f6129/projects/-Users-saintlammy-Library-Application-Support-Claude-local-agent-mode-sessions-254a51d0-467c-44e6-a1da-7bd1b8787fa2-4f99f6fc-c037-4b23-8902-01b534a510e7-local-aafea8e9-38e4-4a85-a2dc-ae937dad352d-outp-qmvw3f/409c155b-0bba-423a-886f-b078e6152f6d/tool-results/toolu_015mR14tgrtcKCVtK3e77sRH.json"

def extract_json(path):
    with open(path) as f:
        data = json.load(f)
    return '\n\n'.join(item.get('text', '') for item in data if item.get('type') == 'text' and item.get('text'))

try:
    print("Extracting Next.js audit...")
    nextjs_text = extract_json(nextjs_path)
    with open("/Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/.audit-nextjs.md", "w") as f:
        f.write(nextjs_text)
    print(f"Next.js audit: {len(nextjs_text)} chars written")

    print("Extracting Django audit...")
    django_text = extract_json(django_path)
    with open("/Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/.audit-django.md", "w") as f:
        f.write(django_text)
    print(f"Django audit: {len(django_text)} chars written")

    print("\nDone!")
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
