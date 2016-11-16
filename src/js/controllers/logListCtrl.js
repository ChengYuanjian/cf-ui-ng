app.controller('LogListCtrl', ['$rootScope', '$scope', '$timeout', '$log', '$interval', 'logService', 'spaceService', 'i18nService', 'notificationService', 'uiGridConstants', function ($rootScope, $scope, $timeout, $log, $interval, logService, spaceService, i18nService, notificationService, uiGridConstants) {

    $scope.organizations = [];
    $scope.spaces = [];
    $scope.apps = [];

    $scope.line_config = {
        title: '资源占用率(%)',
        // subtitle: 'Line Chart Subtitle',
        debug: true,
        showXAxis: true,
        showYAxis: true,
        showLegend: true,
        stack: false,
        width: window.innerWidth - 300
    };

    var cpu_data = {name: 'CPU', datapoints: [{x: 0, y: 0}]};
    var memory_data = {name: 'Memory', datapoints: [{x: 0, y: 0}]};

    //从localstorge获取用户有权限访问的组织
    var userAuthInfo = JSON.parse(localStorage.getItem('userAuthInfo'));

    for (var orgid in userAuthInfo.data) {
        var org = {
            uid: orgid,
            name: userAuthInfo.data[orgid]['org-name']
        };
        $scope.organizations.push(org);
    }
    $scope.selected_org = $scope.organizations[0];

    $scope.getSpaceByOrg = function (org) {
        if (org) {
            $scope.spaces = [];
            for (var spaid in userAuthInfo.data[org.uid]['org-spaces']) {
                var spa = {
                    uid: spaid,
                    name: userAuthInfo.data[orgid]['org-spaces'][spaid]['spa-name']
                };
                $scope.spaces.push(spa);
            }
            $scope.selected_spa = $scope.spaces[0];
        }
    };
    $scope.getSpaceByOrg($scope.selected_org);

    $scope.getAppsBySpace = function (spa) {
        if (spa) {
            $scope.apps = [];
            spaceService.getApplicationsForTheSpace(spa.uid).then(function (resp) {
                angular.forEach(resp.data.resources, function (data, i) {
                    var app = {uid: data.metadata.guid, name: data.entity.name};
                    $scope.apps.push(app);
                });
                $scope.selected_app = $scope.apps[0];
            });
        }
    };
    $scope.getAppsBySpace($scope.selected_spa);

    function getCurrentDate(interval) {
        var currentDate = new Date();
        if (interval == 0)
            return currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate()
                + ' ' + currentDate.getHours() + ':59:59';
        else if (currentDate.getHours() > interval)
            return currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate()
                + ' ' + (currentDate.getHours() - interval) + ':00:00';
        else
            return currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + (currentDate.getDate() - 1)
                + ' ' + (currentDate.getHours() + 24 - interval) + ':00:00';
    }

    $scope.datepickeroption = {
        format: 'YYYY-MM-DD HH:mm:ss',
        timePicker: true,
        timePickerIncrement: 30,
        timePicker12Hour: true,
        startDate: getCurrentDate(1),
        endDate: getCurrentDate(0)
    };

    $scope.selected_date = getCurrentDate(1) + " - " + getCurrentDate(0);

    $scope.query = function () {
        $scope.http_list = [];
        $scope.oper_list = [];
        $scope.gridOptions1.data = [];
        $scope.gridOptions2.data = [];

        cpu_data.datapoints = [{x: 0, y: 0}];
        memory_data.datapoints = [{x: 0, y: 0}];

        var selected_date = angular.element(document.getElementsByName("mydate"))[0].value;

        if (selected_date) {
            var arr = selected_date.split(' ');
            var starttime = arr[0] + ' ' + arr[1];
            var endtime = arr[3] + ' ' + arr[4];

            if ($scope.selected_app && $scope.selected_app.uid) {
                queryAppQuota($scope.selected_app.uid, starttime, endtime);
                queryHttpLogs(null, $scope.selected_app.uid, starttime, endtime);
                queryOperLogs(null, $scope.selected_app.uid, starttime, endtime);
            } else {
                cpu_data.datapoints = [{x: 0, y: 0}];
                $scope.line_data = [cpu_data];
                queryHttpLogs($scope.selected_spa.uid, null, starttime, endtime);
                queryOperLogs($scope.selected_spa.uid, null, starttime, endtime);
            }
        }
    };

    $scope.realQueryAppQuota = function (appid) {

    };

    function queryAppQuota(appid, starttime, endtime) {
        var cpu_datapoints = [];
        if (!$scope.isShow) {
            logService.getAppsByAppIdAndTime(appid, starttime, endtime, 24).then(function (response) {
                angular.forEach(response.data, function (result, i) {
                    var cpu_item = {x: result.time, y: result.cpu_percentage};
                    cpu_datapoints.push(cpu_item);
                });
                if (cpu_datapoints.length > 0)
                    cpu_datapoints.reverse();
                else
                    cpu_datapoints.push({x: 0, y: 0});
                cpu_data.datapoints = cpu_datapoints;
                $scope.line_data = [cpu_data];
            }, function (err) {
                $log.error(err);
                if (err.data.code)
                    notificationService.error("获取应用资源信息失败:" + err.data.description);
            });
        }
    }

    function queryHttpLogs(spaid, appid, starttime, endtime) {
        if (appid) {
            logService.getHttpsByAppIdAndTime(appid, starttime, endtime).then(function (response) {
                angular.forEach(response.data, function (result, i) {
                    var item = {
                        org_name: result.cf_org_name,
                        space_name: result.cf_space_name,
                        app_name: result.cf_app_name,
                        uri: result.uri,
                        ip: result.ip,
                        user_agent: result.user_agent,
                        datetime: result.time
                    };
                    $scope.http_list.push(item);
                });
                $scope.gridOptions1.data = $scope.http_list;
            }, function (err) {
                $log.error(err);
                if (err.data.code)
                    notificationService.error("获取Http日志失败:" + err.data.description);
            });
        } else {
            logService.getHttpsBySpaIdAndTime(spaid, starttime, endtime).then(function (response) {
                angular.forEach(response.data, function (result, i) {
                    var item = {
                        org_name: result.cf_org_name,
                        space_name: result.cf_space_name,
                        app_name: result.cf_app_name,
                        uri: result.uri,
                        ip: result.ip,
                        user_agent: result.user_agent,
                        datetime: result.time
                    };
                    $scope.http_list.push(item);
                });
                $scope.gridOptions1.data = $scope.http_list;
            }, function (err) {
                $log.error(err);
                if (err.data.code)
                    notificationService.error("获取Http日志失败:" + err.data.description);
            });
        }
    }

    function queryOperLogs(spaid, appid, starttime, endtime) {
        if (appid) {
            logService.getOpersByAppIdAndTime(appid, starttime, endtime).then(function (response) {
                angular.forEach(response.data, function (result, i) {
                    var item = {
                        org_name: result.cf_org_name,
                        space_name: result.cf_space_name,
                        app_name: result.cf_app_name,
                        msg: result.msg,
                        datetime: result.time
                    };
                    $scope.oper_list.push(item);
                });
                $scope.gridOptions2.data = $scope.oper_list;
            }, function (err) {
                $log.error(err);
                if (err.data.code)
                    notificationService.error("获取后台操作日志失败:" + err.data.description);
            });
        } else {
            logService.getOpersBySpaIdAndTime(spaid, starttime, endtime).then(function (response) {
                angular.forEach(response.data, function (result, i) {
                    var item = {
                        org_name: result.cf_org_name,
                        space_name: result.cf_space_name,
                        app_name: result.cf_app_name,
                        msg: result.msg,
                        datetime: result.time
                    };
                    $scope.oper_list.push(item);
                });
                $scope.gridOptions2.data = $scope.oper_list;
            }, function (err) {
                $log.error(err);
                if (err.data.code)
                    notificationService.error("获取后台操作日志失败:" + err.data.description);
            });
        }
    }

    $scope.reset = function () {
        $scope.selected_org = $scope.organizations[0];
        $scope.getSpaceByOrg($scope.selected_org);
        $scope.getAppsBySpace($scope.selected_spa);
    };

    $scope.realshow = function () {
        var cpu_datapoints = [];
        var timer = $interval(function () {
        }, 30000);
        if ($scope.isShow) {
            if ($scope.selected_app && $scope.selected_app.uid) {
                timer.then(function () {
                    if (cpu_datapoints.length < 1) {
                        logService.getAppsByAppId($scope.selected_app.uid, 0, 20).then(function (response) {
                            angular.forEach(response.data, function (result, i) {
                                var cpu_item = {x: result.time, y: parseFloat(result.cpu_percentage) * 100};
                                cpu_datapoints.push(cpu_item);
                            });

                            cpu_datapoints.reverse();
                            cpu_data.datapoints = cpu_datapoints;
                            $scope.line_data = [cpu_data];
                        }, function (err) {
                            $log.error(err);
                            if (err.data.code)
                                notificationService.error("获取应用资源信息失败:" + err.data.description);
                        });
                    } else {
                        logService.getAppsByAppId($scope.selected_app.uid, 0, 0).then(function (response) {
                            angular.forEach(response.data, function (result, i) {
                                if (result.time != cpu_datapoints[cpu_datapoints.length - 1].x) {
                                    cpu_data.datapoints.shift();
                                    var cpu_item = {x: result.time, y: parseFloat(result.cpu_percentage) * 100};
                                    cpu_data.datapoints.push(cpu_item);
                                }
                            });
                            // cpu_data.datapoints = cpu_datapoints;
                            // $scope.line_data = [cpu_data];
                        }, function (err) {
                            $log.error(err);
                            if (err.data.code)
                                notificationService.error("获取应用资源信息失败:" + err.data.description);
                        });
                    }
                });
            } else {
                notificationService.info("请选择一个应用进行资源监控");
            }
        } else {
            $interval.cancel(timer);
        }
    }

    i18nService.setCurrentLang("zh-cn");

    $scope.gridOptions1 = {
        enablePaginationControls: true,
        enableScrollbars: false,
        paginationPageSize: 20,
        paginationPageSizes: [20, 50, 100],
        enableSelectAll: false,
        showGridFooter: false
    };

    $scope.gridOptions1.columnDefs = [
        {name: 'org_name', displayName: '组织', visible: false},
        {name: 'space_name', displayName: '空间', visible: false},
        {name: 'app_name', displayName: '应用', width: 150},
        {name: 'datetime', displayName: '访问时间', width: 150, enableSorting: false},
        {name: 'ip', displayName: '访问IP', width: 150},
        {name: 'uri', displayName: '访问资源'},
        {name: 'user_agent', displayName: '用户代理信息／UA'}
    ];

    $scope.gridOptions2 = {
        enablePaginationControls: true,
        enableScrollbars: false,
        paginationPageSize: 20,
        paginationPageSizes: [20, 50, 100],
        enableSelectAll: false,
        showGridFooter: false,
    };

    var msgCellTemplate = '<div style="width:100%;height:{{grid.appScope.fixHeight(row)}}px">{{row.entity.msg}}</div>';

    $scope.gridOptions2.columnDefs = [
        {name: 'org_name', displayName: '组织', visible: false},
        {name: 'space_name', displayName: '空间', visible: false},
        {name: 'app_name', displayName: '应用', width: 150},
        {name: 'datetime', displayName: '操作时间', width: 150, enableSorting: false},
        {name: 'msg', displayName: '操作信息', cellTemplate: msgCellTemplate}
    ];

}
]);
