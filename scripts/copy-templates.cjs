const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "src", "templates");
const destination = path.join(__dirname, "..", "dist", "templates");

fs.cpSync(source, destination, {
  recursive: true,
});

console.log("Email templates copied to dist/templates");