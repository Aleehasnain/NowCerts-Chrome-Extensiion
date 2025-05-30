const fs = require('fs-extra');
const path = require('path');

const outputPath = path.join(__dirname, 'dist', 'Nowcerts-chrome-ext');
const filesToCopy = ['background.js', 'contentScript.js', 'injector.js', 'fillPolicyForm.js', 'manifest.json'];

filesToCopy.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const targetPath = path.join(outputPath, file);

  fs.copySync(sourcePath, targetPath);
});

console.log('Custom files copied to dist/Nowcerts-chrome-ext');
