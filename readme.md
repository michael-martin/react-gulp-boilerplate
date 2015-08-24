This repo is essentially a build process for React. It doesn't pick out a Flux library, CSS framework or anything like that. Instead, it's a blank slate with the best developer workflow I've been able to put together so far (Feel free to suggest improvements!).

I use it as the starting point for any React app I build. As there are no React tools picked out, I can still use whatever libraries I want for each individual project.

# Is this Boilerplate For You?

* Rebuild your app **without losing state**. [LiveReactLoad](https://github.com/milankinen/livereactload) mimics Webpack's killer feature, hot-loading.
  * The boilerplate comes with a simple "Hello World" that demonstrates how cool LiveReactLoad is. You'll never go back.
* Run your app in a local [Browsersync](http://www.browsersync.io/) server.
  * Browsersync rocks because it doesn't just serve your site locally. It also sets up an external address which you can connect to from any device on the same wifi. Want to see local builds and live-reloading on your iPhone? Easy.
* **Future-proof CSS** using [PostCSS](https://github.com/postcss/postcss) and [CSS Next](http://cssnext.io/).
  * Stop using SASS/LESS/Stylus-specific syntax. Get the same features [with future CSS instead](http://cssnext.io/features/).
  * Changes are automatically rebuilt and injected into the page (Without a refresh).
  * Browser-prefixes automatically applied, and CSS minified for production.
* **Ultra-fast development builds** because your 3rd party dependencies are split into their own bundle. When you change files, Browserify only re-compiles your own source files.
* **ES6 / ES2015** (Obviously)
  * Cool sidenote; Gulp now supports ES2015 in the Gulpfile itself.
* ESLint for code quality.
  * Includes **React-specific rules** thanks to eslint-plugin-react. See all of the [available rules here](https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules).
  * Recommend installing an eslint plugin in your editor as well, e.g. for [Atom](https://github.com/AtomLinter/linter-eslint) or [Sublime Text 3](https://github.com/roadhump/SublimeLinter-eslint).
* Use the commands below to run Gulp locally. This prevent issues with different team members running different system versions.

![Screenshot](https://cloud.githubusercontent.com/assets/825998/9446468/c97f0b1e-4a89-11e5-9aa2-a940179ba758.png)

# How to Use

Clone the repository to your machine, then run:

```
npm install
```

For development (Sets up a local webserver, with automatic builds and live reloading), run:

```
npm run build
```

To create a production-ready build (minified, no automatic reloading), run:

```
npm run dist
```

# Specify your Dependencies

To speed up re-building during development, we compile 3rd party libraries you use once only (When you first run `npm run build`) and then ignore them in each future incremental build.

To keep your development builds fast, you should tell Browserify about other 3rd party libraries you install (Don't worry, nothing will break if you forget!).

To do this, look in `gulpfile.babel.js`. You will see a section near the top that looks like this:

```
const externalLibs = [
    'react',
    'react/addons',
];
```

Simple add a new line for each `import` you call after installing a library from npm.

# Folder Structure

* **build** - Your app will be compiled to this folder (And served from here) during development.
* **dist** - Production builds will be compiled to this folder, ready to deploy. A Browsersync server will also serve these files for any last sanity checking you want to do.
* **src** - Your application logic. Your work will all live in here.
* **src/js** - Your React app begins in `init.jsx`. Browserify will follow the `import` statements to compile your full app.
* **src/css** - These CSS files will be compiled with CSS Next, letting you use [future CSS features](http://cssnext.io/playground/) today.
* **src/index.html** - All page requests should load this HTML file. We use [gulp-html-replace](https://github.com/VFK/gulp-html-replace) to insert the right links for dev vs production.

# Todo

* Select unit test framework.

# Help / Issues?

Feel free to [raise an issue](https://github.com/michael-martin/react-gulp-boilerplate/issues) with any questions.

# Other Boilerplates

There are loads of ways to build React apps. If this flow isn't for you, here are some suggestions:

* [React Starter Kit](https://github.com/kriasoft/react-starter-kit) - Everything and the kitchen sink. If you want to build an app using their exact stack, this kit rocks.
* [Flux React Boilerplate](https://github.com/christianalfoni/flux-react-boilerplatee) - Flux with Gulp/Browserify, but no LiveReactLoad/CSSNext (This is where the idea to split bundles in dev came from, thanks!)
* [Webpack React Starter](https://github.com/webpack/react-starter) - If you prefer Webpack to Gulp/Browserify (PS - Check out [React Webpack Cookbook](https://christianalfoni.github.io/react-webpack-cookbook/)!)
* [Coffeescript React Quickstart](https://github.com/KyleAMathews/coffee-react-quickstart) - More Webpack, but tweaked for Coffeescript fans.
