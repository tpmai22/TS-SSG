"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var argv_1 = __importDefault(require("../argv"));
describe('test different comman line arguement', function () {
    var parsedArgs = function (args) {
        var argvs = (0, argv_1.default)(args);
        return {
            input: argvs.input,
        };
    };
    describe('default options', function () {
        var defaultOptions = {
            input: 'testFolder',
        };
        test('no extra options', function () {
            expect(parsedArgs(['-i', 'testFolder'])).toEqual(defaultOptions);
        });
    });
});
