#!/usr/bin/env node

import * as yargs from 'yargs';
import * as fs from 'fs-extra';
import * as path from 'path';

const argv = yargs
  .option({
    input: {
      alias: 'i',
      describe: 'Text file to create an html file',
      type: 'string',
      demandOption: true,
      requiresArg: true,
    },
  })
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v').argv as {
  input: string;
  _: (string | number)[];
  $0: string;
};
const { input } = argv;

const outputDir = 'dist';
fs.removeSync(outputDir);
fs.ensureDirSync(outputDir);
fs.ensureFileSync(`${outputDir}/index.css`);

fs.copyFileSync('src/styles/index.css', `${outputDir}/index.css`);

const heading1Markdown = (content: string): string => { //heading1Markdown() takes the content which is unformatted md file text.
  
return content.split(/[\r?\n\r?\n]/g)
      .map((line) =>
        line.replace(/(^[^#](.*)$)/gim, '<p>$1</p>').replace(/^## (.*$)/, "<h2>$1</h2>").replace(/^# (.*$)/gim, '<h1>$1</h1>')
        /*
        replace any line starting with # and a space with <h1> surrounding itself.
        replace any line starting with an alphabetical character followed by 0 or more of anything with <p> surrounding itself.
        */
      ).join('\n'); //this makes the content a string rather than array.
};

const processMarkdown = (data: string): string => {
  let processedContent: string = "";
  processedContent = heading1Markdown(data);
  return processedContent;
};
//Create html markup file from provided text file
const processingFile = (filePath: string): string => {
  const fileExt = path.extname(filePath).toLowerCase();
  if (fileExt !== '.txt' && fileExt !== ".md") {
    return '';
  }

  const file = fs.readFileSync(filePath, 'utf-8');

  // title is before the first 2 blank lines of the text
  let titleAndContent = file.split(/\n\n\n/);
  let title = '';
  let content = '';

  if (titleAndContent.length >= 2) {
    [title] = titleAndContent;
    content = titleAndContent.slice(1).join('\n\n\n');
  } else {
    [content] = titleAndContent;
  }

  const head = `<meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="index.css"> 
                <title>${title || path.basename(filePath, '.txt') || path.basename(filePath, '.md')}</title>`;
                const body = `
                ${title ? `<h1 class="text-center">${title}</h1>` : ''}
                ${
                  fileExt === ".md" //if it's markdown do some extra processing.
                    ? processMarkdown(content)
                    : content //for regular txt files.
                        .split(/\r?\n\r?\n/)
                        .map((para) => `<p>${para.replace(/\r?\n/, ' ')}</p>`)
                        .join('\n')
                }
                  `;
  const markup = `<!DOCTYPE html>
      <html lang="en">
        <head>
          ${head}
        </head>
        <body>
          ${body}
        </body>
      </html>`;

  return markup.split(/\n\s+/).join('\n'); // formatting the html.
};

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
