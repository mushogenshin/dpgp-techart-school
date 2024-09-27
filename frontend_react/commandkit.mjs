import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Path to package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.resolve(__dirname, 'package.json');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Backup original package.json
const originalPackageJson = { ...packageJson };

// Add "type": "module"
packageJson.type = 'module';

// Write modified package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Path to your entry file
const entryFilePath = path.resolve(__dirname, 'src/dlus_bot.js');

console.log('Using entry file:', entryFilePath);

// Import and execute your entry file
import(entryFilePath)
  .then(() => {
    // Restore original package.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(originalPackageJson, null, 2)
    );
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    // Restore original package.json in case of error
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(originalPackageJson, null, 2)
    );
  });