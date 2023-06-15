// importing the gulp modules
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

// function to join plugins style files
function joinCSSPlugins() {
  return gulp
    .src("src/libs/**/*.css")
    .pipe(concat("plugins.css"))
    .pipe(gulp.dest("dist/css/"))
    .pipe(browserSync.stream());
}

// gulp task for join plugins style files
exports.joinCSSPlugins = joinCSSPlugins;

// function to compile sass and add prefixes
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

// gulp task for the sass function
exports.compileSass = compileSass;

function joinJSPlugins() {
  return gulp
    .src("src/libs/**/*.js")
    .pipe(concat("plugins.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/"))
    .pipe(browserSync.stream());
}

// gulp task for join plugins script files
exports.joinJSPlugins = joinJSPlugins;

// function to join the internal script files
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

// gulp task for join internal js files
exports.joinJS = joinJS;

// function to init browser server
function createServer() {
  browserSync.init({
    server: {
      baseDir: "dist/",
    },
  });
}

// gulp task for init browser-sync
exports.createServer = createServer;

// gulp function to watch changes on files
function watchGulp() {
  // watching any change on plugins style files
  gulp.watch("src/libs/**/*.css", joinCSSPlugins);

  // watching any change on .scss files
  gulp.watch("src/scss/*.scss", compileSass);

  // watching any change on plugins script files
  gulp.watch("src/libs/**/*.js", joinJSPlugins);

  // watching any change on internal script files
  gulp.watch("src/js/*.js", joinJS);

  // reloading the server if any change happen
  gulp.watch(["dist/*.html"]).on("change", browserSync.reload);
}

// gulp task for watch
exports.watchGulp = watchGulp;

// default task that will be executed when called "gulp" on terminal
exports.default = gulp.parallel(
  watchGulp,
  joinCSSPlugins,
  compileSass,
  joinJSPlugins,
  joinJS,
  createServer
);
