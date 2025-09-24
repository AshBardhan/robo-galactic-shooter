const fs = require("fs");
const path = require("path");

// Read the version from package.json
const packageJson = require("./package.json");
const newVersion = packageJson.version;

// Define the paths for files to update
const filesToUpdate = [
  path.join(__dirname, "README.md"),
];

// Function to update the version in JSON files like manifest.json
function updateJsonVersion(filePath, version) {
  const file = JSON.parse(fs.readFileSync(filePath, "utf8"));
  file.version = version;
  fs.writeFileSync(filePath, JSON.stringify(file, null, 2));
  console.log(`Updated version in ${filePath} to ${version}`);
}

// Function to update markdown files like README.md
function updateMarkdownVersion(filePath, version) {
  let fileContent = fs.readFileSync(filePath, "utf8");
  // This regex will look for 'Current version: vx.x.x' format
  const versionRegex = /\*\*Latest Release:\*\*\s?v\d+\.\d+\.\d+/;
  const newVersionLine = `**Latest Release:** v${newVersion}`;
  fileContent = fileContent.replace(versionRegex, newVersionLine);

  fs.writeFileSync(filePath, fileContent);
  console.log(`Updated version in ${filePath} to ${version}`);
}

// Function to update version in HTML files
function updateHtmlVersion(filePath, version) {
  let fileContent = fs.readFileSync(filePath, "utf8");
  // Replace the version number in the <p> tag with the version in the HTML file
  const versionRegex = /(Version:\s*)(\d+\.\d+\.\d+)/;
  fileContent = fileContent.replace(versionRegex, `$1${version}`);
  fs.writeFileSync(filePath, fileContent);
  console.log(`Updated version in ${filePath} to ${version}`);
}

// Loop through all the files and update their version
filesToUpdate.forEach((filePath) => {
  if (filePath.endsWith(".json")) {
    updateJsonVersion(filePath, newVersion);
  } else if (filePath.endsWith(".md")) {
    updateMarkdownVersion(filePath, newVersion);
  } else if (filePath.endsWith(".html")) {
    updateHtmlVersion(filePath, newVersion);
  }
});