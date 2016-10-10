/**
 * Created by mas on 2016/7/19.
 */
/**
 * Created by mas on 2016/7/19.
 */


app.controller('AppCreateCtrl', ['$scope', '$modal', '$log', '$confirm', '$stateParams', 'messageService', 'applicationService', 'notificationService', 'uiGridConstants',
    function ($scope, $modal, $log, $confirm, $stateParams, messageService, applicationService, notificationService, uiGridConstants) {
        $scope.create = function () {
            var modalInstance = $modal.open({
                templateUrl: 'tpl/app_app_create.html',
                controller: 'AppCreateInstanceCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['js/controllers/appAddCtrl.js']);
                        }]
                }
            });


            modalInstance.result.then(function (selectedItem) {
                $scope.getapp();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.appstart = function () {

            //添加启动提示
            if ($scope.gridApi.selection.getSelectedRows().length < 1)
                notificationService.info('请选择一条记录');
            else {
                $confirm({
                    text: '请确认是否启动选择的' + $scope.gridApi.selection.getSelectedRows().length + '个应用',
                    title: "确认启动",
                    ok: "确认",
                    cancel: '取消'
                }).then(function () {

                    angular.forEach($scope.gridApi.selection.getSelectedRows(), function (apps, i) {
                        var editapp = {
                            "id": apps.guid,
                            "state": "STARTED"
                        }
                        applicationService.stateApplication(editapp).then(function (response4) {
                            notificationService.success('启动应用[' + apps.name + ']成功');
                            if (i == $scope.gridApi.selection.getSelectedRows().length - 1) {
                                //最后一次刷新应用列表，防止重复刷新
                                $scope.getapp();
                            }
                        }, function (err) {
                            $log.error(err);
                            notificationService.error('启动应用[' + apps.name + ']失败,原因是:\n' + err.data.description);
                        });

                    }, function (err) {
                        $log.error(err);
                        notificationService.error('启动应用失败,原因是:\n' + err.data.description);
                    });
                });
            }

            //angular.forEach($scope.gridApi.selection.getSelectedRows(), function (apps, i) {
            //    var editapp = {
            //        "id": apps.guid,
            //        "state":"STARTED"
            //    }
            //    applicationService.stateApplication(editapp).then(function (response4) {
            //        var  isApp = true;
            //        $scope.refresh();
            //    }, function (err) {
            //        $log.error(err);
            //        /!*  $scope.falsedelete(iscreateRoute, isrouteApp, isApp);*!/
            //        messageService.addMessage('danger', '应用：' + apps.name + '启动失败！');
            //     /*   $modalInstance.close();*/
            //    });
            //
            //}, function (err) {
            //    $log.error(err);
            //    /*   $modalInstance.close();*/
            //});

        };

        $scope.appstop = function () {
            //添加停止提示
            if ($scope.gridApi.selection.getSelectedRows().length < 1)
                notificationService.info('请选择一条记录');
            else {
                $confirm({
                    text: '请确认是否停止选择的' + $scope.gridApi.selection.getSelectedRows().length + '个应用',
                    title: "确认启动",
                    ok: "确认",
                    cancel: '取消'
                }).then(function () {

                    angular.forEach($scope.gridApi.selection.getSelectedRows(), function (apps, i) {
                        var editapp = {
                            "id": apps.guid,
                            "state": "STOPPED"
                        }
                        applicationService.stateApplication(editapp).then(function (response4) {
                            notificationService.success('停止应用[' + apps.name + ']成功');
                            if (i == $scope.gridApi.selection.getSelectedRows().length - 1) {
                                //最后一次刷新应用列表，防止重复刷新
                                $scope.getapp();
                            }
                        }, function (err) {
                            $log.error(err);
                            notificationService.error('停止应用[' + apps.name + ']失败,原因是:\n' + err.data.description);
                        });

                    }, function (err) {
                        $log.error(err);
                        notificationService.error('停止应用失败,原因是:\n' + err.data.description);
                    });
                });
            }

            //angular.forEach($scope.gridApi.selection.getSelectedRows(), function (apps, i) {
            //    var editapp = {
            //        "id": apps.guid,
            //        "state":"STOPPED"
            //    }
            //    applicationService.stateApplication(editapp).then(function (response4) {
            //        var  isApp = true;
            //        $scope.refresh();
            //    }, function (err) {
            //        $log.error(err);
            //        /!*  $scope.falsedelete(iscreateRoute, isrouteApp, isApp);*!/
            //        messageService.addMessage('danger', '应用：' + apps.name + '启动失败！');
            //        /*   $modalInstance.close();*/
            //    });
            //
            //}, function (err) {
            //    $log.error(err);
            //    /*   $modalInstance.close();*/
            //});

        };


        $scope.appdelete = function () {
            //添加删除提示
            if ($scope.gridApi.selection.getSelectedRows().length < 1)
                notificationService.info('请选择一条记录');
            else {
                $confirm({
                    text: '请确认是否删除选择的' + $scope.gridApi.selection.getSelectedRows().length + '个应用',
                    title: "确认删除",
                    ok: "确认",
                    cancel: '取消'
                }).then(function () {
                    angular.forEach($scope.gridApi.selection.getSelectedRows(), function (apps, i) {
                        applicationService.deleteApplication(apps.guid).then(function (response4) {
                            notificationService.success('删除应用[' + apps.name + ']成功');
                            if (i == $scope.gridApi.selection.getSelectedRows().length - 1) {
                                //最后一次刷新应用列表，防止重复刷新
                                $scope.getapp();
                            }
                        }, function (err) {
                            $log.error(err);
                            notificationService.error('删除应用[' + apps.name + ']失败,原因是:\n' + err.data.description);
                        });

                    }, function (err) {
                        $log.error(err);
                        notificationService.error('删除应用失败,原因是:\n' + err.data.description);
                    });
                });
            }
            //angular.forEach($scope.gridApi.selection.getSelectedRows(), function (apps, i) {
            //
            //    applicationService.deleteApplication(apps.guid).then(function (response4) {
            //        var  isApp = true;
            //        $scope.refreshapp();
            //    }, function (err) {
            //        $log.error(err);
            //        /!*  $scope.falsedelete(iscreateRoute, isrouteApp, isApp);*!/
            //        messageService.addMessage('danger', '应用：' + apps.name + '启动失败！');
            //        /*   $modalInstance.close();*/
            //    });
            //
            //}, function (err) {
            //    $log.error(err);
            //    /*   $modalInstance.close();*/
            //});

        };

        $scope.refreshapp = function () {
            $scope.gridOptions.data = $scope.datas;
            $scope.gridApi.core.refresh();
        }

    }])
