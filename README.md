# Project 2 @cmda-minor-web · 2018-2019

An usefull server-side rendered application built with the data of Mirabeau for Mirabeau.

## Table of Contents

1. [Installation](#Installation)
2. [Features](#Features)
3. [Future enhancements](#Future-enhancements)
4. [Honourable mentions](#Honourable-mentions)
5. [License](#License)

## Installation

* Make sure to install [yarn](https://yarnpkg.com/en/) or [npm](https://www.npmjs.com).
* Make sure the **port** specified in the [index.ts](server/src/index.ts) is available (defaults to 3000).

* Clone the repository: `git clone git@github.com:Maikxx/project-2-1819.git`.
* Navigate into the directory: `cd project-2-1819`.
* Install dependencies: `yarn` or `npm install`.
* Start the server with: `yarn start-server` or `npm run start-server`.

The build (`yarn build`) runs the TypeScript compiler first, turning the TypeScript files into JavaScript files in the `dist` folder.
The build process will then copy the `views` folder to the `dist` folder.

## Features

* [(Pre-)Compression](./server/src/services/decompressionService.ts) to increase performance for the **first view**.
* [Caching](./server/src/services/memoryCache.ts) to increase performance for the **repeat view**.
* [Meta description](./server/src/views/partials/head.ejs#L3) tag to increase **SEO scrore**.
* [Minify](./gulpfile.js#L11) the CSS. This reduced the **time to first byte**, as well as improving the speed at which the page is **first shown**.
* [Minify](./gulpfile.js#L24) the client-side JavaScript. This reduced the **time to first byte** as well as improving the speed at which the page is **first shown**.
* [Robots.txt](./server/public/robots.txt) to increase **SEO scrore**.
* Server-side rendering.
* Use a web font (WOFF and WOFF2), with only a subset of all characters (only Latin).

## Future enhancements

## Honourable mentions

* [Dennis Wegereef](https://github.com/Denniswegereef) for setting up the API on Digital Ocean.

## License

This repository is licensed as [MIT](LICENSE) by [Maikel van Veen](https://github.com/maikxx).