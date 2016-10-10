angular.module('app.domain').factory('domainService', ['$http', function($http) {
  var domainServiceFactory = {};
  
  var _getSharedDomainsForTheOrganization = function(ignoreLoadingBar) {
    if (typeof(ignoreLoadingBar) === 'undefined') ignoreLoadingBar = false;
    
    // params
    var url = '/v2/shared_domains';

    // http headers
    headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
      ignoreLoadingBar: ignoreLoadingBar
    };

    return $http.get(url, config);
  };

  var _getAllDomains = function(ignoreLoadingBar) {
    if (typeof(ignoreLoadingBar) === 'undefined') ignoreLoadingBar = false;

    // params
    var url = '/v2/domains';

    // http headers
    headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
      ignoreLoadingBar: ignoreLoadingBar
    };

    return $http.get(url, config);
  };
  
  var _getPrivateDomainsForTheOrganization = function(id, ignoreLoadingBar) {
    if (typeof(ignoreLoadingBar) === 'undefined') ignoreLoadingBar = false;
    
    // params
    var url = '/v2/organizations/' + id +  '/private_domains';

    // http headers
    headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
      ignoreLoadingBar: ignoreLoadingBar
    };

    return $http.get(url, config);
  };
  
  var _addPrivateDomain = function(domain) {
    
    var url = '/v2/private_domains';

    // data
    var data = {
      'name': domain.name,
      'owning_organization_guid': domain.organizationID
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

  var _addSharedDomain = function(domain) {

    var url = '/v2/shared_domains';

    // data
    var data = {
      'name': domain.name,
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
  
  var _deletePrivateDomain = function(domainId) {
    
    var url = '/v2/private_domains/' + domainId + '?async=false';

    // data
    var data = {
      'guid' : domainId,
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

  var _deleteSharedDomain = function(domainId) {

    var url = '/v2/shared_domains/' + domainId + '?async=false';

    // data
    var data = {
      'guid' : domainId,
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
  
  domainServiceFactory.getPrivateDomainsForTheOrganization =_getPrivateDomainsForTheOrganization;
  domainServiceFactory.getSharedDomainsForTheOrganization =_getSharedDomainsForTheOrganization;
  domainServiceFactory.getAllDomains =_getAllDomains;  //create by ssy
  domainServiceFactory.addPrivateDomain = _addPrivateDomain; //create by ssy
  domainServiceFactory.addSharedDomain = _addSharedDomain; //create by ssy
  domainServiceFactory.deleteSharedDomain = _deleteSharedDomain; //create by ssy
  domainServiceFactory.deletePrivateDomain = _deletePrivateDomain; //create by ssy
  
  return domainServiceFactory;
}]);