const ReactTestRenderer = require('react-test-renderer');
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

it('processMarkdown to HTML renders correctly', () => {
  const data = `# this is a header 1 
   # this is a **header** line.
   also regular.
   ## this is a header again.
   ### heading wooooooo
   that the 2 lines "this is header line" and "`;
  let testData = processMarkdown(data);

  const tree = ReactTestRenderer.create(testData).toJSON();
  expect(tree).toMatchSnapshot();
});
