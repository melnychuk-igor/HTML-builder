const { readdir, stat, unlink } = require('fs');
const { mkdir, copyFile } = require('fs/promises');
const { join } = require('path');

const pathFiles = join(__dirname, 'files');
const pathFilesCopy = join(__dirname, 'files-copy');

stat(pathFilesCopy, (err) => {
  if (!err) {
    readdir(pathFilesCopy, { withFileTypes: true }, (err, files) => {
      if (files !== undefined) {
        files.forEach((item) => {
          unlink(join(pathFilesCopy, item.name), (err) => {
            if (err) throw err;
          });
        });
      }
    });
  } else {
    mkdir(pathFilesCopy, { recursive: false });
  }

  readdir(pathFiles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((item) => {
      copyFile(join(pathFiles, item.name), join(pathFilesCopy, item.name));
    });
  });
});

console.log('Папка скопирована!');