"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var argv = function (args) {
    if (args === void 0) { args = process.argv.slice(2); }
    return (0, yargs_1.default)(args)
        .option({
        input: {
            alias: 'i',
            describe: 'Text file to create an html file',
            type: 'string',
            demandOption: true,
            requiresArg: true,
        },
    })
        .config()
        .alias('config', 'c')
        .help()
        .alias('help', 'h')
        .version()
        .alias('version', 'v').argv;
};
exports.default = argv;
