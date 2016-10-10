app.controller('LogoutCtl', ['$scope', '$state', '$log', '$stateParams','authService', 'notificationService', function($scope, $state, $log, $stateParams, authService, notificationService) {

  $scope.authentication = authService.authentication;
  $scope.logout = function() {
    // $route.reload();
    $state.go('access.login')
    authService.logout();
    notificationService.success("注销成功");
  };
}]);
