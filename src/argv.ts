import yargs from 'yargs';

export interface ARGV {
  input: string;
}

const argv = (args: string[] = process.argv.slice(2)): ARGV =>
  yargs(args)
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
    .alias('version', 'v').argv as ARGV;

export default argv;
