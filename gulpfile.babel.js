'use strict';

// Core
import browsersync from 'browser-sync';
import gulp from 'gulp';
import history from 'connect-history-api-fallback';

// Filesystem
import buffer from 'vinyl-buffer';
import del from 'del';
import livereactload from 'livereactload';
import source from 'vinyl-source-stream';
import watchify from 'watchify';

// JavaScript
import babelify from 'babelify';
import browserify from 'browserify';
import htmlReplace from 'gulp-html-replace';
import uglify from 'gulp-uglify';

// CSS
import cssnext from 'cssnext';
import postcss from 'gulp-postcss';

// Browsersync server instance
let server = browsersync.create();

// File paths
const paths = {
  build: './build',
  dist: './dist',
  cssInput: 'css/app.css',
  cssOutput: 'css/app.css',
  jsInput: 'js/init.jsx',
  jsOutput: 'js/app.js',
  jsOutputExternals: 'js/externals.js',
  source: './src',
};

// For faster development, make 2 bundles. One for your app (which changes regularly) and
// one for 3rd party libraries (which don't). List the libraries here.
const externalLibs = [
    'react',
    'react/addons',
];

gulp.task('default', (cb) => {
  console.log('Use "npm run build" instead.');
});

/**
 * Create a production-ready build.
 */
gulp.task('dist', ['css-production'], (cb) => {
  let start = Date.now();
  console.log('Starting production build...');

  copyHtml(false);

  return makeBundle().bundle()
    .pipe(source(paths.jsOutput))
    .pipe(buffer()) // Convert to buffered file for uglify.
    .pipe(uglify()) // Minify output.
    .pipe(gulp.dest(paths.dist))
    .on('finish', () => {
      logDuration(start);
      startServer(paths.dist);
    });
});

/**
 * Development build task.
 */
gulp.task('build', ['css-dev', 'build-externals'], (cb) => {
  copyHtml(true);

  // Start Browserify, will compile all of our source files.
  let bundler = makeBundle(true);

  // Bundles (builds) the app.
  let rebundle = () => {
    let start = Date.now();
    console.log('Build started...');

    return bundler.bundle()
      .pipe(source(paths.jsOutput))
      .pipe(gulp.dest(paths.build))
      .pipe(livereactload.gulpnotify())
      .on('finish', () => {
        logDuration(start);
      });
  };

  // Trigger a build each time we change a file.
  bundler = watchify(bundler)
    .on('update', rebundle);

  // Kick off the first build.
  rebundle().on('finish', () => {
    startServer(paths.build);

    // Listen for live reloads.
    livereactload.listen();
  });
});

/**
 * Bundle and copy the external libs.
 */
gulp.task('build-externals', (cb) => {
  // Wipe the JS folder.
  del.sync(`${paths.build}/js`);

  // Bundle only the external libs.
  let bundler = browserify({
    debug: true,            // Sourcemaps for development.
    extensions: ['.jsx'],   // JSX files used by React.
    insertGlobals: false,   // True = faster build but larger file.
    require: externalLibs,  // Files to bundle.
  });

  return bundler.bundle()
    .pipe(source(paths.jsOutputExternals))
    .pipe(gulp.dest(paths.build));
});

/**
 * Development-only CSS build.
 */
gulp.task('css-dev', (cb) => {
  // Watch for changes.
  gulp.watch(`${paths.source}/css/**/*.css`, (event) => {
    let start = Date.now();
    console.log(`CSS changed. Build started...`);

    compileCss(true).on('finish', () => {
      logDuration(start);
    });
  });

  return compileCss(true);
});

/**
 * Production-ready CSS build.
 */
gulp.task('css-production', (cb) => {
  return compileCss(false);
});

/**
 * Compile, minify etc. CSS.
 *
 * @param  {Boolean} isDev Dev build or production build?
 */
let compileCss = (isDev) => {
  let inputPath = `${paths.source}/${paths.cssInput}`;
  let outputPath = `${isDev ? paths.build : paths.dist}/css`;

  del.sync(outputPath);

  let processors = [
    cssnext({
      browsers: ['last 1 version'],   // Browsers to support. https://github.com/ai/browserslist#readme
      compress: !isDev,               // Uses http://cssnano.co
      from: inputPath,                // For more accurate source maps.
      import: true,                   // Inline @import'ed files.
      sourcemap: isDev,               // Allow modern devtools to link back to your source files.
    }),
  ];

  return gulp.src(inputPath)
    .pipe(postcss(processors))
    .pipe(gulp.dest(outputPath))
    .pipe(server.stream());
};

/**
 * Copy HTML files to build folder.
 // *
 * @param {Boolean} isDev Is this for develpment?
 */
let copyHtml = (isDev) => {
  let path = isDev ? paths.build : paths.dist;
  let jsFiles = [paths.jsOutput];

  isDev && jsFiles.unshift(paths.jsOutputExternals);

  // Wipe existing HTML.
  del.sync(`${path}/*.html`);

  let stream = gulp.src(`${paths.source}/index.html`);

  return stream.pipe(htmlReplace({
    js: jsFiles,
  })).pipe(gulp.dest(path));
};

/**
 * Create a new Browserify bundle.
 *
 * @param  {Boolean} isDev Non-dev builds optimised for filesize.
 * @return {Object}        Browserify bundle.
 */
let makeBundle = (isDev) => {
  let transform = [babelify];               // ES2015
  isDev && transform.push(livereactload);   // Live reloads.

  let bundler = browserify(
    `${paths.source}/${paths.jsInput}`,
    {
      debug: isDev,                         // Sourcemaps for development.
      extensions: ['.jsx'],                 // JSX files used by React.
      insertGlobals: isDev,                 // True = faster build but larger file.
      transform: transform,                 // Process the files.
      cache: isDev ? {} : undefined,        // Needed for watchify.
      packageCache: isDev ? {} : undefined, // Needed for watchify.
      fullPaths: isDev,                     // Needed for watchify.
    }
  );

  // Mark 3rd party libs which should not be compiled into our development build.
  isDev && externalLibs.forEach((lib) => bundler.external(lib));

  return bundler;
};

/**
 * Log the time between a given start and now.
 *
 * @param  {Number} start Time duration should be calculated from.
 */
let logDuration = (start) => {
  let duration = (Date.now() - start) / 1000;
  console.log(`Completed in ${duration.toFixed(1)}s`);
};

/**
 * Start a browser-sync server.
 *
 * @param  {String} baseDir Path to serve from.
 */
let startServer = (baseDir) => {
  // Start browser-sync.
  server.init({
    ghostMode: false, // Set to true to sync clicks and scrolls across all open windows.
    middleware: [
      history(),      // Directs webpage requests to index.html (for HTML5 pushState).
    ],
    server: baseDir,  // Files to serve.
    watchOptions: {   // Let LiveReactLoad handle JS changes.
      ignoreInitial: true,
      ignored: '*.js',
    },
  });
};
