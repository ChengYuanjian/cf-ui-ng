angular.module('app.application').factory('applicationService', ['$q', '$http', function($q, $http) {
  var applicationServiceFactory = {};
  
  var _getApplications = function() {
    
    var url = '/v2/apps';

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.get(url, config);
  };
  
  var _getApplicationSummary = function(id) {
    
    var url = '/v2/apps/' + id + '/summary';

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.get(url, config);
  };
  
  var _getStack = function(id) {
    
    var url = '/v2/stacks/' + id;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.get(url, config);
  };
  
  var _getInstances = function(id) {
    
    var url = '/v2/apps/' + id + '/stats';


    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
    };

    return $http.get(url, config);
  };
  
  var _getAppEvents = function(id) {
    
    var url = '/v2/events?order-direction=desc&q=actee:' + id + '&results-per-page=5';

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.get(url, config);
  };
  
  var _getEnvironmentVariables = function(id) {
    
    var url = '/v2/apps/' + id + '/env';

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.get(url, config);
  };
  
  var _getServiceBindings = function(id) {
    
    // params
    var url = '/v2/apps/' + id + '/service_bindings';
    var params = {
      'inline-relations-depth': 1
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
      params: params
    };

    return $http.get(url, config);
  };

  var _createApplication = function(application) {
    
    var url = '/v2/apps';

    // data
    var data = {
      'name': application.name,
      'space_guid': application.spaceId,
      'memory': application.memory,
      'instances': application.instances,
      'disk_quota': application.disk_quota,
      'buildpack': application.buildpack,
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.post(url, data, config);
  };

  var _addApplication = function(app) {
    var promises = [];
    var resources = [];

    for ( var i = 0; i < app.bits.length; i++) {
      var fd = new FormData();
      var url = '/v2/apps/' + app.id +'/bits';

      // data
      /*var data = {
        'url': '/v2/apps/' + application.id +'/bits',
        'resources': resources,
        'application': fd
      };*/
      var application = app.bits[i];

      fd.append("url", url);
      fd.append("application", application);
      fd.append("resources", resources);

      // http headers
      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data; boundary=AaB03x'
      };

      var config = {
        headers: headers,
      };

      promises.push($http.put('/request.php', fd, config));
    }

    return $q.all(promises);
    
  };
  
  var _editApplication = function(application) {
    
    var url = '/v2/apps/' + application.id;

    // data
    var data = {
      'name': application.name,
     /* 'state': application.state*/
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data, config);
  };
  
  var _deleteApplication = function(applicationId) {
    
    var url = '/v2/apps/' + applicationId;

    // data
    var data = {
      'guid' : applicationId
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
      data: data
    };
    
    return $http.delete(url, config);
  };
  
  // environment variables
  var _editApplicationEnv = function(applicationId, userEnvs) {
    
    var url = '/v2/apps/' + applicationId;

    // data
    var data = {
      'environment_json': userEnvs
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data, config);
  };
  
  var _stopApplication = function(applicationId) {
    
    var url = '/v2/apps/' + applicationId;

    // data
    var data = {
      'state': 'STOPPED'
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data, config);
  };
  
  var _startApplication = function(applicationId) {
    
    var url = '/v2/apps/' + applicationId;

    // data
    var data = {
      'state': 'STARTED'
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data, config);
  };
  
  var _scaleApplication = function(applicationId, scale) {
    
    var url = '/v2/apps/' + applicationId;

    // data
    var data = {
      'instances': scale.instances,
      'memory': scale.memory
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data, config);
  };


  var _associaterouteApplication = function(app) {

    var url = '/v2/apps/' + app.guid + '/routes/' + app.route_guid;

    // data
    var data = {
      'guid': app.guid,
      'route_guid': app.route_guid
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data, config);
  };


  var _removerouteApplication = function(app) {

    var url = '/v2/apps/' + app.guid + '/routes/' + app.route_guid;


    // data
    var data = {
      'guid': app.guid,
      'route_guid': app.route_guid
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
      data: data
    };


    return $http.delete(url,config);
  };

  var _stateApplication = function(application) {

    var url = '/v2/apps/' + application.id;

    // data
    var data = {
       'state': application.state
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data, config);
  };


  var _addApplicationOne = function(app) {

      var url = '/v2/apps/' + app.id +'/bits';

      // http headers
      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      };

      var config = {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      };
      var data  = {
        application:app.application
      };
    var fd = new FormData();
    fd.append("resources","[]");
    fd.append("application",app.application);
    return $http.put(url, fd, config) ;
    //return $http.put(url, data, config);

  };

  var _upload = function(file) {

    var data = {
      'filename': file.name,
      'relativePath': file.relativePath,
      'size':file.size,
      'uniqueIdentifier':file.uniqueIdentifier
    };


    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data;'
    };

    var config = {
      headers: headers,
    };
    return $http.post('/request.php', data, config) ;
    //return $http.put(url, data, config);

  };

  var _updateApp=function(app){

    var url = '/v2/apps/' + app.guid ;
    // data
    var data = app;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.put(url,data,config);

  };

  var _updateAppEnv=function(guid,appEnvInfo){

    var url = '/v2/apps/' + guid ;
    // data
    var data = {
      environment_json:appEnvInfo
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.put(url,data,config);

  };

  var _retrieveOneAPP=function(guid){
    var url = '/v2/apps/' + guid ;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.get(url,config);
  };
  
  applicationServiceFactory.getApplications = _getApplications;
  applicationServiceFactory.getApplicationSummary = _getApplicationSummary;
  applicationServiceFactory.retrieveOneAPP = _retrieveOneAPP;
  applicationServiceFactory.getStack = _getStack;
  applicationServiceFactory.getInstances = _getInstances;
  applicationServiceFactory.getAppEvents = _getAppEvents;
  applicationServiceFactory.getEnvironmentVariables = _getEnvironmentVariables;
  applicationServiceFactory.getServiceBindings = _getServiceBindings;
  applicationServiceFactory.createApplication = _createApplication;
  applicationServiceFactory.addApplication = _addApplication;
  applicationServiceFactory.editApplication = _editApplication;
  applicationServiceFactory.editApplicationEnv = _editApplicationEnv;
  applicationServiceFactory.deleteApplication = _deleteApplication;
  applicationServiceFactory.stopApplication = _stopApplication;
  applicationServiceFactory.startApplication = _startApplication;
  applicationServiceFactory.scaleApplication = _scaleApplication;

  applicationServiceFactory.associaterouteApplication = _associaterouteApplication;
  applicationServiceFactory.removerouteApplication = _removerouteApplication;

  applicationServiceFactory.stateApplication = _stateApplication;

  applicationServiceFactory.addApplicationOne = _addApplicationOne;
  applicationServiceFactory.updateApp = _updateApp;
  applicationServiceFactory.updateAppEnv = _updateAppEnv;

  applicationServiceFactory.upload = _upload;
  
  return applicationServiceFactory;
}]);