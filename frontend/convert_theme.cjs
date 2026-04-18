const fs = require('fs');

const extractColors = (fileStr) => {
    // Find the colors object
    const match = fileStr.match(/colors: \{([\s\S]*?)\},/);
    if (!match) return {};
    
    const lines = match[1].split('\n');
    const colors = {};
    for (const line of lines) {
        if (line.includes(':')) {
            const parts = line.split(':');
            const key = parts[0].replace(/"/g, '').trim();
            const val = parts[1].replace(/[",]/g, '').trim();
            if (key && val) colors[key] = val;
        }
    }
    return colors;
};

const darkHtml = fs.readFileSync('C:\\Users\\ADITYA\\.gemini\\antigravity\\brain\\d9598fa0-1ab3-4f5b-97a8-b42df0ffe5aa\\dashboard_dual.html', 'utf8');
const lightHtml = fs.readFileSync('C:\\Users\\ADITYA\\.gemini\\antigravity\\brain\\d9598fa0-1ab3-4f5b-97a8-b42df0ffe5aa\\dashboard_light.html', 'utf8');

const darkColors = extractColors(darkHtml);
const lightColors = extractColors(lightHtml);

let cssVariables = '@layer base {\n  :root {\n';
for (const [k, v] of Object.entries(lightColors)) {
    cssVariables += `    --color-${k}: ${v};\n`;
}
cssVariables += '  }\n\n  .dark {\n';
for (const [k, v] of Object.entries(darkColors)) {
    cssVariables += `    --color-${k}: ${v};\n`;
}
cssVariables += '  }\n}\n';

let tailwindTheme = '      colors: {\n';
for (const k of Object.keys(darkColors)) {
    tailwindTheme += `        "${k}": "var(--color-${k})",\n`;
}
tailwindTheme += '      },';

fs.writeFileSync('C:\\Users\\ADITYA\\.gemini\\antigravity\\brain\\d9598fa0-1ab3-4f5b-97a8-b42df0ffe5aa\\generated_theme.txt', cssVariables + '\n\n' + tailwindTheme);
console.log("Successfully generated theme css and tailwind mapping!");
