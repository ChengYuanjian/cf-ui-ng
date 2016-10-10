angular.module('app.organization').factory('organizationService', ['$http', function ($http) {
    var organizationServiceFactory = {};

    var _getOrganizations = function () {

        var accessToken = localStorage.getItem('accessToken');

        var url = '/v2/organizations';

        // http headers
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        var config = {
            headers: headers
        };

        return $http.get('/v2/organizations', config);
    };

    var _getOrganization = function (id) {

        var url = '/v2/organizations/' + id;

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

    var _getSpacesForTheOrganization = function (id, ignoreLoadingBar) {
        if (typeof(ignoreLoadingBar) === 'undefined') ignoreLoadingBar = false;
        // params
        var url = '/v2/organizations/' + id + '/spaces';

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

    var _getQuotaForTheOrganization = function (id) {
        // params
        var url = '/v2/quota_definitions/' + id;

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

    var _getSharedDomainsForTheOrganization = function () {

        var url = '/v2/shared_domains';

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

    var _getPrivateDomainsForTheOrganization = function (id) {

        var url = '/v2/organizations/' + id + '/private_domains';

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

    var _getAllUsersForTheOrganization = function (id) {

        // params
        var url = '/v2/organizations/' + id + '/users';

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

    var _retrieveRolesOfAllUsersForTheOrganization = function (id) {

        var url = '/v2/organizations/' + id + '/user_roles';

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

    var _addOrganization = function (organization) {

        var url = '/v2/organizations';

        // data
        var data = {
            'name': organization.name,
            'quota_definition_guid': organization.quota_definition_guid
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

    var _editOrganization = function (organization) {

        var url = '/v2/organizations/' + organization.id;

        // data
        var data = {
            'name': organization.name
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

    var _deleteOrganization = function (organization) {

        var url = '/v2/organizations/' + organization.id + '?recursive=false';

        // data
        var data = {
            'guid': organization.id,
            'async': false,
            'recursive': true
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

    var _associateUserWithOrganization = function (user) {

        var url = '/v2/organizations/' + user.organizationId + '/users';

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

    var _disassociateUserWithOrganization = function (user) {

        var url = '/v2/organizations/' + user.organizationId + '/users/' + user.id;


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

    var _associateManagerWithOrganization = function (user) {

        var url = '/v2/organizations/' + user.organizationId + '/managers';

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

    var _disassociateManagerWithOrganization = function (user) {

        var url = '/v2/organizations/' + user.organizationId + '/managers/' + user.id;
        //'username': user.username,
        //'organization_guid': user.organizationId
        //};

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

    var _associateBillingManagerWithOrganization = function (user) {

        var url = '/v2/organizations/' + user.organizationId + '/billing_managers';

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

    var _disassociateBillingManagerWithOrganization = function (user) {

        var url = '/v2/organizations/' + user.organizationId + '/billing_managers/' + user.id;
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

    var _associateAuditorWithOrganization = function (user) {

        var url = '/v2/organizations/' + user.organizationId + '/auditors';

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

    var _disassociateAuditorWithOrganization = function (user) {

        var url = '/v2/organizations/' + user.organizationId + '/auditors/' + user.id;
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

    var _getInstanceUsage = function (id) {

        var url = '/v2/organizations/' + id + '/instance_usage';

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

    var _getMemoryUsage = function (id) {

        var url = '/v2/organizations/' + id + '/memory_usage';

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

    var _addQuota = function (quota) {

        var url = '/v2/quota_definitions';

        // data
        var data = {
            'name': quota.name,
            'non_basic_services_allowed': true,
            'total_services': parseInt(quota.total_services),
            'total_routes': parseInt(quota.total_routes),
            'total_private_domains': parseInt(quota.total_private_domains),
            'memory_limit': parseInt(quota.memory_limit),
            'instance_memory_limit': parseInt(quota.instance_memory_limit),
            'app_instance_limit': parseInt(quota.app_instance_limit)
        }

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

    var _deleteQuota = function (guid) {

        var url = '/v2/quota_definitions/' + guid + '?async=true';
        //'username': user.username,
        //'organization_guid': user.organizationId
        //};

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

    var _deletePrivateDomains = function (orgId, domainId) {

        var url = '/v2/quota_definitions/' + orgId + '/private_domains/' + domainId;

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

    var _editQuotaForOrganization = function (quota) {

        var url = '/v2/quota_definitions/' + quota.guid;

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

    var _getAllPrivateDomains = function () {

        var url = '/v2/private_domains';

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

    var _associateDomainWithOrganization = function(domain){
        var url = '/v2/organizations/' + domain.organizationId + '/private_domains/' + domain.id;

        // http headers
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        var config = {
            headers: headers,
        };

        return $http.put(url, config);
    };

    var _disassociateDomainWithOrganization = function(domain){
        var url = '/v2/organizations/' + domain.organizationId + '/private_domains/' + domain.id;

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

    var _getServicesForTheOrganization = function(organizationId){
        var url = '/v2/organizations/' + organizationId + '/services';

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

    var _getSpaceSummaryForTheOrganization = function(organizationId){
        var url = '/v2/organizations/' + organizationId + '/summary';

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

    var _privateDomains = [];
    var _bindedUsers = [];


    organizationServiceFactory.getOrganizations = _getOrganizations;
    organizationServiceFactory.getOrganization = _getOrganization;
    organizationServiceFactory.getQuotaForTheOrganization = _getQuotaForTheOrganization;
    organizationServiceFactory.getSpacesForTheOrganization = _getSpacesForTheOrganization;
    organizationServiceFactory.getSharedDomainsForTheOrganization = _getSharedDomainsForTheOrganization;
    organizationServiceFactory.getPrivateDomainsForTheOrganization = _getPrivateDomainsForTheOrganization;
    organizationServiceFactory.getAllUsersForTheOrganization = _getAllUsersForTheOrganization;
    organizationServiceFactory.retrieveRolesOfAllUsersForTheOrganization = _retrieveRolesOfAllUsersForTheOrganization;
    organizationServiceFactory.addOrganization = _addOrganization;
    organizationServiceFactory.editOrganization = _editOrganization;
    organizationServiceFactory.deleteOrganization = _deleteOrganization;
    organizationServiceFactory.associateUserWithOrganization = _associateUserWithOrganization;
    organizationServiceFactory.disassociateUserWithOrganization = _disassociateUserWithOrganization;
    organizationServiceFactory.associateManagerWithOrganization = _associateManagerWithOrganization;
    organizationServiceFactory.disassociateManagerWithOrganization = _disassociateManagerWithOrganization;
    organizationServiceFactory.associateBillingManagerWithOrganization = _associateBillingManagerWithOrganization;
    organizationServiceFactory.disassociateBillingManagerWithOrganization = _disassociateBillingManagerWithOrganization;
    organizationServiceFactory.associateAuditorWithOrganization = _associateAuditorWithOrganization;
    organizationServiceFactory.disassociateAuditorWithOrganization = _disassociateAuditorWithOrganization;
    organizationServiceFactory.getInstanceUsage = _getInstanceUsage;
    organizationServiceFactory.getMemoryUsage = _getMemoryUsage;
    organizationServiceFactory.addQuota = _addQuota;
    organizationServiceFactory.deleteQuota = _deleteQuota;
    organizationServiceFactory.deletePrivateDomains = _deletePrivateDomains;
    organizationServiceFactory.editQuotaForOrganization = _editQuotaForOrganization;
    organizationServiceFactory.getAllPrivateDomains = _getAllPrivateDomains;
    organizationServiceFactory.associateDomainWithOrganization = _associateDomainWithOrganization;
    organizationServiceFactory.disassociateDomainWithOrganization = _disassociateDomainWithOrganization;
    organizationServiceFactory.getServicesForTheOrganization = _getServicesForTheOrganization;
    organizationServiceFactory.getSpaceSummaryForTheOrganization = _getSpaceSummaryForTheOrganization;

    organizationServiceFactory.objArrayMins = function (objArray1, objArray2, key) {
        if(objArray2&&objArray2.length>0){
            var result = [];
            for(var i=0;i<objArray1.length;i++){
                var obj = objArray1[i];
                var value = obj[key];
                var isExist = false;
                for(var j=0;j<objArray2.length;j++){
                    if(value == objArray2[j][key]){
                        isExist = true;
                        break;
                    }
                }
                if(!isExist)
                    result.push(obj);
            }
            return result;
        }
        return objArray1;
    };

    organizationServiceFactory.getPrivateDomains = function () {
        return _privateDomains;
    };
    organizationServiceFactory.setPrivateDomains = function (privateDomains) {
        _privateDomains = privateDomains;
    };
    organizationServiceFactory.getBindedUsers = function () {
        return _bindedUsers;
    };
    organizationServiceFactory.setBindedUsers = function (bindedUsers) {
        _bindedUsers = bindedUsers;
    };

    return organizationServiceFactory;
}]);
