angular.module('app.auth').factory('authInterceptorService', ['$q', '$location', '$injector', '$rootScope', '$log', function($q, $location, $injector, $rootScope, $log) {
  var authInterceptorServiceFactory = {};

  if ($rootScope.activeCalls == undefined) {
      $rootScope.activeCalls = 0;
  }

  var _request = function(config) {
    config.headers = config.headers || {};

    var accessToken = localStorage.getItem('accessToken');
    var userName = localStorage.getItem('userName');

    if (config.headers.Authorization === undefined && accessToken !== null && userName !== null) {
      config.headers.Authorization = 'Bearer ' + accessToken;
      //config.headers['X-Webui-Authorization'] = 'Bearer ' + accessToken;
    }

    var lastTime = localStorage.getItem('lastTime');

    var timeOut = Date.now() - lastTime;

    if (timeOut < 1800000){
      localStorage.setItem('lastTime', Date.now());
    }

    $rootScope.activeCalls += 1;
    return config;
  };

  var _responseError = function(rejection) {
    var deferred = $q.defer();
    var notificationService = $injector.get('notificationService');
    var timeOut = Date.now() - localStorage.getItem('lastTime');
    if ($rootScope.nrOfUnauthorizedRequests === 0 && rejection.status === 401 && (localStorage.getItem('accessToken')!== null)) {
      var authService = $injector.get('authService');
      $log.error(timeOut);
      if(timeOut > 1800000){
        authService.logout();
        localStorage.setItem('lastTime', 0);
        stateService.go("access.login");
      }

      authService.refresh().then(function(response) {
        _retryHttpRequest(rejection.config, deferred);
      },
      function (err) {
        authService.logout();
        var stateService = $injector.get("$state");
        stateService.go("access.login");

        if (err.error==='invalid_token'){
          notificationService.info('会话超时，请重新登录');
        }else{
          notificationService.info(err.error_description);
        }
        $log.error(err);
      });
    }
    //  else if (rejection.status === 401 || rejection.status === 403) {
    //   var stateService = $injector.get("$state");
    //   stateService.go("access.login");
    //   notificationService.error('未认证，请登录。');
    // }

    $rootScope.nrOfUnauthorizedRequests++;
     $rootScope.activeCalls -= 1;
    return $q.reject(rejection);
  };

  var _retryHttpRequest = function (config, deferred) {
      $http = $injector.get('$http');
      $http(config).then(function (response) {
          deferred.resolve(response);
      }, function (response) {
          deferred.reject(response);
      });
  }


  authInterceptorServiceFactory.request = _request;
  authInterceptorServiceFactory.requestError = function (rejection) {
      $rootScope.activeCalls -= 1;
      return rejection;
  };
  authInterceptorServiceFactory.response = function (response) {
      $rootScope.activeCalls -= 1;
      return response;
  };
  authInterceptorServiceFactory.responseError = _responseError;

  return authInterceptorServiceFactory;
}]);
