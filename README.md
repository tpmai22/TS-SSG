# TS-SSG

**TG-SSG** is a static site generator using Typescript.

> An _SSG_ (Static Site Generator) is a tool for generating a complete HTML web site from raw data.
> This SSG is full markdown support

## Options

```
Options:
  -i, --input       File or folder to be parsed              [string] [required]
  -c, --config      Configuration file                                  [string]
  -h, --help        Show help                                          [boolean]
  -v, --version     Show version number                                [boolean]
```

## Quick review

[Preview](https://beamazedvariable.github.io/TS-SSG/)

## How to use

Example command line:

```
ts-node src/index.ts -i .\testFolder\
```

Using config file:

```
ts-node src/index.ts -c src/config.json
```

## License

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
