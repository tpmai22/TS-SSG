#!/usr/bin/env node

import * as yargs from 'yargs';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

// Decorated console log
const logError = (message: string) => console.log(chalk.hex('#FF616D')(message));
const logSuccess = (message: string) => console.log(chalk.hex('#66DE93')(message));

const argv = yargs
  .option({
    input: {
      alias: 'i',
      describe: 'File or folder to be parsed',
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
const { input} = argv;

const output = './dist';
fs.removeSync(output);
fs.ensureDirSync(output);
fs.ensureFileSync(`${output}/index.css`);


fs.copyFileSync('src/styles/index.css', `${output}/index.css`);
/**
 * Generate HTML mark up from .txt file
 * @param fileName File to be parsed
 * @return HTML markup, empty if file is invalid
 */
const processFile = (filePath: string): string => {
  const extension = path.extname(filePath).toLowerCase();
  if (extension !== '.txt') {
    return '';
  }

  const text = fs.readFileSync(filePath, 'utf-8');

  // title is before the first 2 blank lines of the text
  const titleAndContent = text.split(/\n\n\n/);
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
                <link rel="stylesheet" href="${
                  path.relative(path.dirname(filePath), input) || './'
                }/index.css"> 
                <title>${title || path.basename(filePath, '.txt')}</title>`;

  const body = `
                ${title ? `<h1 class="text-center">${title}</h1>` : ''}
                ${content
                  .split(/\r?\n\r?\n/)
                  .map((para) => `<p>${para.replace(/\r?\n/, ' ')}</p>`)
                  .join('\n')}
                  `;

  const markup = `<!DOCTYPE html>
      <html lang="en">
        <head>
          ${head}
        </head>
        <body>
          ${body}
          <h6 class="text-center"> End </h6>
        </body>
      </html>`;

  logSuccess(`✅ ${filePath}`);
  return markup.split(/\n\s+/).join('\n');
};

/**
 * Generate HTML file for each .txt encountered
 * @param pathName Directory or file to be parsed
 * @return list of generated file paths
 * */

  const generate = (filePath: string, dists: string[]): string[] => {
    try {
      const fileStat = fs.statSync(filePath);
        const markup = processFile(filePath);
        if (markup) {
          const dist = `${output}/${path.basename(filePath, '.txt')}.html`;

          fs.ensureFileSync(dist);
          fs.writeFileSync(dist, markup, { flag: 'w' });
          return dists.concat(dist);
        }
        return dists;
    } catch (err) {
      return dists;
    }
  };
  
let inputPath;
try {
  inputPath = fs.statSync(input);
} catch {
  logError(`${input}: No such file or directory`);
  fs.readdirSync(output);
  process.exit(1);
}

if (inputPath.isFile()) {
  const markup = processFile(input, true);
  if (!markup) {
    logError('Input file must be .txt');
  }

  fs.writeFileSync(`${output}/${path.basename(input, '.txt')}.html`, markup, { flag: 'w' });
} else if (inputPath.isDirectory()) {
  const dists = generateHTMLs(input);

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
                  `<li><a href="${path.relative(output, dist)}">${path.basename(
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

  fs.writeFileSync(`${output}/index.html`, indexMarkup, { flag: 'w' });
} else {
  logError(`${input}: No such file or directory`);
  process.exit(1);
}
