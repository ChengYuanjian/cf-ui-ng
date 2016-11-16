/**
 * Created by mas on 2016/7/20.
 */
app.controller('spaceUserCtl', function($scope,$stateParams,$log,$q,spaceService,userService,$http){

    $scope.$on("UserbindEvent",
        function (event, msg) {
            $scope.$broadcast("UserbindEventFromParent", msg);
        });
    $scope.$on("UserunbindEvent",
        function (event, msg) {
            $scope.$broadcast("UserunbindEventFromParent", msg);
        });


    $scope.id = $stateParams.guid;
    $scope.bindeduserdatas=[];
    $scope.unbindeduserdatas=[];
    //get bind users
    function getBindedUsers(){
        // clear space users on reload
        $scope.bindeduserdatas=[];
        spaceService.retrieveRolesOfAllUsersForTheSpace($scope.id).then(function(response){
            var data = response.data;
            var userRoles = [];
            angular.forEach(data.resources, function(user, key) {
                var roleArray=user.entity.space_roles;
                var roles=roleArray.join(',');
                var objectUser = {
                    id: user.metadata.guid,
                    spaceId: $scope.id,
                    name: user.entity.username,
                    userRoles: roles
                };
                $scope.bindeduserdatas.push(objectUser);
            });
            getNBindedUsers();
        },function(err) {
            $log.error(err.data.description);
        });
    };

    //get unbind users
    function getNBindedUsers(){
        //clear unbind users on reload
        $scope.unbindeduserdatas=[];
        userService.getUsers().then(function(response) {
            var data = response.data;
            var flag = -1;
            angular.forEach(data.resources, function(user, i){
                angular.forEach($scope.bindeduserdatas,function(bindeduser,j){
                    if(user.metadata.guid==bindeduser.id)
                        flag = i;
                });
                if(flag != i && user.entity.username !=null){
                    var unbindeduser = {
                        id:user.metadata.guid,
                        name:user.entity.username
                    };
                    $scope.unbindeduserdatas.push(unbindeduser);
                }
            });
        }, function(err) {
            $log.error(err.data.description);
        });
    };

    getBindedUsers();

    //var deferred = $q.defer();
    //var promise = deferred.promise;
    //promise.then(function () {
    //    getNBindedUsers();
    //}, function (err) {
    //});
    //deferred.resolve(getBindedUsers());
});

