module.exports = {
  angular:{
    src:[
      'bower_components/jquery/dist/jquery.min.js',

      'bower_components/angular/angular.js',

      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',

      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/angular-ui-utils/ui-utils.js',
      'bower_components/angular-smart-table/dist/smart-table.js',
      'bower_components/angular-ui-grid/ui-grid.js',
      'bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
      'bower_components/angular-dialog-service/dialogs.js',
      'bower_components/toastr/toastr.js',

      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-confirm-modal/angular-confirm.js',

      'bower_components/oclazyload/dist/ocLazyLoad.js',
      'bower_components/flot/jquery.flot.js',
      'bower_components/ng-flow/dist/ng-flow-standalone.min.js',

      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
      'bower_components/angular-spinner/angular-spinner.js',
      'bower_components/spin.js/spin.js',

      'src/js/*.js',
      'src/js/directives/*.js',
      'src/js/services/*.js',
      'src/js/services/message/*.js',
      'src/js/services/organization/*.js',
      'src/js/filters/*.js',
      'src/js/controllers/bootstrap.js'
    ],
    dest:'angular/js/app.src.js'
  }
}
