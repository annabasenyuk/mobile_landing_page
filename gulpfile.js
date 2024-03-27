// https://gulpjs.com/docs
// https://github.com/dlmanning/gulp-sass
// https://browsersync.io/docs/gulp
// https://github.com/gulp-sourcemaps/gulp-sourcemaps
// https://github.com/postcss/autoprefixer#gulp
// https://github.com/scniro/gulp-clean-css

const { src, dest, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cleanCss = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')

const paths = {
	baseDir: './src', // base directory for application
	css: {
		src: './src/styles/css/*.css', // target all css src files
		destination: './src/css', // destination for compiled css files
		distribution: './public', // destination for distribution ready css files
	},
	html: {
		src: './src/index.html', // target index.html
		distribution: './public', // destination for distribution ready html files
	},
	sass: {
		src: './src/styles/**/*.+(scss|sass)', // target all sass source sass files
	},
}

function compileCss() {
	return src(paths.sass.src) // grab the target source files
		.pipe(sourcemaps.init()) // initialize sourcemaps for advanced debugging
		.pipe(sass().on('error', sass.logError)) // use sass function to compile to css
		.pipe(postcss([autoprefixer()])) // add vendor prefixes
		.pipe(sourcemaps.write('./')) // sourecemap output location relative to css output
		.pipe(dest(paths.css.destination)) // pipe css output to a destination folder
		.pipe(browserSync.stream()) // auto inject css changes into the browser
}

function minifyCss() {
	return src(paths.css.src) // target css files
		.pipe(cleanCss({ compatibility: 'ie8' })) // minify css files
		.pipe(dest(paths.css.distribution)) // pipe minified css to distribution folder
}

function minifyHtml() {
	return (
		src(paths.html.src) // target html file
			// minify html file
			.pipe(
				htmlmin({
					collapseWhitespace: true,
					removeComments: true,
				})
			)
			.pipe(dest(paths.html.distribution)) // pipe minified html to distribution folder
	)
}

function reloadHtml() {
	return src(paths.html.src) // target html file
		.pipe(browserSync.stream()) // auto inject html changes into browser
}

function develop() {
	// initialize development server from the base directory
	browserSync.init({
		server: {
			baseDir: paths.baseDir,
		},
	})

	// watch src files, run functions on change
	watch(paths.sass.src, compileCss)
	watch(paths.html.src, reloadHtml)
}

// define a public gulp task `gulp sync` to compile code and spin up a development server
exports.sync = series(compileCss, develop)

// define a public gulp task `gulp build` to create a distribution ready build
exports.build = parallel(series(compileCss, minifyCss), minifyHtml)