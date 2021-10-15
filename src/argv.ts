import * as yargs from 'yargs';

const argv = yargs
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
  .alias('version', 'v').argv as {
  input: string;
  _: (string | number)[];
  $0: string;
};

export default argv;