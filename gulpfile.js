var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var connect = require('gulp-connect');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');

var files = {
	css: {
		vendor: [
			'live/bower_components/font-awesome/css/font-awesome.min.css',
			'live/bower_components/toastr/toastr.min.css',
			'live/vendors/highlight/highlight.min.css',
			'live/bower_components/select2/dist/css/select2.min.css',
			'live/vendors/awesome-bootstrap-checkbox/checkbox.css',
			'live/bower_components/codemirror/addon/dialog/dialog.css',
			'live/bower_components/codemirror/lib/codemirror.css',
			'live/bower_components/codemirror/addon/fold/foldgutter.css',
			'live/bower_components/bootstrap/dist/css/bootstrap.min.css'
		],
		custom: ['live/src/css/*.css']
	},
	js: {
		vendor: [
			'live/bower_components/underscore/underscore-min.js',
			'live/bower_components/appbase-js/browser/appbase.min.js',
			'live/bower_components/jquery/dist/jquery.min.js',
			'live/bower_components/bootstrap/dist/js/bootstrap.min.js',
			'live/bower_components/toastr/toastr.min.js',
			'live/bower_components/crypto-js/crypto-js.js',
			'live/bower_components/codemirror/lib/codemirror.js',
			'live/bower_components/codemirror/addon/edit/matchbrackets.js',
			'live/bower_components/codemirror/addon/edit/closebrackets.js',
			'live/bower_components/codemirror/addon/fold/foldcode.js',
			'live/bower_components/codemirror/addon/fold/foldgutter.js',
			'live/bower_components/codemirror/addon/fold/brace-fold.js',
			'live/bower_components/codemirror/mode/javascript/javascript.js',
			'live/bower_components/select2/dist/js/select2.full.min.js',
			'live/bower_components/highlightjs/highlight.pack.min.js',
			'live/bower_components/lzma/src/lzma.js',
			'live/bower_components/urlsafe-base64/app.js',
			'live/bower_components/auth0.js/build/auth0.min.js',
			'live/bower_components/moment/min/moment.min.js',
			'live/bower_components/file-saver/FileSaver.min.js'
		],
		custom: [

		]
	},
	folders: {
		assets: 'live/assets/**/*',
		dist: 'live/dist/**/*',
		src: 'live/src/**/*',
		vendors: 'live/vendors/**/*',
		buttons: 'live/buttons/**/*',
		importer: 'live/importer/**/*'
	},
	moveFiles: [
		'live/index.html',
		'live/config.js',
		'manifest.json',
		'background.js'
	]
};

gulp.task('browserify', function() {
	var b = browserify({
		entries: ['live/src/js/app.js'],
		debug: true
	});
	b.transform(reactify); // use the reactify transform
	return b.bundle()
		.pipe(source('main.js'))
		.pipe(gulp.dest('./live/dist'))
		.pipe(connect.reload());
});

gulp.task('vendorcss', function() {
	return gulp.src(files.css.vendor)
		.pipe(concat('vendor.min.css'))
		.pipe(gulp.dest('live/dist/css'));
});

gulp.task('customcss', function() {
	return gulp.src(files.css.custom)
		.pipe(minifyCSS())
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('live/dist/css'));
});


gulp.task('cssChanges', ['customcss'], function() {
	connect.reload();
});

gulp.task('vendorjs', function() {
	return gulp.src(files.js.vendor)
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('live/dist/js'));
});

gulp.task('customjs', function() {
	return gulp.src(files.js.custom)
		.pipe(concat('custom.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(uglify())
		.pipe(concat('custom.min.js'))
		.pipe(gulp.dest('live/dist/js'));
});

gulp.task('moveCss', function() {
	return gulp.src(['live/bower_components/bootstrap/dist/css/bootstrap.min.css.map'])
		.pipe(gulp.dest('live/dist/css'));
});

gulp.task('moveFonts', function() {
	return gulp.src(['live/bower_components/bootstrap/dist/fonts/*',
			'live/bower_components/font-awesome/fonts/*',
			'live/assets/fonts/*'
		])
		.pipe(gulp.dest('live/dist/fonts'));
});

gulp.task('moveJs', function() {
	return gulp.src(['live/bower_components/lzma/src/lzma_worker.js',
			'live/vendors/JSONURL.js'
		])
		.pipe(gulp.dest('live/dist/vendor'));
});

gulp.task('connect', function() {
	connect.server({
		root: 'live',
		livereload: true,
		port: 8000,
    fallback: 'live/index.html'
	});
});

gulp.task('bundle', [
	'customcss',
	'vendorcss',
	'vendorjs',
	'customjs',
	'moveCss',
	'moveFonts',
	'moveJs'
]);


gulp.task('watch', ['bundle'], function() {
	gulp.watch('live/**/*.js', ['bundle']);
});

gulp.task('chromeBuild', ['bundle'], function() {
	var folders_length = Object.keys(files.folders).length;
	for (folder in files.folders) {
		gulp.src(files.folders[folder])
			.pipe(gulp.dest('./dejavu-unpacked/' + folder));
	}
	gulp.src(files.moveFiles)
		.pipe(gulp.dest('./dejavu-unpacked'));
});

gulp.task('ghpagesBuild', ['bundle'], function() {
	var folders_length = Object.keys(files.folders).length;
	for (folder in files.folders) {
		gulp.src(files.folders[folder])
			.pipe(gulp.dest('./live/' + folder));
	}
	gulp.src(files.moveFiles)
		.pipe(gulp.dest('./live'));
});

gulp.task('default', ['bundle']);
