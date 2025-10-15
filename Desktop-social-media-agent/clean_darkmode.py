#!/usr/bin/env python3

with open('src/App.js', 'r') as f:
    content = f.read()

# Replace all isDarkMode references
lines = content.split('\n')
new_lines = []

for line in lines:
    # Skip lines that are just isDarkMode references
    if 'isDarkMode' not in line:
        new_lines.append(line)
    else:
        # Handle common patterns
        if 'className={`' in line and 'isDarkMode ?' in line:
            # Extract the light theme part
            if ' : ' in line:
                # Find the light theme value after the ':'
                parts = line.split(' : ')
                if len(parts) > 1:
                    # Get everything after the colon and before the closing backtick
                    light_part = parts[1].split('`')[0].strip(' \'"')
                    # Reconstruct the line with just the light theme
                    new_line = line.split('className={`')[0] + f'className="{light_part}"'
                    if '>' in parts[1]:
                        new_line += '>' + '>'.join(parts[1].split('>')[1:])
                    new_lines.append(new_line)
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
        elif 'style={isDarkMode' in line:
            # Remove style attributes with isDarkMode
            new_line = line.split('style={isDarkMode')[0]
            if '>' in line:
                remaining = line.split('>')
                if len(remaining) > 1:
                    new_line += '>' + '>'.join(remaining[1:])
            new_lines.append(new_line)
        else:
            new_lines.append(line)

# Write the cleaned content
with open('src/App.js', 'w') as f:
    f.write('\n'.join(new_lines))

print("Cleaned up isDarkMode references")