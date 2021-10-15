import * as fs from 'fs-extra';
import * as path from 'path';

const heading1Markdown = (content: string): string => { //heading1Markdown() takes the content which is unformatted md file text.
  
  return content.split(/[\r?\n\r?\n]/g)
        .map((line) =>
          line
          .replace (/(^`)(.+?(?=`))(`$)/gim, '<code>$2</code>')
          .replace(/-{3}/gim, '<hr>')
          .replace(/(^(?!<)[^#](.*$))/gim, '<p>$1</p>')
          .replace(/^##\s(.*$)/gim, "<h2>$1</h2>")
          .replace(/^#\s(.*$)/gim, '<h1>$1</h1>')
          
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

export default processingFile;