This is the branch for the website at https://collab-project.github.io/videojs-record


Install
-------

Install dependencies using npm:

```
npm install
```

Update Libraries
----------------

Check if there are updates using
[npm-check-updates](https://www.npmjs.com/package/npm-check-updates):

```
ncu
```

Verify available updates and then upgrade everything in `package.json`:

```
ncu -u
npm install
```

Copy updated libraries into repository:

```
npm run update
```

Update Examples
---------------

To update video.js version references in the example HTML files, change the
versions in ``scripts/update-videojs.sh`` and run it:

```
./scripts/update-videojs.sh
```

Development Server
------------------

During development:

```
npm run start
```

This will start a webserver on http://127.0.0.1:9999.

All commands for development are listed in the `package.json` file and
are run using:

```
npm run <command>
```

License
-------

This work is licensed under the [MIT License](https://github.com/collab-project/videojs-record/blob/master/LICENSE).
