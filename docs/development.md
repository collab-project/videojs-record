# Development

Install dependencies using npm:

```console
npm install
```

Build a minified version:

```console
npm run build
```

Generated files are placed in the `dist` directory.

During development:

```console
npm run start
```

This will watch the source directory and rebuild when any changes
are detected. It will also serve the files on http://127.0.0.1:8080.

Generate the API documentation (placed in the `docs/api` directory):

```console
npm run docs
```

All commands for development are listed in the `package.json` file and
are run using:

```console
npm run <command>
```

To view a list of all available commands:

```console
npm run --list
```
