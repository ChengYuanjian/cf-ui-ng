angular.module('app')
.directive('loading', ['$timeout', function ($timeout) {
     return {
       restrict: 'E',
       replace:true,
      template: '<div class="loading_page"><div class="sk-cube-grid">\
  <div class="sk-cube sk-cube1"></div>\
  <div class="sk-cube sk-cube2"></div>\
  <div class="sk-cube sk-cube3"></div>\
  <div class="sk-cube sk-cube4"></div>\
  <div class="sk-cube sk-cube5"></div>\
  <div class="sk-cube sk-cube6"></div>\
  <div class="sk-cube sk-cube7"></div>\
  <div class="sk-cube sk-cube8"></div>\
  <div class="sk-cube sk-cube9"></div>\
  <div class="sk-cube-text">处理中</div>\
</div></div>',
       link: function (scope, element, attr) {
             scope.$watch('activeCalls', function (newVal, oldVal) {
                if (newVal == 0) {
                    $(element).hide();
                    scope.onloading = 0;
                } else {
                  if(scope.onloading == 0) {
                    scope.onloading = 1;
                    $timeout(function () {
                      if (scope.onloading != 0){
                        $(element).show();
                      }
                    }, 300);
                  }
                }
            });
       }
     }
   }]
);
