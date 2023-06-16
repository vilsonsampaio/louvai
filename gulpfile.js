const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

function compileSass() {
  return gulp
    .src("src/scss/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 3 versions"],
        cascade: false,
      })
    )
    .pipe(concat("all.min.css"))
    .pipe(gulp.dest("dist/css/"))
    .pipe(browserSync.stream());
}

exports.compileSass = compileSass;

function joinJS() {
  return gulp
    .src(["src/js/*.js"])
    .pipe(concat("all.min.js"))
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/"))
    .pipe(browserSync.stream());
}

exports.joinJS = joinJS;

function createServer() {
  browserSync.init({
    server: {
      baseDir: "dist/",
    },
  });
}

exports.createServer = createServer;

function watchGulp() {
  gulp.watch("src/scss/*.scss", compileSass);
  gulp.watch("src/js/*.js", joinJS);
  gulp.watch(["dist/*.html"]).on("change", browserSync.reload);
}

exports.watchGulp = watchGulp;

exports.default = gulp.parallel(watchGulp, compileSass, joinJS, createServer);
