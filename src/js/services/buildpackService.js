/**
 * Created by wocao on 2016/7/26.
 */
angular.module('app.buildpack').factory('buildpackService', ['$http', function($http) {
    var buildpackServiceFactory = {};

    var _getBuildpacks = function() {
        // params
        var url = '/v2/buildpacks';

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




    buildpackServiceFactory.getBuildpacks=_getBuildpacks;

    return buildpackServiceFactory;
}]);
