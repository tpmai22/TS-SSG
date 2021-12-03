"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var md = require('markdown-it')();
var heading1Markdown = function (content) { return md.render(content); };
var processMarkdown = function (data) {
    var processedContent = '';
    processedContent = heading1Markdown(data);
    return processedContent;
};
// Create html markup file from provided text file
var processingFile = function (filePath) {
    var fileExt = path.extname(filePath).toLowerCase();
    if (fileExt !== '.txt' && fileExt !== '.md') {
        return '';
    }
    var file = fs.readFileSync(filePath, 'utf-8');
    // title is before the first 2 blank lines of the text
    var titleAndContent = file.split(/\n\n\n/);
    var title = '';
    var content = '';
    if (titleAndContent.length >= 2) {
        title = titleAndContent[0];
        content = titleAndContent.slice(1).join('\n\n\n');
    }
    else {
        content = titleAndContent[0];
    }
    var head = "<meta charset=\"UTF-8\">\n                <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                <link rel=\"stylesheet\" href=\"index.css\"> \n                <title>" + (title || path.basename(filePath, '.txt') || path.basename(filePath, '.md')) + "</title>";
    var body = "\n                " + (title ? "<h1 class=\"text-center\">" + title + "</h1>" : '') + "\n                " + (fileExt === '.md' // if it's markdown do some extra processing.
        ? processMarkdown(content)
        : content // for regular txt files.
            .split(/\r?\n\r?\n/)
            .map(function (para) { return "<p>" + para.replace(/\r?\n/, ' ') + "</p>"; })
            .join('\n')) + "\n                  ";
    var markup = "<!DOCTYPE html>\n      <html lang=\"en\">\n        <head>\n          " + head + "\n        </head>\n        <body>\n          " + body + "\n        </body>\n      </html>";
    return markup.split(/\n\s+/).join('\n'); // formatting the html.
};
module.exports.processingFile = processingFile;
module.exports.processMarkdown = processMarkdown;