;

// app list page
app.controller('AppListCtrl', function ($scope, $log, applicationService, organizationService, spaceService, i18nService,uiGridConstants) {

    //define var
    $scope.organizations = [];
    $scope.spaces = [];
    $scope.datas = [];

    var currOrg;

    //get all orgs
    organizationService.getOrganizations().then(function (response) {
        var orgsdata = response.data;
        angular.forEach(orgsdata.resources, function (org, i) {
            var objectOrg = {
                guid: org.metadata.guid,
                id: org.metadata.guid,
                name: org.entity.name,
            };
            $scope.organizations.push(objectOrg);
        });
    });

    //封装加载数据的方法
    $scope.loadAppData = function (data) {
        angular.forEach(data, function (appdata) {
            var _space;
            var _org;
            spaceService.getSpace(appdata.entity.space_guid).then(function (resp) {
                _space = resp.data.entity.name;
                organizationService.getOrganization(resp.data.entity.organization_guid).then(function (resp) {
                    //组装写在then的最里面，顺序执行，避免异步导致数据没及时取出
                    _org = resp.data.entity.name;
                    //获取应用路由和域名信息
                    applicationService.getApplicationSummary(appdata.metadata.guid).then(function(resp1){
                        var router=resp1.data.routes[0].host;
                        var domain=resp1.data.routes[0].domain.name;
                        var url=router+'.'+domain;
                        var _appdata = {
                            space_guid: appdata.entity.space_guid,
                            guid: appdata.metadata.guid,
                            name: {name:appdata.entity.name,url:url},
                            instance: appdata.entity.instances,
                            run_status: appdata.entity.state,
                            createtime: appdata.metadata.created_at,
                            //updatetime:appdata.metadata.updated_at,
                            space: _space,
                            org: _org,
                            org_guid:resp.data.metadata.guid
                        };
                        $scope.datas.push(_appdata);
                    });

                });
            });
        });
        $scope.refresh(); //refresh ui-grid
    };

    //get apps by one space
    $scope.getApplicationBySpace = function (spaceGuid) {
        spaceService.getApplicationsForTheSpace(spaceGuid).then(function (resp) {
            var data = resp.data;
            $scope.loadAppData(data.resources);
        });
    };

    //get apps by one space
    $scope.getAppsBySpaceParams = function (selected_space) {
        if (selected_space == null) {
            $scope.getAppsByOrgParams(currOrg);
            return;
        }
        $scope.datas = [];
        $scope.getApplicationBySpace(selected_space.id);
    };


    //get apps by one org
    $scope.getAppsByOrgParams = function (selected_org) {
        currOrg = selected_org;
        if (selected_org == null) {
            $scope.getapp();
            return;
        }

        //reset var
        $scope.datas = [];
        $scope.spaces = [];
        organizationService.getSpacesForTheOrganization(selected_org.id).then(function (response) {
            var spacedata = response.data;
            angular.forEach(spacedata.resources, function (_spacedata) {
                var space = {
                    id: _spacedata.metadata.guid,
                    name: _spacedata.entity.name,
                }
                $scope.spaces.push(space);
                $scope.getApplicationBySpace(_spacedata.metadata.guid);
            });
        });
    };

    //get all apps
    $scope.getapp = function () {
        //set datas contains noting
        $scope.datas = [];
        applicationService.getApplications().then(function (response) {
            var data = response.data;
            $scope.loadAppData(data.resources);
        });
    }

    //get all app
    $scope.getapp();


    //use ui-grid  add by mas 20160727
    i18nService.setCurrentLang("zh-cn");

    $scope.gridOptions = {
        data: $scope.datas,
        enablePaginationControls: true,
        enableScrollbars: false,
        paginationPageSize: 10,
        paginationPageSizes: [10, 20, 50, 100],
        enableSelectAll: false,
        multiSelect: true,
        selectionRowHeaderWidth: 35,
        rowHeight: 40,
        showGridFooter: false,
        i18n: 'zh-cn'
    };

    $scope.$watch('filter.filterText', function (newVal, oldVal) {
        if (newVal == oldVal)
            return;
        $scope.gridOptions.data = $scope.datas.filter(function (data) {
            if (data.name.toLowerCase().indexOf($scope.filter.filterText) > -1) {
                return true;
            }
            else {
                return false;
            }
        });

    }, true);

    var linkCellTemplate = '<div>' +
        '  <a style="font-weight:900;" ui-sref="app.app_manage.detail({guid:row.entity.guid,space_guid:row.entity.space_guid,name:row.entity.name.name,org:row.entity.org,org_guid:row.entity.org_guid,space:row.entity.space})"' +
        '>{{COL_FIELD.name}}<br/><span><a href="http://{{COL_FIELD.url}}" style="color:#23b7e5;">{{COL_FIELD.url}} <span class="fa fa-external-link type-sm mls"></span></a></span></a>' +
        '</div>';

    $scope.gridOptions.columnDefs = [
        {name: 'guid', displayName: 'ID', visible: false},
        {name: 'org_guid', visible: false},
        {name: 'name', displayName: '应用名称', cellTemplate: linkCellTemplate},
        {name: 'org', displayName: '组织'},
        {name: 'space', displayName: '空间'},
        {name: 'instance', displayName: '实例数'},
        {
            name: 'createtime', displayName: '创建时间', sort: {
            direction: uiGridConstants.DESC,
            priority: 1}
        },
        {name: 'run_status', displayName: '状态'}
    ];

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    };

    $scope.refresh = function () {
        $scope.gridOptions.data = $scope.datas;
        $scope.gridApi.core.refresh();
    };

});
