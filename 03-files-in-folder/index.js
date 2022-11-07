const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fsPromises.readdir(folderPath, {withFileTypes: true}) // returns a promise
  .then(items => // if the promise is fulfilled, i.e. if array of item names is returned
    items.forEach(item => { // for each item in the array we want:
      if (!item.isDirectory()) { // we ignore the item is a folder
        const fileDir = path.join(__dirname, 'secret-folder', item.name);
        const fileName = path.basename(fileDir);
        const fileExtension = path.extname(fileDir);
        fsPromises.stat(fileDir) // returns a promise
          .then(output=> { // if it is fulfilled, i.e. if info about the item is returned
            process.stdout.write( // print out the following:
              `${fileName.slice(0, fileName.lastIndexOf("."))} - ${fileExtension.slice(1)} - ${output.size/1000}kb\n`
            )
          })
        }
      }
    )
  )