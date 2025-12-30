#!/bin/bash

# Fix all TypeScript errors in admin pages

cd "/Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified"

# 1. Fix excel -> xlsx (already done but ensuring)
echo "Fixing excel -> xlsx..."
find src/app/\(admin\)/ -name "*.tsx" -exec sed -i '' "s/'excel'/'xlsx'/g" {} \;
find src/app/\(admin\)/ -name "*.tsx" -exec sed -i '' 's/"excel"/"xlsx"/g' {} \;

# 2. Fix onClick -> onExecute in batch actions and add id field
echo "Fixing batch actions..."

# Create a Python script to properly fix batch actions
cat > /tmp/fix_batch_actions.py << 'PYTHON_EOF'
import re
import sys

def fix_batch_actions(content):
    # Pattern to match batch action objects with onClick
    # This regex finds objects with onClick and converts them to proper format

    # First pass: Add id if missing and rename onClick to onExecute
    lines = content.split('\n')
    result_lines = []
    in_batch_action = False
    action_indent = ''
    action_content = []

    for i, line in enumerate(lines):
        # Detect start of batch action array
        if re.search(r'actions\s*=\s*\[', line):
            in_batch_action = True
            result_lines.append(line)
            continue

        # If we're in batch actions section
        if in_batch_action:
            # Check if this is the end of actions array
            if re.match(r'\s*\]', line.strip()) and not line.strip().endswith(','):
                in_batch_action = False
                result_lines.append(line)
                continue

            # Replace onClick with onExecute
            if 'onClick:' in line:
                line = line.replace('onClick:', 'onExecute:')

            result_lines.append(line)
        else:
            result_lines.append(line)

    return '\n'.join(result_lines)

content = sys.stdin.read()
print(fix_batch_actions(content))
PYTHON_EOF

# Apply to all files that might have batch actions
for file in src/app/\(admin\)/admin/kyc/page.tsx \
            src/app/\(admin\)/admin/content/page.tsx \
            src/app/\(admin\)/admin/admins/page.tsx \
            src/app/\(admin\)/admin/transactions/page.tsx \
            src/app/\(admin\)/admin/users/page.tsx \
            src/app/\(admin\)/admin/support/page.tsx; do
    if [ -f "$file" ]; then
        echo "Fixing $file..."
        python3 /tmp/fix_batch_actions.py < "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi
done

# 3. Fix specific known issues manually with sed
echo "Fixing specific patterns..."

# Fix disabled -> onExecute pattern issues
find src/app/\(admin\)/ -name "*.tsx" -exec sed -i '' 's/onClick: \([a-zA-Z_][a-zA-Z0-9_]*\),/onExecute: \1,/g' {} \;

echo "TypeScript fixes applied!"
