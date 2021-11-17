const { processingFile, processMarkdown } = require('../html-maker');

describe('testing HTML generator', () => {
  it('should return blank with invalid file extension', () => {
    const fileName = 'test.dat';
    expect(processingFile(fileName)).toEqual('');
  });

  it('should return correct markdown for mock content', () => {
    const mockData = '## Testing testing';
    expect(processMarkdown(mockData)).toMatch('<h2>Testing testing</h2>');
  });
});
