import argv from '../argv';

describe('test different comman line arguement', () => {
  const parsedArgs = (args: string[]) => {
    const argvs = argv(args);
    return {
      input: argvs.input,
    };
  };

  describe('default options', () => {
    const defaultOptions = {
      input: 'testFolder',
    };

    test('no extra options', () => {
      expect(parsedArgs(['-i', 'testFolder'])).toEqual(defaultOptions);
    });
  });
});
