/*==========================*/
/* gulp、プラグインの読み込み */
/*==========================*/
const gulp = require("gulp");
const sass = require("gulp-dart-sass"); //Dart Sass
const notify = require("gulp-notify"); //エラー発生でアラート
const plumber = require("gulp-plumber"); //エラーでも強制終了しない
const autoprefixer = require("gulp-autoprefixer"); //ベンダープレフィックス自動付与
const postcss = require("gulp-postcss"); //css-mqpacker
const mqpacker = require("css-mqpacker"); //メディアクエリをまとめる

/*==========================*/
/* フォルダ・ファイルを指定 */
/*==========================*/
const srcPath = "../_assets/scss/**/*.scss"; //scssファイル読み込み
const distPath = "../css/"; //コンパイルしたcssファイルの出力先

/*==========================*/
/* プラグイン設定 */
/*==========================*/
//ベンダープレフィックス
const TARGET_BROWSERS = [
  "last 2 versions", //各ブラウザの2世代前までのバージョンを担保
  "ie >= 11", //IE11を担保
];

/*==========================*/
/* タスク実行 */
/*==========================*/
const cssSass = () => {
  return gulp
    .src(srcPath, { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler: notify.onError("Error:<%= error.message %>"), //エラーが出ても処理を止めない
      })
    )
    .pipe(
      sass({
        outputStyle: "compressed", //指定できるキー expanded or compressed
      })
    )
    .pipe(
      autoprefixer(TARGET_BROWSERS) //ベンダープレフィックス自動付与
    )
    .pipe(
      postcss([mqpacker()]) //メディアクエリをまとめる
    )
    .pipe(
      gulp.dest(distPath, {
        sourcemaps: "./", //コンパイル先
      })
    )
    .pipe(
      notify({
        message: "Sassをコンパイルしました！",
        onLast: true,
      })
    );
};

/*==========================*/
/* ファイル監視 */
/*==========================*/
const watchFiles = () => {
  gulp.watch(srcPath, gulp.series(cssSass));
};
exports.default = gulp.series(gulp.parallel(cssSass), gulp.parallel(watchFiles));
