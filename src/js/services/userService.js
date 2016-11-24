angular.module('app.user').factory('userService', ['$http', function($http) {
  var userServiceFactory = {};

  var userAuthInfo;

  var UAA_API;

  $http.get('/info').success(function(response) {
    UAA_API = response.token_endpoint;
  });

  var _setUserAuthInfo=function(_userAuthInfo){
    userAuthInfo=_userAuthInfo;
  };

  var _getUserAuthInfo=function(){
     return userAuthInfo;
  };

  var _getUserSummary = function(id) {

    var url = '/v2/users/' + id+'/summary';

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

  var _deleteUser = function(user) {

    var url = '/v2/users/' + user.metadata.guid;

    // data
    var data = {
      'guid' : user.metadata.guid,
      'async' : false
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

  //delete user
  var _deleteUser1 = function(user) {

    var url = '/v2/users/' + user.guid;

    // data
    var data = {
      'guid' : user.guid,
      'async' : false
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

  var _deleteUaaUser=function(user){
    var url='/Users/'+user.guid;
    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UAA-Endpoint': UAA_API,
      'myurl':'/'+user.guid
    };

    var config = {
      headers: headers
    };
    return $http.delete(url, config);
  };

  var _getUsers = function(id) {

    var url = '/v2/users';

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

  //update uaa user
  var _updateUaaUser=function(uaaUser){
    var url='/Users/'+uaaUser.guid;
    // data
    var data={
      userName:uaaUser.username,
      emails:[{value:uaaUser.email}],
      phoneNumbers:[{value:uaaUser.phone}],
      name:{givenName:uaaUser.username,familyName:uaaUser.username}
    };
    // http headers
    var headers = {
      'If-Match':'*',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UAA-Endpoint': UAA_API,
      'myurl':'/'+uaaUser.guid
    };

    var config = {
      headers: headers
    };
    return $http.put(url, data, config);
  };

  var _addUaaUser=function(uaaUser){
    var url='/Users';
    // data
    var data={
      userName:uaaUser.username,
      emails:[{value:uaaUser.email}],
      password:uaaUser.password,
      name:{givenName:uaaUser.username,familyName:uaaUser.username},
      phoneNumbers:[{value:uaaUser.phone}]
    };
    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UAA-Endpoint': UAA_API,
      'myurl':''
    };

    var config = {
      headers: headers
    };
    return $http.post(url, data, config);
  };


  var _addUser = function(user){
    var url ='/v2/users';
    // data
    var data = {
      'guid': user.guid,
      'default_space_guid': user.default_space_guid
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

  //org_manager
  var _associateManagedOrgWithUser=function(user){
    var url = '/v2/users/'+user.guid+'/managed_organizations/'+user.orgGuid;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'guid':user.guid,
      'managed_organization_guid':user.orgGuid
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data,config);
  };

  //org_manager1
  var _associateManagedOrgWithUser1=function(user){
    var url = '/v2/organizations/'+user.orgGuid+'/managers/'+user.guid;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'guid':user.guid,
      'manager_guid':user.orgGuid
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data,config);
  };

  //org_audit
  var _associateAuditedOrgWithUser=function(user){
    var url = '/v2/users/'+user.guid+'/audited_organizations/'+user.orgGuid;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'guid':user.guid,
      'audited_organization_guid':user.orgGuid
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data,config);
  };

  //org_audit1
  var _associateAuditedOrgWithUser1=function(user){
    var url = '/v2/organizations/'+user.orgGuid+'/auditors/'+user.guid;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'guid':user.guid,
      'auditor_guid':user.orgGuid
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data,config);
  };

  //org_billing
  var _associateBillingManagerWithUser=function(user){
    var url = '/v2/organizations/'+user.orgGuid+'/billing_managers/'+user.guid;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'guid':user.orgGuid,
      'billing_manager_guid':user.guid
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data,config);
  };

  //space_manager
  var _associateManagedSpaWithUser=function(user){
    var url = '/v2/users/'+user.guid+'/managed_spaces/'+user.spaGuid;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'guid':user.guid,
      'managed_space_guid':user.spaGuid
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data,config);
  };

  //space_audit
  var _associateAuditedSpaWithUser=function(user){
    var url = '/v2/users/'+user.guid+'/audited_spaces/'+user.spaGuid;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'guid':user.guid,
      'audited_space_guid':user.spaGuid
    };

    var config = {
      headers: headers
    };

    return $http.put(url, data,config);
  };

  //space_developer
  var _associateDeveloperSpaWithUser=function(user){
    var url = '/v2/spaces/'+user.spaGuid+'/developers/'+user.guid;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'guid':user.spaGuid,
      'developer_guid':user.guid
    };

    var config = {
      headers: headers
    };

    return $http.put(url,data,config);
  };

  var _associateDeveloperSpaWithUser1 =function(user){
    var url = '/v2/spaces/'+user.spaGuid+'/developers';

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'username':user.userName
    };

    var config = {
      headers: headers
    };

    return $http.put(url,data,config);
  };

  var _associateDeveloperSpaWithUser2 =function(user){
    var url = '/v2/users/'+user.guid+'/spaces/'+user.spaGuid;

    // http headers
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var config = {
      headers: headers
    };

    return $http.put(url,config);
  };


  var _removeManagedOrgWithUser=function(userGuid,orgGuid){
    var url = '/v2/users/'+userGuid+'/managed_organizations/'+orgGuid;

    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
    };

    var config = {
      headers: headers
    };

    return $http.delete(url,data,config);
  };

  var _removedOrgWithUser=function(userGuid,orgGuid){
    var url = '/v2/users/'+userGuid+'/organizations/'+orgGuid;

    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'guid':userGuid,
      'organization_guid':orgGuid
    };

    var config = {
      headers: headers
    };

    return $http.delete(url,data,config);
  };

  var _removedSpaceWithUser=function(userGuid,spaGuid){
    var url = '/v2/users/'+userGuid+'/spaces/'+spaGuid;

    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    var data={
      'guid':userGuid,
      'space_guid':spaGuid
    };

    var config = {
      headers: headers
    };

    return $http.delete(url,data,config);
  };

  var _getAllUaaUsers1=function(){
    var url='/Users';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UAA-Endpoint': UAA_API,
      'myurl':''
      //'myurl':'?attributes=id,userName,emails,phoneNumbers,meta'
    };

    var params={
      'attributes':'id,userName,emails,phoneNumbers,meta'
    };
    var config = {
      params:params,
      headers: headers
    };

    return $http.get(url,config);
  };

  var _getAllUaaUsers=function(){
    var url='/Users';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UAA-Endpoint': UAA_API,
      'myurl':''
    };

    var params={
    };
    var config = {
      params:params,
      headers: headers
    };

    return $http.get(url,config);
  };

  var _getUaaUser=function(id){
    var url='/Users';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UAA-Endpoint': UAA_API,
      'myurl':''
      //'myurl':'?attributes=id,userName,emails,phoneNumbers,meta&filter=id eq \''+id+'\''
    };

    var params={
      'attributes':'id,userName,emails,phoneNumbers,meta',
      'filter':'id eq \'' +id+'\''
    };
    var config = {
      params:params,
      headers: headers
    };
    return $http.get(url,config);
  };

  var _changeUserPassword=function(user){
    var url='/Users/'+user.guid+'/password';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UAA-Endpoint': UAA_API,
      'myurl':'/'+user.guid+'/password'
    };

    var data={
      "schemas":["urn:scim:schemas:core:1.0"],
      "oldPassword":user.oldPassword,
      "password":user.newPassword
    };

    var config = {
      headers: headers
    };

    return $http.put(url,data,config);
  };


  var _changeUserPassword1=function(uaaUser){
    var url='/Users/'+uaaUser.guid;
    // data
    var data={
      password:uaaUser.password
    };
    // http headers
    var headers = {
      'If-Match':'*',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UAA-Endpoint': UAA_API,
      'myurl':'/'+uaaUser.guid
    };

    var config = {
      headers: headers
    };
    return $http.put(url, data, config);
  };

  var _getUserInfo=function(){
    var url='/userinfo';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UAA-Endpoint': UAA_API
    };
    var config = {
      headers: headers
    };
    return $http.get(url,config);
  };

  var _getUserOrgs=function(userGuid){
    var url='/v2/users/'+userGuid+'/organizations';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var config = {
      headers: headers
    };
    return $http.get(url,config);
  };

  var _getUserManagerOrgs=function(userGuid){
    var url='/v2/users/'+userGuid+'/managed_organizations';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var config = {
      headers: headers
    };
    return $http.get(url,config);
  };

  var _getUserBillManagerOrgs=function(userGuid){
    var url='/v2/users/'+userGuid+'/billing_managed_organizations';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var config = {
      headers: headers
    };
    return $http.get(url,config);
  };

  var _getUserAuditOrgs=function(userGuid){
    var url='/v2/users/'+userGuid+'/audited_organizations';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var config = {
      headers: headers
    };
    return $http.get(url,config);
  };

  var _getUserSpas=function(userGuid){
    var url='/v2/users/'+userGuid+'/spaces';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var config = {
      headers: headers
    };
    return $http.get(url,config);
  };

  var _getUserManagerSpas=function(userGuid){
    var url='/v2/users/'+userGuid+'/managed_spaces';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var config = {
      headers: headers
    };
    return $http.get(url,config);
  };

  var _getUserAuditSpas=function(userGuid){
    var url='/v2/users/'+userGuid+'/audited_spaces';
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var config = {
      headers: headers
    };
    return $http.get(url,config);
  };


  userServiceFactory.setUserAuthInfo=_setUserAuthInfo;
  userServiceFactory.getUserAuthInfo=_getUserAuthInfo;
  userServiceFactory.getUserOrgs=_getUserOrgs;
  userServiceFactory.getUserManagerOrgs=_getUserManagerOrgs;
  userServiceFactory.getUserBillManagerOrgs=_getUserBillManagerOrgs;
  userServiceFactory.getUserAuditOrgs=_getUserAuditOrgs;
  userServiceFactory.getUserSpas=_getUserSpas;
  userServiceFactory.getUserManagerSpas=_getUserManagerSpas;
  userServiceFactory.getUserAuditSpas=_getUserAuditSpas;
  userServiceFactory.getUserInfo=_getUserInfo;
  userServiceFactory.getUserSummary = _getUserSummary;
  userServiceFactory.getAllUaaUsers=_getAllUaaUsers;
  userServiceFactory.changeUserPassword=_changeUserPassword;
  userServiceFactory.changeUserPassword1=_changeUserPassword1;
  userServiceFactory.getAllUaaUsers1=_getAllUaaUsers1;
  userServiceFactory.getUaaUser=_getUaaUser;
  userServiceFactory.deleteUser = _deleteUser;
  userServiceFactory.deleteUser1 = _deleteUser1;
  userServiceFactory.deleteUaaUser=_deleteUaaUser;
  userServiceFactory.getUsers = _getUsers;
  userServiceFactory.removeManagedOrgWithUser=_removeManagedOrgWithUser;
  userServiceFactory.removedOrgWithUser=_removedOrgWithUser;
  userServiceFactory.removedSpaceWithUser=_removedSpaceWithUser;
  userServiceFactory.associateManagedOrgWithUser=_associateManagedOrgWithUser;
  userServiceFactory.associateManagedOrgWithUser1=_associateManagedOrgWithUser1;
  userServiceFactory.associateAuditedOrgWithUser=_associateAuditedOrgWithUser;
  userServiceFactory.associateAuditedOrgWithUser1=_associateAuditedOrgWithUser1;
  userServiceFactory.associateDeveloperSpaWithUser2=_associateDeveloperSpaWithUser2;
  userServiceFactory.associateBillingManagerWithUser=_associateBillingManagerWithUser;
  userServiceFactory.associateManagedSpaWithUser=_associateManagedSpaWithUser;
  userServiceFactory.associateAuditedSpaWithUser=_associateAuditedSpaWithUser;
  userServiceFactory.associateDeveloperSpaWithUser=_associateDeveloperSpaWithUser;
  userServiceFactory.associateDeveloperSpaWithUser1=_associateDeveloperSpaWithUser1;
  userServiceFactory.addUser=_addUser;
  userServiceFactory.addUaaUser=_addUaaUser;
  userServiceFactory.updateUaaUser=_updateUaaUser;
  return userServiceFactory;
}]);