app.controller('BindedUserCtrl', function ($rootScope, $scope, $modal, $log, $stateParams,spaceService, userService, i18nService, notificationService,dialogs) {
    $scope.id = $stateParams.guid;
    i18nService.setCurrentLang("zh-cn");

    $scope.bindeduserdatas=[];
    //get bind users
    $scope.getBindedUsers=function(){
        // clear space users on reload
        $scope.bindeduserdatas=[];
        spaceService.retrieveRolesOfAllUsersForTheSpace($scope.id).then(function(response){
            var data = response.data;
            var userRoles = [];
            angular.forEach(data.resources, function(user, key) {
                var roleArray=user.entity.space_roles;
                var roles=roleArray.join(',');
                var roleArrayCH=[];
                var rolesMap = [];
                angular.forEach(roleArray, function (userRole, key) {
                    var objectRole = {
                        role: userRole
                    };
                    if (userRole === 'space_manager') {
                        objectRole.label = '管理者';
                        roleArrayCH.push('管理者');
                    }
                    if (userRole === 'space_auditor') {
                        objectRole.label = '审计者';
                        roleArrayCH.push('审计者');
                    }
                    if (userRole === 'space_developer') {
                        objectRole.label = '开发者';
                        roleArrayCH.push('开发者');
                    }
                    rolesMap.push(objectRole);
                });
                var objectUser = {
                    id: user.metadata.guid,
                    spaceId: $scope.id,
                    name: user.entity.username,
                    rolesMap:rolesMap,
                    //userRoles: roles
                    userRoles: roleArrayCH.join(',')
                };
                $scope.bindeduserdatas.push(objectUser);
            });
            $scope.refresh();
        },function(err) {
            $log.error(err.data.description);
        });
    };

    $scope.bindedUserGridOptions = {
        enablePaginationControls: true,
        enableScrollbars: false,
        paginationPageSize: 10,
        paginationPageSizes: [10, 20, 50, 100],
        enableSelectAll: false,
        multiSelect: true,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: false,
        i18n: 'zh-cn',
        data: $scope.bindeduserdatas
    };

    $scope.$watch('filter.filterBindedUser', function (newVal, oldVal) {
        if (newVal == oldVal)
            return;
        $scope.bindedUserGridOptions.data = $scope.bindeduserdatas.filter(function (data) {
            if (data.name.toLowerCase().indexOf($scope.filter.filterBindedUser) > -1) {
                return true;
            }
            else {
                return false;
            }
        });

    }, true);

    var linkCellTemplate = '<button  class="btn btn-sm btn-danger" ng-click="grid.appScope.unbind(row.entity)">解除绑定</button>';

    $scope.unbind = function(obj){
        var dlg = dialogs.create('tpl/app_space_usr_unbind.html','UnbindDialogCtrl',obj, 'default');
        dlg.result.then(function(roles){
            angular.forEach(roles, function (user, i) {
                var _user={
                    spaceId:obj.spaceId,
                    id:obj.id
                };
                if(user==="space_manager"){
                    spaceService.disassociateManagerWithSpace(_user).then(function(){
                        notificationService.success('移除用户空间关系[' + user + ']成功');
                        //避免重复绑定导致数据重复
                        if(i===0){
                            $scope.$emit("UserunbindEvent");
                            $scope.getBindedUsers();
                        }
                    },function (err, status) {
                        $log.error(err);
                        if (err.data.code)
                            notificationService.error('移除用户空间关系[' + user + ']失败,原因是:\n' + err.data.description);
                    });
                } else if(user==="space_auditor"){
                    spaceService.disassociateAuditorWithSpace(_user).then(function(){
                        notificationService.success('移除用户空间关系[' + user + ']成功');
                        //避免重复绑定导致数据重复
                        if(i===0){
                            $scope.$emit("UserunbindEvent");
                            $scope.getBindedUsers();
                        }
                    },function (err, status) {
                        $log.error(err);
                        if (err.data.code)
                            notificationService.error('移除用户空间关系[' + user + ']失败,原因是:\n' + err.data.description);
                    });
                }else if(user==="space_developer"){
                    spaceService.disassociateDeveloperWithSpace(_user).then(function(){
                        notificationService.success('移除用户空间关系[' + user + ']成功');
                        //避免重复绑定导致数据重复
                        if(i===0){
                            $scope.$emit("UserunbindEvent");
                            $scope.getBindedUsers();
                        }
                    },function (err, status) {
                        $log.error(err);
                        if (err.data.code)
                            notificationService.error('移除用户空间关系[' + user + ']失败,原因是:\n' + err.data.description);
                    });
                }
            });
        },function(){
            notificationService.info('未作任何变更');
        });
    };

    $scope.bindedUserGridOptions.columnDefs = [
        {name: 'spaceId', displayName: 'spaceGuid', visible: false},
        {name: 'name', displayName: '用户名'},
        {name: 'userRoles', displayName: '角色'},
        {name: 'id', displayName: '绑定操作', cellTemplate: linkCellTemplate, width:80,enableSorting: false}
    ];

    $scope.refresh = function () {
        $scope.bindedUserGridOptions.data =$scope.bindeduserdatas;
        /*$scope.gridApi.core.refresh();*/
    };

    $scope.getBindedUsers();

    $scope.$on("UserbindEventFromParent", function(event,msg){
        $scope.getBindedUsers();
    });

});

