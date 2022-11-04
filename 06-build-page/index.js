const { readdir, access, unlink, stat } = require('fs');
const {
  mkdir,
  readFile,
  writeFile,
  appendFile,
  copyFile,
} = require('fs/promises');
const { join, basename, extname } = require('path');
const pathTemplate = join(__dirname, 'template.html');
const pathProjectDist = join(__dirname, 'project-dist');
const pathHtml = join(pathProjectDist, 'index.html');
const pathCss = join(pathProjectDist, 'style.css');
const pathAssets = join(__dirname, 'assets');
const pathAssetsCopy = join(pathProjectDist, 'assets');

async function buildPage() {
  access(join(pathProjectDist, 'index.html'), (err) => {
    if (!err) {
      readdir(pathProjectDist, (err, files) => {
        if (err) throw err;

        files.forEach((item) => {
          stat(join(pathProjectDist, item), (err, stats) => {
            if (err) throw err;
            if (stats.isFile()) {
              unlink(join(pathProjectDist, item), (err) => {
                if (err) throw err;
              });
            } else if (stats.isDirectory()) {
              readdir(join(pathProjectDist, 'assets'), (err, files) => {
                files.forEach((item) => {
                  const pathAssetsFolder = join(
                    pathProjectDist,
                    'assets/' + item
                  );
                  readdir(
                    join(pathProjectDist, 'assets/' + item),
                    (err, files) => {
                      files.forEach((item) => {
                        unlink(join(pathAssetsFolder, item), (err) => {
                          if (err) throw err;
                        });
                      });
                    }
                  );
                });
              });
            }
          });
        });
      });
    }
  });

  mkdir(pathProjectDist, { recursive: true });

  let contentTemplate = await readFile(pathTemplate, 'utf-8');
  await writeFile(pathHtml, contentTemplate);

  await readdir(
    join(__dirname, 'components'),
    { withFileTypes: true },
    (err, files) => {
      for (let file of files) {
        const content = readFile(
          join(__dirname, `components/${file.name}`),
          'utf-8'
        );

        const fileName = basename(file.name, extname(file.name));
        content.then((result) => {
          contentTemplate = contentTemplate.replace(
            `{{${fileName}}}`,
            `${result}`
          );

          writeFile(pathHtml, contentTemplate);
        });
      }
    }
  );
  // end assembly html

  // start assembly css
  await readdir(
    join(__dirname, 'styles'),
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;
      files.forEach((item) => {
        if (item.name.includes('css')) {
          const fileContent = readFile(
            join(__dirname, `styles/${item.name}`),
            'utf8'
          );

          fileContent.then((result) => {
            appendFile(pathCss, `\n\n${result}`);
          });
        }
      });
    }
  );
  // end assembly css

  // start copying folder assets
  mkdir(pathAssetsCopy, { recursive: true });

  readdir(pathAssets, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((item) => {
      mkdir(join(pathAssetsCopy, item.name), { recursive: true });
      let folder = item.name;

      readdir(
        join(pathAssets, item.name),
        { withFileTypes: true },
        (err, files) => {
          if (err) throw err;

          files.forEach((item) => {
            copyFile(
              join(pathAssets, folder + '/' + item.name),
              join(pathAssetsCopy, folder + '/' + item.name)
            );
          });
        }
      );
    });
  });
  // end copying folder assets

  console.log('Проект скомпилированный!');
}

async function assemblyHtml() {
  // start assembly html
  //   });
}

buildPage();
