angular.module('app.space').factory('spaceService', ['$http', function($http) {
  var spaceServiceFactory = {};

  var _getSpaces = function() {
    // params
    var url = '/v2/spaces';

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

  var _getSpaceSummary = function(id, ignoreLoadingBar) {
    if (typeof(ignoreLoadingBar) === 'undefined') ignoreLoadingBar = false;
    // params
    var url = '/v2/spaces/' + id + '/summary';

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
      ignoreLoadingBar: ignoreLoadingBar
    };

    return $http.get(url, config);
  };

  var _getServicesForTheSpace = function(id) {
    // params
    var url = '/v2/spaces/' + id + '/services';
    var params = {
      'inline-relations-depth': 1
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      params: params,
      headers: headers
    };

    return $http.get(url, config);
  };

    var _getServicesInstancesForTheSpace = function(id) {
    // params
    var url = '/v2/spaces/' + id + '/service_instances';

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

  var _getApplicationsForTheSpace = function(id) {
    // params
    var url = '/v2/spaces/' + id + '/apps';

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
  //create by ssy
  var _getRoutesForTheSpace = function(id) {
    // params
    var url = '/v2/spaces/' + id + '/routes';

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

  var _retrieveRolesOfAllUsersForTheSpace = function(id) {
    
    // params
    var url = '/v2/spaces/' + id +  '/user_roles';

    // http headers
    headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.get(url, config);
  };
  

  var _editSpace = function(space) {
    
    var url = '/v2/spaces/' + space.id;

    // data
    var data = {
      'name': space.name
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

  var _addSpace = function(space) {
    
    var url = '/v2/spaces';

    // data
    var data = {
      'name': space.name,
      'organization_guid': space.organizationId
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
  
  var _deleteSpace = function(id) {
    
    var url = '/v2/spaces/' + id + '?recursive=true';

    // data
    var data = {
      'guid' : id
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

  var _associateManagerWithSpace = function(user) {

    var url = '/v2/spaces/' + user.spaceId + '/managers';

    // data
    var data = {
      'username': user.name,
      //'organization_guid': user.organizationId
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
//create by ssy
  var _associateSpaceWithSpaceQuata = function(guid,space_guid) {

    var url = '/v2/space_quota_definitions/' + guid + '/spaces/'+space_guid;

    // data
    var data = {
      'guid': guid,
      'space_guid':space_guid,
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

  var _disassociateManagerWithSpace = function(user) {
    
    var url = '/v2/spaces/' + user.spaceId + '/managers/' + user.id;
      //'username': user.username,
      //'organization_guid': user.organizationId

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
    };

    return $http.delete(url, config);
  };

  var _associateDeveloperWithSpace = function(user) {
    
    var url = '/v2/spaces/' + user.spaceId + '/developers';

    // data
    var data = {
      'username': user.name,
      //'organization_guid': user.organizationId
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

  var _disassociateDeveloperWithSpace = function(user) {
    
    var url = '/v2/spaces/' + user.spaceId + '/developers/' + user.id;
      //'username': user.username,
      //'organization_guid': user.organizationId

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
    };

    return $http.delete(url, config);
  };

    var _associateAuditorWithSpace = function(user) {
    
    var url = '/v2/spaces/' + user.spaceId + '/auditors';
    
    // data
    var data = {
      'username': user.name,
      //'organization_guid': user.organizationId
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

  var _disassociateAuditorWithSpace = function(user) {
    
    var url = '/v2/spaces/' + user.spaceId + '/auditors/' + user.id;
      //'username': user.username,
      //'organization_guid': user.organizationId

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers,
    };

    return $http.delete(url, config);
  };

  var _getDomainsForTheSpace = function(id) {
    // params
    var url = '/v2/spaces/' + id + '/domains';

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.delete(url, config);
  };

  // add by mas 20160720
  var _getAuditorsForTheSpace = function(id) {
    // params
    var url = '/v2/spaces/' + id + '/auditors';

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.delete(url, config);
  };


  // add by mas 20160721
  var _getDevelopersForTheSpace = function(id) {
    // params
    var url = '/v2/spaces/' + id + '/developers';

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.delete(url, config);
  };

  // add by mas 20160721
  var _getManagersForTheSpace = function(id) {
    // params
    var url = '/v2/spaces/' + id + '/managers';

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.delete(url, config);
  };

  // add by ssy 20160721
  var _getQuotaForTheSpace = function(guid) {
    // params
    var url = '/v2/space_quota_definitions/'+guid;

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


  // add by ssy 20160811
  var _getQuotas = function() {
    // params
    var url = '/v2/space_quota_definitions';

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

  // add by ssy 20160721
  var _getSpace = function(id) {
    // params
    var url = '/v2/spaces/'+id;

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



  var _addSpaceQuota = function(spaceQuota) {

    var url = '/v2/space_quota_definitions';

    // data
    var data = {
      'name': spaceQuota.name,
      'organization_guid': spaceQuota.organization_guid,
      'non_basic_services_allowed': spaceQuota.non_basic_services_allowed,
      'total_services': spaceQuota.total_services,
      'total_routes': spaceQuota.total_routes,
      'memory_limit': spaceQuota.memory_limit
     /* 'total_reserved_route_ports': spaceQuota.total_reserved_route_ports,
      'total_service_keys': spaceQuota.total_service_keys,
      'instance_memory_limit': spaceQuota.instance_memory_limit,
      'app_instance_limit': spaceQuota.app_instance_limit,
      'app_task_limit': spaceQuota.app_task_limit*/

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


  var _deleteSpaceQuota = function(guid) {

    var url = '/v2/space_quota_definitions/' + guid;


    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.delete(url, config);
  };
  //create by ssy
  var _editSpace = function (space) {

    var url = '/v2/spaces/' + space.id;

    // data
    var data = {
      'name': space.name,
    };

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data, config);
  };
//create by ssy
  var _editSpaceQuota = function (quota) {

    var url = '/v2/space_quota_definitions/' + quota.guid;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    };

    var config = {
      headers: headers
    };

    return $http.put(url, quota, config);
  };


  spaceServiceFactory.getAuditorsForTheSpace=_getAuditorsForTheSpace; //add by mas 20160720
  spaceServiceFactory.getDevelopersForTheSpace=_getDevelopersForTheSpace; //add by mas 20160721
  spaceServiceFactory.getManagersForTheSpace=_getManagersForTheSpace; //add by mas 20160721
  spaceServiceFactory.getQuotaForTheSpace=_getQuotaForTheSpace; //add by ssy 20160721
  spaceServiceFactory.getQuotas=_getQuotas; //add by ssy 20160721
  spaceServiceFactory.getSpace=_getSpace; //add by ssy 20160721
  spaceServiceFactory.getRoutesForTheSpace = _getRoutesForTheSpace;//add by ssy 20160722
  spaceServiceFactory.associateSpaceWithSpaceQuata = _associateSpaceWithSpaceQuata;//add by ssy 20160804
  spaceServiceFactory.editSpaceQuota = _editSpaceQuota; //add by ssy 20160808
  spaceServiceFactory.editSpace = _editSpace;//add by ssy 20160804
  spaceServiceFactory.getSpaces = _getSpaces;
  spaceServiceFactory.getSpaceSummary = _getSpaceSummary;
  spaceServiceFactory.getServicesForTheSpace = _getServicesForTheSpace;
  spaceServiceFactory.getServicesInstancesForTheSpace = _getServicesInstancesForTheSpace;
  spaceServiceFactory.getApplicationsForTheSpace = _getApplicationsForTheSpace;
  spaceServiceFactory.addSpace = _addSpace;
  spaceServiceFactory.deleteSpace = _deleteSpace;
  spaceServiceFactory.retrieveRolesOfAllUsersForTheSpace = _retrieveRolesOfAllUsersForTheSpace;
  spaceServiceFactory.associateManagerWithSpace = _associateManagerWithSpace;
  spaceServiceFactory.disassociateManagerWithSpace = _disassociateManagerWithSpace;
  spaceServiceFactory.associateDeveloperWithSpace = _associateDeveloperWithSpace;
  spaceServiceFactory.disassociateDeveloperWithSpace = _disassociateDeveloperWithSpace;
  spaceServiceFactory.associateAuditorWithSpace = _associateAuditorWithSpace;
  spaceServiceFactory.disassociateAuditorWithSpace = _disassociateAuditorWithSpace;

  spaceServiceFactory.getDomainsForTheSpace = _getDomainsForTheSpace;

  spaceServiceFactory.addSpaceQuota = _addSpaceQuota;
  spaceServiceFactory.deleteSpaceQuota = _deleteSpaceQuota;

  return spaceServiceFactory;
}]);