"use strict";

var gulp = require("gulp"),
    wiredep = require("wiredep").stream,
    useref = require("gulp-useref"),
    gulpif = require("gulp-if"),
    uglify = require("gulp-uglify"),
    clean = require("gulp-clean"),
    minifyCss = require("gulp-minify-css");

var path = {
	indexFile: "./app/index.html",
	scripts: "./app/**/*.js",
	styles: "./app/**/*.css",
	images: "./app/img/**/*",
	views: "./app/views/*.*",
	store: "./app/store/*.*",
	fonts: "./app/bower_components/bootstrap-material-design/dist/fonts/**/*.{ttf,woff,eof,svg}",
	dest: {
		root: "../www",
		scripts: "../www/js",
		styles: "../www/css",
		htmls: "../www",
		fonts: "../www/fonts",
		images: "../www/images",
		views: "../www/views",
		store: "../www/store/",
	}
};

gulp.task("copy-fonts", function () {
	gulp.src(path.fonts)
	.pipe(gulp.dest(path.dest.fonts	));
});

gulp.task("copy-images", function () {
	gulp.src(path.images)
	.pipe(gulp.dest(path.dest.images));
});

gulp.task("copy-views", function () {
	gulp.src(path.views)
	.pipe(gulp.dest(path.dest.views));
});

gulp.task("copy-store", function () {
	gulp.src(path.store)
	.pipe(gulp.dest(path.dest.store));
});

gulp.task("build", function () {
    var assets = useref.assets();

    return gulp.src("./app/*.html")
        .pipe(assets)
        .pipe(gulpif("*.js", uglify()))
        .pipe(gulpif("*.css", minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(path.dest.root));
});

gulp.task("inline-bower", function () {
    gulp.src(path.indexFile)
        .pipe(wiredep({
            directory : "app/bower_components"
        }))
        .pipe(gulp.dest("./app"));
});

gulp.task("watch", function () {
	gulp.watch("bower.json", ["inline-bower"]);
    gulp.watch(path.indexFile, ["build"]);
    gulp.watch(path.views, ["build"]);
    gulp.watch(path.scripts, ["build"]);
    gulp.watch(path.styles, ["build"]);
});

gulp.task("copy-content", ["copy-images", "copy-fonts", "copy-views", "copy-store"]);

gulp.task("default", ["copy-content", "inline-bower", "watch"]);
