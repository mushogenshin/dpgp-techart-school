// OBSOLETE
// This script provided a hacky but effective way to run the Discord bot within
// the same project environment, leveraging existing configurations and
// utilities.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Module Type Configuration: The script temporarily modifies the package.json
// file to add "type": "module", enabling ES module syntax for the project. This
// is necessary because the script and potentially other parts of the project
// use ES module syntax (e.g., import statements).

// Path to package.json and package-lock.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.resolve(__dirname, 'package.json');
const packageLockJsonPath = path.resolve(__dirname, 'package-lock.json');

// Read package.json and package-lock.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const packageLockJson = JSON.parse(fs.readFileSync(packageLockJsonPath, 'utf8'));

// Backup original package.json and package-lock.json
const originalPackageJson = { ...packageJson };
const originalPackageLockJson = { ...packageLockJson };

// Add "type": "module" to package.json
packageJson.type = 'module';

// Write modified package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// 2. Dynamic Import: The script dynamically imports and executes the entry file
// (src/dlus_bot.js). This allows the project to run the Discord bot using the
// same environment and utilities configured for the Firebase project. 

// Path to the entry file
const entryFilePath = path.resolve(__dirname, 'src/dlus_bot.js');

console.log('Using entry file:', entryFilePath);

// Import and execute your entry file
import(entryFilePath)
  .then(() => {
    // Restore original package.json and package-lock.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(originalPackageJson, null, 2)
    );
    fs.writeFileSync(
      packageLockJsonPath,
      JSON.stringify(originalPackageLockJson, null, 2)
    );
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    // Restore original package.json and package-lock.json in case of error
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(originalPackageJson, null, 2)
    );
    fs.writeFileSync(
      packageLockJsonPath,
      JSON.stringify(originalPackageLockJson, null, 2)
    );
  });