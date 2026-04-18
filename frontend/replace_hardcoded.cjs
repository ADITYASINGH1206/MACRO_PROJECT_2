const fs = require('fs');

const files = [
  'src/components/StudentHistory.jsx',
  'src/components/StudentCourses.jsx',
  'src/components/StudentProfile.jsx',
  'src/components/Login.jsx',
  'src/components/FacultyDashboard.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace hardcoded background colors
    content = content.replace(/bg-\[#11131c\]\/[a-zA-Z0-9_]+/g, 'bg-background/80');
    content = content.replace(/bg-\[#11131c\]/g, 'bg-background');
    content = content.replace(/border-white\/5/g, 'border-outline/20');
    
    // Replace text colors
    content = content.replace(/text-\[#bbc3ff\]/g, 'text-primary');
    content = content.replace(/text-\[#e1e1ef\]/g, 'text-on-surface');
    
    // Replace gradient primary to secondary
    content = content.replace(/from-\[#bbc3ff\]/g, 'from-primary');
    content = content.replace(/to-\[#293aa6\]/g, 'to-primary-container');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
