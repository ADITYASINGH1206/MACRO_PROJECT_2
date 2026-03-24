const fs = require('fs');

let cssContent = fs.readFileSync('src/index.css', 'utf8');

// Regex to match css variables containing hex codes
const regex = /(--color-[a-zA-Z0-9-]+):\s*#([0-9a-fA-F]{6});/g;

const newCssContent = cssContent.replace(regex, (match, p1, p2) => {
    // Convert hex to rgb format e.g. "255 255 255"
    const r = parseInt(p2.slice(0, 2), 16);
    const g = parseInt(p2.slice(2, 4), 16);
    const b = parseInt(p2.slice(4, 6), 16);
    return `${p1}: ${r} ${g} ${b};`;
});

fs.writeFileSync('src/index.css', newCssContent);

let tailwindConfig = fs.readFileSync('tailwind.config.js', 'utf8');
const tailwindRegex = /"var\(--color-[a-zA-Z0-9-]+\)"/g;
const newTailwindConfig = tailwindConfig.replace(tailwindRegex, (match) => {
    // Replace "var(--color-primary)" with "rgb(var(--color-primary) / <alpha-value>)"
    return `({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return \`rgba(\${'${match.replace(/"/g, '')}'}, \${opacityValue})\`
          }
          if (opacityVariable !== undefined) {
            return \`rgba(\${'${match.replace(/"/g, '')}'}, var(\${opacityVariable}, 1))\`
          }
          return \`rgb(\${'${match.replace(/"/g, '')}'})\`
        }`.replace(/\n\s{8}/g, '');
});

// A cleaner way in modern tailwind is just 'rgb(var(--color-primary) / <alpha-value>)'
const simplerTailwindConfig = tailwindConfig.replace(tailwindRegex, (match) => {
    return `"rgba(${match.replace(/"/g, '')} / <alpha-value>)"`;
});

fs.writeFileSync('tailwind.config.js', simplerTailwindConfig);
console.log("Fixed CSS variables for opacity support!");