app.controller('UnbindDialogCtrl', function($scope, $modalInstance, $confirm, spaceService, data) {
    $scope.data = data;

    $scope.roles=data.rolesMap;

    $scope.ok = function () {
        $confirm({
            text: '请确认解除角色绑定:'+$scope.selectedTags.join(','),
            title: "解除绑定",
            ok: "确认",
            cancel: '取消'
        }).then(function () {
            if($scope.selected.length>0)
                $modalInstance.close($scope.selected);
            else
                $modalInstance.dismiss('cancel');
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.selected = [];
    $scope.selectedTags = [];

    var updateSelected = function(action,id,name){
        if(action == 'add' && $scope.selected.indexOf(id) == -1){
            $scope.selected.push(id);
            $scope.selectedTags.push(name);
        }
        if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx,1);
            $scope.selectedTags.splice(idx,1);
        }
    }

    $scope.updateSelection = function($event, id){
        var checkbox = $event.target;
        var action = (checkbox.checked?'add':'remove');
        updateSelected(action,id,checkbox.name);
    }

    $scope.isSelected = function(id){
        return $scope.selected.indexOf(id)>=0;
    }

});


app.controller('UnbindedUserCtrl', function ($rootScope, $scope, $modal, $log, $stateParams,spaceService, userService, i18nService, notificationService,dialogs) {
    $scope.id = $stateParams.guid;
    i18nService.setCurrentLang("zh-cn");

    $scope.unbindeduserdatas=[];

    $scope.getUnBindedUsers = function () {
        $scope.unbindeduserdatas = [];

        userService.getUsers().then(function (response) {
            var data = response.data;
            angular.forEach(data.resources, function (user, i) {
                var unbindeduser = {
                    id: user.metadata.guid,
                    name: user.entity.username,
                    spaceId: $scope.id
                };
                if (unbindeduser.id && unbindeduser.name)
                    $scope.unbindeduserdatas.push(unbindeduser);
            });
        }, function (err) {
            $log.error(err);
        });

    };

    $scope.unBindedUserGridOptions = {
        enablePaginationControls: true,
        enableScrollbars: false,
        paginationPageSize: 10,
        paginationPageSizes: [10, 20, 50, 100],
        enableSelectAll: false,
        multiSelect: true,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: false,
        i18n: 'zh-cn',
        data: $scope.unbindeduserdatas
    };

    $scope.$watch('filter.filterUnBindedUser', function (newVal, oldVal) {
        if (newVal == oldVal)
            return;
        $scope.unBindedUserGridOptions.data = $scope.unbindeduserdatas.filter(function (data) {
            if (data.name.toLowerCase().indexOf($scope.filter.filterUnBindedUser) > -1) {
                return true;
            }
            else {
                return false;
            }
        });

    }, true);

    var linkCellTemplate = '<button  class="btn btn-sm btn-info" ng-click="grid.appScope.bind(row.entity)">绑定</button>';

    $scope.bind = function(obj){
        var dlg = dialogs.create('tpl/app_space_usr_bind.html','bindDialogCtrl',obj, 'default');
        dlg.result.then(function(roles){
            angular.forEach(roles, function (user, i) {
                var _user={
                    spaGuid:obj.spaceId,
                    guid:obj.id
                };
                if(user==="space_manager"){
                    userService.associateManagedSpaWithUser(_user).then(function(){
                        notificationService.success('绑定用户空间关系[' + user + ']成功');
                        //避免重复绑定导致数据重复
                        if(i===0){
                            $scope.$emit("UserbindEvent");
                            $scope.refresh();
                        }
                    },function (err, status) {
                        $log.error(err);
                        if (err.data.code)
                            notificationService.error('绑定用户空间关系[' + user + ']失败,原因是:\n' + err.data.description);
                    });
                } else if(user==="space_auditor"){
                    userService.associateAuditedSpaWithUser(_user).then(function(){
                        notificationService.success('绑定用户空间关系[' + user + ']成功');
                        //避免重复绑定导致数据重复
                        if(i===0){
                            $scope.$emit("UserbindEvent");
                            $scope.refresh();
                        }
                    },function (err, status) {
                        $log.error(err);
                        if (err.data.code)
                            notificationService.error('绑定用户空间关系[' + user + ']失败,原因是:\n' + err.data.description);
                    });
                }else if(user==="space_developer"){
                    userService.associateDeveloperSpaWithUser2(_user).then(function(){
                        notificationService.success('绑定用户空间关系[' + user + ']成功');
                        //避免重复绑定导致数据重复
                        if(i===0){
                            $scope.$emit("UserbindEvent");
                            $scope.refresh();
                        }
                    },function (err, status) {
                        $log.error(err);
                        if (err.data.code)
                            notificationService.error('新建用户空间关系[' + user + ']失败,原因是:\n' + err.data.description);
                    });
                }
            });
        },function(){
            notificationService.info('未作任何变更');
        });
    };

    $scope.unBindedUserGridOptions.columnDefs = [
        {name: 'spaceId', displayName: 'spaceGuid', visible: false},
        {name: 'name', displayName: '用户名'},
        {name: 'id', displayName: '绑定操作', cellTemplate: linkCellTemplate, width:80,enableSorting: false}
    ];

    $scope.refresh = function () {
        $scope.getUnBindedUsers();
        $scope.unBindedUserGridOptions.data =$scope.unbindeduserdatas;
    };

    $scope.refresh();

    $scope.$on("UserunbindEventFromParent", function(event,msg){
        $scope.refresh();
    });

});


app.controller('bindDialogCtrl', function($scope, $modalInstance, userService,$confirm, spaceService, data) {
    $scope.data = data;

    userService.getUserSummary($scope.data.id).then(function(response){
        $scope.roles = [];
        var result = response.data;
        if(result.entity.managed_spaces){
            var flag = false;
            angular.forEach(result.entity.managed_spaces,function (spa,i) {
                if(data.spaceId == spa.metadata.guid){
                    flag = true;
                }
            });
            if(!flag){
                var roleMap = {
                    label:'管理者',
                    role:'space_manager'
                };
                $scope.roles.push(roleMap);
            }
        }
        if(result.entity.audited_spaces){
            var flag = false;
            angular.forEach(result.entity.audited_spaces,function (spa,i) {
                if(data.spaceId == spa.metadata.guid){
                    flag = true;
                }
            });
            if(!flag){
                var roleMap = {
                    label:'审计者',
                    role:'space_auditor'
                };
                $scope.roles.push(roleMap);
            }
        }
        if(result.entity.spaces){
            var flag = false;
            angular.forEach(result.entity.spaces,function (spa,i) {
                if(data.spaceId == spa.metadata.guid){
                    flag = true;
                }
            });
            if(!flag){
                var roleMap = {
                    label:'开发者',
                    role:'space_developer'
                };
                $scope.roles.push(roleMap);
            }
        }

    },function (err) {
        $log.error(err);
    });

    $scope.ok = function () {
        $confirm({
            text: '请确认角色绑定:'+$scope.selectedTags.join(','),
            title: "绑定",
            ok: "确认",
            cancel: '取消'
        }).then(function () {
            if($scope.selected.length>0)
                $modalInstance.close($scope.selected);
            else
                $modalInstance.dismiss('cancel');
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.selected = [];
    $scope.selectedTags = [];

    var updateSelected = function(action,id,name){
        if(action == 'add' && $scope.selected.indexOf(id) == -1){
            $scope.selected.push(id);
            $scope.selectedTags.push(name);
        }
        if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx,1);
            $scope.selectedTags.splice(idx,1);
        }
    }

    $scope.updateSelection = function($event, id){
        var checkbox = $event.target;
        var action = (checkbox.checked?'add':'remove');
        updateSelected(action,id,checkbox.name);
    }

    $scope.isSelected = function(id){
        return $scope.selected.indexOf(id)>=0;
    }

});

app.controller('spaAppsInfoCtl', function($scope, i18nService,$stateParams,$confirm, $modal,spaceService,
                                          notificationService, $log, organizationService,uiGridConstants,applicationService,routeService,$timeout) {

    //是否显示操作按钮
    var userAuthInfo = JSON.parse(localStorage.getItem('userAuthInfo'));
    //用户有该空间的空间开发员角色则显示，没有则不显示
    if( userAuthInfo.data[$stateParams.orgGuid]['org-spaces'][$stateParams.guid]&&
        userAuthInfo.data[$stateParams.orgGuid]['org-spaces'][$stateParams.guid]['spa-roleC'].indexOf('1')>=0){
        $scope.createApp='1';
        $scope.deleteApp='1';
        $scope.startApp='1';
        $scope.stopApp='1';
    }else{
        $scope.createApp='0';
        $scope.deleteApp='0';
        $scope.startApp='0';
        $scope.stopApp='0';
    }

    var spaGuid=$stateParams.guid;
    $scope.apps=[];

    ////封装加载数据的方法
    //$scope.loadAppData = function (data) {
    //    angular.forEach(data, function (appdata) {
    //        var _org;
    //        spaceService.getSpace(appdata.entity.space_guid).then(function (resp) {
    //            _space = resp.data.entity.name;
    //            var _appdata = {
    //                space_guid: appdata.entity.space_guid,
    //                guid: appdata.metadata.guid,
    //                name: appdata.entity.name,
    //                instance: appdata.entity.instances,
    //                run_status: appdata.entity.state,
    //                createtime: appdata.metadata.created_at
    //                //updatetime:appdata.metadata.updated_at
    //            };
    //            $scope.apps.push(_appdata);
    //        });
    //    });
    //    $scope.refresh(); //refresh ui-grid
    //};

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
                        $scope.apps.push(_appdata);
                    });
                });
            });
        });
        $scope.refresh(); //refresh ui-grid
    };

    //get apps by one space
    $scope.getApplicationBySpace = function (spaceGuid) {
        $scope.apps=[];
        spaceService.getApplicationsForTheSpace(spaceGuid).then(function (resp) {
            var data = resp.data;
            $scope.loadAppData(data.resources);
        });
    };


    i18nService.setCurrentLang("zh-cn");

    $scope.gridSpaAppsOptions = {
        data: $scope.apps,
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

    $scope.$watch('filter.filterApp', function (newVal, oldVal) {
        if (newVal == oldVal)
            return;
        $scope.gridSpaAppsOptions.data = $scope.apps.filter(function (data) {
            if (data.name.toLowerCase().indexOf($scope.filter.filterApp) > -1) {
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

    $scope.gridSpaAppsOptions.columnDefs = [
        {name: 'guid', displayName: 'ID', visible: false},
        {name: 'org_guid', visible: false},
        {name: 'org', displayName: '组织',visible: false},
        {name: 'space', displayName: '空间',visible: false},
        {name: 'name', displayName: '应用名称', cellTemplate: linkCellTemplate},
        {name: 'instance', displayName: '实例数'},
        {
            name: 'createtime', displayName: '创建时间', sort: {
            direction: uiGridConstants.DESC,
            priority: 1}
        },
        {name: 'run_status', displayName: '当前状态'}
    ];

    var rowsRenderedTimeout;
    $scope.gridSpaAppsOptions.onRegisterApi = function (gridApi) {
        $scope.gridSpaAppsOptions = gridApi;

        // ROWS RENDER
        $scope.gridSpaAppsOptions.core.on.rowsRendered($scope, function () {
            if (rowsRenderedTimeout) {
                $timeout.cancel(rowsRenderedTimeout)
            }
            rowsRenderedTimeout = $timeout(function () {
                alignContainers('', $scope.gridSpaAppsOptions.grid);
            });
        });

        // SCROLL END
        $scope.gridSpaAppsOptions.core.on.scrollEnd($scope, function () {
            alignContainers('', $scope.gridSpaAppsOptions.grid);
        });
    };

    $scope.refresh = function () {
        $scope.gridSpaAppsOptions.data = $scope.apps;
        $scope.gridSpaAppsOptions.core.refresh();
    };

    $scope.refreshAppInfo=function(){
      $scope.getApplicationBySpace(spaGuid);
    };


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
            $scope.refreshAppInfo();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


    $scope.appdelete = function () {
        //添加删除提示
        if ($scope.gridSpaAppsOptions.selection.getSelectedRows().length < 1)
            notificationService.info('请选择一条记录');
        else {
            $confirm({
                text: '请确认是否删除选择的' + $scope.gridSpaAppsOptions.selection.getSelectedRows().length + '个应用',
                title: "确认删除",
                ok: "确认",
                cancel: '取消'
            }).then(function () {
                angular.forEach($scope.gridSpaAppsOptions.selection.getSelectedRows(), function (apps, i) {
                    applicationService.getRoutes(apps.guid).then(function(res){
                        var data = res.data;
                        angular.forEach(data.resources,function(route,i){
                            routeService.deleteRoute(route.metadata.guid).then(function(response){
                                notificationService.success('删除路由成功')
                                applicationService.deleteApplication(apps.guid).then(function (response4) {
                                    notificationService.success('删除应用[' + apps.name + ']成功');
                                    if (i == $scope.gridSpaAppsOptions.selection.getSelectedRows().length - 1) {
                                        //最后一次刷新应用列表，防止重复刷新
                                        $scope.refreshAppInfo();
                                    }
                                }, function (err) {
                                    $log.error(err);
                                    notificationService.error('删除应用[' + apps.name + ']失败,原因是:\n' + err.data.description);
                                });
                            }, function (err) {
                                $log.error(err);
                                notificationService.error('删除路由失败,原因是:\n' + err.data.description);
                            });
                        })
                    })

                });
            });
        }
    };

    $scope.appstart = function () {
        //添加启动提示
        if ($scope.gridSpaAppsOptions.selection.getSelectedRows().length < 1)
            notificationService.info('请选择一条记录');
        else {
            $confirm({
                text: '请确认是否启动选择的' + $scope.gridSpaAppsOptions.selection.getSelectedRows().length + '个应用',
                title: "确认启动",
                ok: "确认",
                cancel: '取消'
            }).then(function () {

                angular.forEach($scope.gridSpaAppsOptions.selection.getSelectedRows(), function (apps, i) {
                    var editapp = {
                        "id": apps.guid,
                        "state": "STARTED"
                    };
                    applicationService.stateApplication(editapp).then(function (response4) {
                        notificationService.success('启动应用[' + apps.name + ']成功');
                        if (i == $scope.gridSpaAppsOptions.selection.getSelectedRows().length - 1) {
                            //最后一次刷新应用列表，防止重复刷新
                            $scope.getApplicationBySpace(spaGuid);
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
    };

    $scope.appstop = function () {
        //添加停止提示
        if ($scope.gridSpaAppsOptions.selection.getSelectedRows().length < 1)
            notificationService.info('请选择一条记录');
        else {
            $confirm({
                text: '请确认是否停止选择的' + $scope.gridSpaAppsOptions.selection.getSelectedRows().length + '个应用',
                title: "确认启动",
                ok: "确认",
                cancel: '取消'
            }).then(function () {

                angular.forEach($scope.gridSpaAppsOptions.selection.getSelectedRows(), function (apps, i) {
                    var editapp = {
                        "id": apps.guid,
                        "state": "STOPPED"
                    }
                    applicationService.stateApplication(editapp).then(function (response4) {
                        notificationService.success('停止应用[' + apps.name + ']成功');
                        if (i == $scope.gridSpaAppsOptions.selection.getSelectedRows().length - 1) {
                            //最后一次刷新应用列表，防止重复刷新
                            $scope.getApplicationBySpace(spaGuid);
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
    };

    $scope.getApplicationBySpace(spaGuid);

});
