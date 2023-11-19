const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "./backend/dist/index.js");
const shebang = "#!/usr/bin/env node\n";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file from disk: ${err}`);
  } else {
    // prepend shebang to the file data
    const newData = shebang + data;

    // write the new data back to the file
    fs.writeFile(filePath, newData, "utf8", (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
      } else {
        console.log("Shebang added successfully!");
      }
    });
  }
});
