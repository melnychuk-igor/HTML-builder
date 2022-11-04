const { readdir, access, unlink } = require('fs');
const { readFile, appendFile } = require('fs/promises');
const { join } = require('path');

const pathStyles = join(__dirname, 'styles');
const pathProjectFolder = join(__dirname, 'project-dist');
const pathBundleFile = join(pathProjectFolder, 'bundle.css');

access(join(pathProjectFolder, 'bundle.css'), (err) => {
  if (!err) {
    unlink(join(pathProjectFolder, 'bundle.css'), (err) => {
      if (err) throw err;
    });
  }
});

readdir(pathStyles, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((item) => {
    if (item.name.includes('css')) {
      const fileContent = readFile(
        join(__dirname, `styles/${item.name}`),
        'utf8'
      );

      fileContent.then((result) => {
        appendFile(pathBundleFile, `\n${result}`);
      });
    }
  });
});

console.log('Cтили собраны!');
