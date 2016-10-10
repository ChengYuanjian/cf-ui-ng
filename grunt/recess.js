module.exports = {
	less: {
        files: {
          'src/css/app.css': [
            'src/css/less/app.less'
          ]
        },
        options: {
          compile: true
        }
    },
    angular: {
        files: {
            'angular/css/app.min.css': [
                'bower_components/bootstrap/dist/css/bootstrap.css',
                'bower_components/animate.css/animate.css',
                'bower_components/font-awesome/css/font-awesome.css',
                'bower_components/simple-line-icons/css/simple-line-icons.css',
                'bower_components/angular-ui-grid/ui-grid.css',
                'bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css',
                'bower_components/angular-ui-tree/dist/angular-ui-tree.css',
                'bower_components/angular-dialog-service/dialogs.css',
                'src/css/*.css'
            ]
        },
        options: {
            compress: true
        }
    },
		qstar: {
        files: {
            'qstar/css/app.min.css': [
                'bower_components/bootstrap/dist/css/bootstrap.css',
                'bower_components/animate.css/animate.css',
                'bower_components/font-awesome/css/font-awesome.css',
                'bower_components/simple-line-icons/css/simple-line-icons.css',
                'qstar_src/css/*.css'
            ]
        },
        options: {
            compress: true
        }
    },
		truepaas: {
				files: {
						'truepaas/css/app.min.css': [
								'bower_components/bootstrap/dist/css/bootstrap.css',
								'bower_components/animate.css/animate.css',
								'bower_components/font-awesome/css/font-awesome.css',
								'bower_components/simple-line-icons/css/simple-line-icons.css',
								'truepaas_src/css/*.css'
						]
				},
				options: {
						compress: true
				}
		}
}
