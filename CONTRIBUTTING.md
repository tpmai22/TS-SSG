## Environment set up

Kindly install `ts-node` in your VS code command line:

```
npm install typescript
npm install -g ts-node
```

Install all the necessary dependencies using:

```
npm install -g
```

## Static Analysis tools

We have helps form `ESLint` and `Prettier` before every commit but if you want to run it manually, you can use

```bash
npm run lint
npm run prettier
```

## Testing

`Test` is available to run by simply running

```bash
npm test

// Testing seperate modules
npm test module_name
```

To collect testing coverage

```bash
npm run coverage
```
