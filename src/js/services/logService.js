angular.module('app.log').factory('logService', ['$http', function ($http) {
    var logServiceFactory = {};

    var _getAppsByAppIdAndTime = function (appid, starttime, endtime, count) {

        // data
        var url = '/log/getAppsByAppIdAndTime/' + appid + '/' + starttime + '/' + endtime + '/' + count;

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

    var _getAppsBySpaIdAndTime = function (spaid, starttime, endtime) {

        // data
        var url = '/log/getAppsBySpaIdAndTime/' + spaid + '/' + starttime + '/' + endtime;

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

    var _getHttpsByAppIdAndTime = function (appid, starttime, endtime) {

        // data
        var url = '/log/getHttpsByAppIdAndTime/' + appid + '/' + starttime + '/' + endtime;

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

    var _getHttpsBySpaIdAndTime = function (spaid, starttime, endtime) {

        // data
        var url = '/log/getHttpsBySpaIdAndTime/' + spaid + '/' + starttime + '/' + endtime;

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

    var _getOpersByAppIdAndTime = function (appid, starttime, endtime) {

        // data
        var url = '/log/getOpersByAppIdAndTime/' + appid + '/' + starttime + '/' + endtime;

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

    var _getOpersBySpaIdAndTime = function (spaid, starttime, endtime) {

        // data
        var url = '/log/getOpersBySpaIdAndTime/' + spaid + '/' + starttime + '/' + endtime;

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

    var _getAppsByAppId = function (appid, from, to) {

        // data
        var url = '/log/getAppsByAppId/' + appid + "/" + from + "/" + to;

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

    logServiceFactory.getAppsByAppIdAndTime = _getAppsByAppIdAndTime;
    logServiceFactory.getAppsBySpaIdAndTime = _getAppsBySpaIdAndTime;
    logServiceFactory.getHttpsByAppIdAndTime = _getHttpsByAppIdAndTime;
    logServiceFactory.getHttpsBySpaIdAndTime = _getHttpsBySpaIdAndTime;
    logServiceFactory.getOpersByAppIdAndTime = _getOpersByAppIdAndTime;
    logServiceFactory.getOpersBySpaIdAndTime = _getOpersBySpaIdAndTime;
    logServiceFactory.getAppsByAppId = _getAppsByAppId;

    return logServiceFactory;
}]);