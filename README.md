# Project 2 @cmda-minor-web · 2018-2019

[🚀 Live demo 🚀](https://cmda-minor-project-2.herokuapp.com/)

An useful server-side rendered application built with the data of Mirabeau for Mirabeau employees to make more of their day.

## Concept

Mirabeau employees will want to see a list of all rooms that exist, and with it their statistics (like temperature) in real-time. There will be a subtle difference between rooms that are available and those that are not in the design.
Employees can navigate to a detail page of a room, where they get to see more detailed information about the room, as well as a comparison of the environmental conditions in this room that are comparable to a list of countries at this month of the year. With each country there is an image shown of an animal (or similar) that is the national animal of that country, so the employees learn something on a day to day basis about the world, instead of just about code and business. 🐈 🦁

## Core functionality

The core functionality of this application is to provide Mirabeau employees with useful information about their meeting rooms.

## Reliable

The employee must be able to trust the data that is presented to them.

## Usable

It must be accessible for pretty much everyone, disregarding disability, browser or internet speed.

## Pleasurable

Provide the user with additional useful features, mainly with JavaScript.

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
* [Compile and minify](./gulpfile.js#L24) the client-side TypeScript. This reduced the **time to first byte** as well as improving the speed at which the page is **first shown**.
* [Meta description](./server/src/views/partials/head.ejs#L3) tag to increase **SEO scrore**.
* [Minify](./gulpfile.js#L11) the CSS. This reduced the **time to first byte**, as well as improving the speed at which the page is **first shown**.
* [Robots.txt](./server/public/robots.txt) to increase **SEO scrore**.
* Has an [offline page](./server/src/views/pages/offline.ejs).
* Make use of a **service worker** to view visited pages when **offline**.
* Provides the core functionality fine without JavaScript.
* PWA standalone support.
* Server-side rendering to increase perfomance for **first view**.
* Use a web font (WOFF and WOFF2), with only a subset of all characters (only Latin).
* Use aria-label to describe to people that are using screen-readers what certain links do.

## Future enhancements

* Increase performance on **first view** (caused by the size of prefetched data).
* Add progressive enhancements with JavaScript.

## Honourable mentions

* [Dennis Wegereef](https://github.com/Denniswegereef) for setting up the API on Digital Ocean.

## License

This repository is licensed as [MIT](LICENSE) by [Maikel van Veen](https://github.com/maikxx).