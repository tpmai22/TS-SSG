"use strict";
var _a = require('../html-maker'), processingFile = _a.processingFile, processMarkdown = _a.processMarkdown;
describe('testing HTML generator', function () {
    it('should return blank with invalid file extension', function () {
        var fileName = 'test.dat';
        expect(processingFile(fileName)).toEqual('');
    });
    it('should return correct markdown for mock content', function () {
        var mockData = '## Testing testing';
        expect(processMarkdown(mockData)).toMatch('<h2>Testing testing</h2>');
    });
});
