#!/usr/bin/env node
import * as fs from 'fs-extra';
import * as path from 'path';

import argv from './argv';
import processingFile from './html-maker';

const { input } = argv;

const outputDir = 'dist';
fs.removeSync(outputDir);
fs.ensureDirSync(outputDir);
fs.ensureFileSync(`${outputDir}/index.css`);

fs.copyFileSync('src/styles/index.css', `${outputDir}/index.css`);

const processFilePath = (any) : void =>{ 
let inputPath;
try {
  inputPath = fs.statSync(input);
} catch {
  console.error(`${input}: File or directory could not be found`);
  fs.readdirSync(outputDir);
  process.exit(1);
}

if (inputPath.isFile()) {
  const markup = processingFile(input);
  if (!markup) {
    console.error('Input file must extension must be .txt or .md');
  }
  path.extname(input) === '.md' ? fs.writeFileSync(`${outputDir}/${path.basename(input, '.md')}.html`, markup, { flag: 'w' }) : fs.writeFileSync(`${outputDir}/${path.basename(input, '.txt')}.html`, markup, { flag: 'w' });
} else if (inputPath.isDirectory()) {
  const files = fs.readdirSync(input, { withFileTypes: true }).filter((file) => file.isFile());

  const dists: string[] = [];

  files.forEach((file) => {
    const markup = processingFile(`${input}/${file.name}`);
    if (markup) {
      const filePath = path.extname(file.name) === ".txt" ? `${outputDir}/${path.basename(file.name, '.txt')}.html` : `${outputDir}/${path.basename(file.name, '.md')}.html`;
      fs.writeFileSync(filePath, markup, { flag: 'w' });
      dists.push(filePath);
    }
  });

  const indexMarkup = `<!DOCTYPE html>
  <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="index.css"> 
    <title>${path.basename(input)}</title>
    </head>
    <body>
      <h1>${path.basename(input)}</h1>
      <ul>
        ${dists
          .map(
            (dist) =>
              `<li><a href="${path.relative(outputDir, dist)}">${path.basename(
                dist,
                '.html'
              )}</a></li>`
          )
          .join('\n')}
      </ul>
    </body>
  </html>`
    .split(/\n\s+/)
    .join('\n');

    fs.writeFileSync(`${outputDir}/index.html`, indexMarkup, { flag: 'w' });
  } else {
    console.error(`${input}: No such file or directory`);
    process.exit(1);
  }
}


