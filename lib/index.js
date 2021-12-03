#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var argv_1 = __importDefault(require("./argv"));
var input = (0, argv_1.default)().input;
var processingFile = require('./html-maker');
var outputDir = 'dist';
fs.removeSync(outputDir);
fs.ensureDirSync(outputDir);
fs.ensureFileSync(outputDir + "/index.css");
fs.copyFileSync(path.resolve(__dirname, '../styles/index.css'), outputDir + "/index.css");
var inputPath;
try {
    inputPath = fs.statSync(input);
}
catch (_a) {
    console.error(input + ": File or directory could not be found");
    fs.readdirSync(outputDir);
    process.exit(1);
}
if (inputPath.isFile()) {
    var markup = processingFile.processingFile(input);
    if (!markup) {
        console.error('Input file must extension must be .txt or .md');
    }
    path.extname(input) === '.md'
        ? fs.writeFileSync(outputDir + "/" + path.basename(input, '.md') + ".html", markup, { flag: 'w' })
        : fs.writeFileSync(outputDir + "/" + path.basename(input, '.txt') + ".html", markup, { flag: 'w' });
}
else if (inputPath.isDirectory()) {
    var files = fs.readdirSync(input, { withFileTypes: true }).filter(function (file) { return file.isFile(); });
    var dists_1 = [];
    files.forEach(function (file) {
        var markup = processingFile.processingFile(input + "/" + file.name);
        if (markup) {
            var filePath = path.extname(file.name) === '.txt'
                ? outputDir + "/" + path.basename(file.name, '.txt') + ".html"
                : outputDir + "/" + path.basename(file.name, '.md') + ".html";
            fs.writeFileSync(filePath, markup, { flag: 'w' });
            dists_1.push(filePath);
        }
    });
    var indexMarkup = ("<!DOCTYPE html>\n  <html lang=\"en\">\n    <head>\n    <meta charset=\"UTF-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"index.css\"> \n    <title>" + path.basename(input) + "</title>\n    </head>\n    <body>\n      <h1>" + path.basename(input) + "</h1>\n      <ul>\n        " + dists_1
        .map(function (dist) {
        return "<li><a href=\"" + path.relative(outputDir, dist) + "\">" + path.basename(dist, '.html') + "</a></li>";
    })
        .join('\n') + "\n      </ul>\n    </body>\n  </html>")
        .split(/\n\s+/)
        .join('\n');
    fs.writeFileSync(outputDir + "/index.html", indexMarkup, { flag: 'w' });
}
else {
    console.error(input + ": No such file or directory");
    process.exit(1);
}
