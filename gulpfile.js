const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const del = require("del");
const uglify = require('gulp-uglify');
const env = require('gulp-env');
const nodemon = require('gulp-nodemon');
const pm2 = require('pm2');
const exec = require('gulp-exec');


gulp.task("clean", function () {
  return del("dist");
});

gulp.task('build', ['clean'], () => {
    return gulp.src('server/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('set_env', function(){
    env({
        file: '.env.json',
        vars: {
        // any variables you want to overwrite 
        }
    });
})

gulp.task('nodemon', ['build', 'set_env'], function() {
 
  const stream = nodemon({
    script: 'dist/server.js'
  });
  
  stream
      .on('restart', function () {
        console.log('restarted!')
      })
      .on('crash', function() {
        console.error('Application has crashed!\n')
         stream.emit('restart', 1)  // restart the server in 1 seconds
      })
});


gulp.task('prod:server:pm2', function () {
    env({
        file: '.env.json',
        vars: {
        // any variables you want to overwrite 
        }
    });
    pm2.connect(true, function () {
        pm2.start({
            name: 'twiliotestserver',
            script: 'dist/server.js'
        }, function () {
            console.log('pm2 started');
            pm2.streamLogs('all', 0);
            pm2.disconnect();
        });
    });
});

gulp.task('default', [ 'nodemon']);
gulp.task('serve', [ 'nodemon']);