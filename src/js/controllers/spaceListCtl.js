app.controller('returnToOrg',['$stateParams','$scope','organizationService',
    function($stateParams,$scope,organizationService){
        $scope.orgGuid = $stateParams.orgGuid;
        organizationService.getOrganization($scope.orgGuid).then(function (response) {
            $scope.organizationName = response.data.entity.name;
        });
    }
])

app.controller('SpaceListCtl', [ '$rootScope', '$scope','$stateParams','$log','$q','$confirm','$modal','spaceService','organizationService','i18nService','notificationService','uiGridConstants',
    function($rootScope, $scope,$stateParams,$log,$q,$confirm,$modal,spaceService,organizationService,i18nService,notificationService,uiGridConstants) {
        $scope.organizations = [];
        $scope.spaces = [];
        $scope.spaceappdatas = [];
        $scope.spacedomaindatas = [];

        $scope.organizationName = "未分配";

        $scope.currOrg;


        //get all orgs
        organizationService.getOrganizations().then(function(response) {
            var orgsdata = response.data;
            angular.forEach(orgsdata.resources, function (org, i) {
                var objectOrg = {
                    guid:org.metadata.guid,
                    name: org.entity.name,
                };
                $scope.organizations.push(objectOrg);
            });
        });

        $scope.getSpaces=function(){
            $scope.spaces = [];
            spaceService.getSpaces().then(function(response) {

                var data = response.data;

                angular.forEach(data.resources, function(spaceInfo, i) {


                    organizationService.getOrganization(spaceInfo.entity.organization_guid).then(function(response) {
                        var objectSpace = {
                            guid: spaceInfo.metadata.guid,
                            quotaDefID:spaceInfo.entity.space_quota_definition_guid,
                            url: spaceInfo.metadata.url,
                            name: spaceInfo.entity.name,
                            created_at: spaceInfo.metadata.created_at,
                            updated_at: spaceInfo.metadata.updated_at,
                            org: response.data.entity.name,
                        };
                        $scope.spaces.push(objectSpace);
                    });
                });
                $scope.refresh1();

            }, function (err) {
                messageService.addMessage('danger', 'The organizations have not been loaded.', true);
                $log.error(err);
            });

        }

        $scope.getSpaces();


        $scope.getSpacesForTheOrg=function(selected_org){
            $scope.spaces = [];
            organizationService.getSpacesForTheOrganization(selected_org.guid).then(function(response){
                var spacedata = response.data;
                angular.forEach(spacedata.resources,function(_spacedata){
                    var space={
                        guid: _spacedata.metadata.guid,
                        quotaDefID:_spacedata.entity.space_quota_definition_guid,
                        url: _spacedata.metadata.url,
                        name: _spacedata.entity.name,
                        created_at: _spacedata.metadata.created_at,
                        updated_at: _spacedata.metadata.updated_at,
                        org: selected_org.name,
                    }
                    $scope.spaces.push(space);
                });
                $scope.refresh1();
            });
        };



        //get Space by one org
        $scope.getAppsByOrgParams=function(selected_org){
            $scope.currOrg=selected_org;
            if (selected_org==null){
                $scope.getSpaces();
                return;
            }
            $scope.getSpacesForTheOrg(selected_org);
        };




        i18nService.setCurrentLang("zh-cn");

        $scope.spacegridOptions = {
            data: $scope.spaces,
            enablePaginationControls: true,
            enableScrollbars: false,
            paginationPageSize: 10,
            paginationPageSizes: [10, 20, 50, 100],
            enableSelectAll: false,
            multiSelect: true,
            selectionRowHeaderWidth: 35,
            rowHeight: 35,
            showGridFooter: false,
            i18n: 'zh-cn'
        };


        $scope.$watch('filter.filterText', function (newVal, oldVal) {
            if (newVal == oldVal)
                return;
            $scope.spacegridOptions.data = $scope.spaces.filter(function (data) {
                if (data.name.toLowerCase().indexOf($scope.filter.filterText) > -1) {
                    return true;
                }
                else {
                    return false;
                }
            });

        }, true);

        var linkCellTemplate = '<div>' +
            '  <a ui-sref="app.space_manage.detail({guid:row.entity.guid,spacename:row.entity.name})">{{COL_FIELD}}</a>' +
            '</div>';

        $scope.spacegridOptions.columnDefs = [
            {name: 'guid', displayName: 'ID', visible: false},
            {name: 'name', displayName: '空间名称', cellTemplate: linkCellTemplate},
            {name: 'org', displayName: '所属组织'},
           /* {name: 'space', displayName: '空间'},
            {name: 'instance', displayName: '实例数'},*/
            {name: 'created_at', displayName: '创建时间', sort: {
                direction: uiGridConstants.DESC,
                priority: 1,
            },
            },
            {name: 'updated_at', displayName: '修改时间'}
        ];

        $scope.spacegridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        }

        $scope.refresh1= function () {
            $scope.spacegridOptions.data = $scope.spaces;
           /* $scope.gridApi.core.refresh();*/
        };

        $scope.refresh = function () {
            $scope.getSpaces();
        };

        $scope.deletespace = function () {
            if ($scope.gridApi.selection.getSelectedRows().length < 1)
                notificationService.info('请选择一条记录');
            else {
                $confirm({
                    text: '请确认是否删除选择的' + $scope.gridApi.selection.getSelectedRows().length + '个空间',
                    title: "确认删除",
                    ok: "确认",
                    cancel: '取消'
                }).then(function () {
                    var promises = [];
                    angular.forEach($scope.gridApi.selection.getSelectedRows(), function (spaces, i) {
                        promises.push($scope.delete(spaces));
                    });
                    $q.all(promises).then(function () {
                        $scope.refresh();
                    })
                });
            }
        };

        $scope.delete = function (spaces) {
            var defer = $q.defer();
            spaceService.deleteSpace(spaces.guid).then(function (response4)  {
                    notificationService.success('删除空间[' + spaces.name + ']成功');
                    spaceService.deleteSpaceQuota(spaces.quotaDefID);
                    defer.resolve();
            }, function (err, status) {
                defer.reject();
                $log.error(err);
                if (err.data.code)
                    notificationService.error('删除空间[' + spaces.name + ']失败,原因是:\n' + err.data.description);
            });
            return defer.promise;
        }

        $scope.addspace = function () {

            var modalInstance = $modal.open({
                templateUrl: 'tpl/app_space_create.html',
                controller: 'SpaceCreateInstanceCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                            return $ocLazyLoad.load(['js/controllers/spaceAddCtrl.js']);
                        }],
                    organization:function () {
                        return $scope.currOrg;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if(result)
                    $scope.refresh();
            });

        };

    }]);

app.controller('SpaceListDetail', [ '$rootScope', '$scope','$stateParams','$log','$modal','spaceService','organizationService','notificationService',
    function($rootScope, $scope,$stateParams,$log,$modal, spaceService,organizationService,notificationService) {
        $scope.organizations = [];
        $scope.spaces = [];
        $scope.spaceName='';
        $scope.spaceappdatas = [];
        $scope.spacedomaindatas = [];

        spaceService.getSpace($stateParams.guid).then(function (response) {
            var organization_guid = response.data.entity.organization_guid;
            var userAuthInfo= JSON.parse(localStorage.getItem('userAuthInfo'));
            var info = userAuthInfo.data[organization_guid];
            var role = info['org-roleC'];
            if(role.includes("4")){
                document.getElementById("enlargeSpaceQuato").style.visibility="visible";
            }else {
                document.getElementById("enlargeSpaceQuato").style.visibility="hidden";
            }
        });

        $scope.enlarge = function() {
            var modalInstance = $modal.open({
                templateUrl: 'tpl/app_space_enlarge.html',
                controller: 'SpaceEnlargeCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                            return $ocLazyLoad.load(['js/controllers/spaceEnlargeCtrl.js']);
                        }],
                    organization:function () {
                        return null;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if(result)
                    $scope.refresh();
            });
        };


        spaceService.getApplicationsForTheSpace($stateParams.guid).then(function(response) {
            var data = response.data;
            angular.forEach(data.resources, function(sharedDomain, i){
                var sharedDomainObject = {
                    guid: sharedDomain.metadata.guid,
                    url: sharedDomain.metadata.url,
                    name: sharedDomain.entity.name,
                    state: sharedDomain.entity.state,
                    instances: sharedDomain.entity.instances,
                    created_at: sharedDomain.metadata.created_at,
                    updated_at: sharedDomain.metadata.updated_at,
                };
                $scope.spaceappdatas.push(sharedDomainObject);
            });
        }, function(err) {
            $log.error(err.data.description);
        });

        $scope.getSpace = function(){
            spaceService.getSpace($stateParams.guid).then(function(response) {
                var data = response.data;
                $scope.spaceName = data.entity.name;
                $scope.spaceId = data.metadata.guid;
                $scope.quotaDefID = data.entity.space_quota_definition_guid;
                spaceService.getQuotaForTheSpace($scope.quotaDefID).then(function(response) {
                    var data = response.data;
                    $scope.quota = {
                        "memory_limit":data.entity.memory_limit,
                        "app_instance_limit":data.entity.app_instance_limit,
                        "total_services":data.entity.total_services,
                        "total_routes":data.entity.total_routes
                    }


                    spaceService.getSpaceSummary($stateParams.guid).then(function(response){
                        var data = response.data;
                        $scope.maxService = 0;
                        $scope.maxRoute=0;
                        $scope.sumMem=0;
                        $scope.sumApplication=0;
                        $scope.usedMemoryPercent;
                        $scope.usedApplicationPercent;
                        $scope.usedServicePercent;
                        $scope.usedRoutesPercent;
                        angular.forEach(data.apps,function(_data,i){
                            $scope.sumMem = _data.memory+$scope.sumMem;
                            $scope.sumApplication = _data.instances+$scope.sumApplication;
                            $scope.maxRoute = _data.routes.length+$scope.maxRoute;
                        })
                        $scope.maxService = data.services.length;
                        if ($scope.quota.memory_limit > 0) {
                            $scope.usedMemoryPercent = Math.round(($scope.sumMem/$scope.quota.memory_limit) * 100);
                        } else {
                            $scope.usedMemoryPercent = 0;
                        }
                        if ($scope.usedMemoryPercent < 50) {
                            $scope.progressClass = "progress-bar progress-bar-info";
                            $scope.spanClass = "pull-right text-info";
                        }
                        else if ($scope.usedMemoryPercent >= 50) {
                            $scope.progressClass = "progress-bar progress-bar-warning";
                            $scope.spanClass = "pull-right text-warning";
                        }
                        else {
                            $scope.progressClass = "progress-bar progress-bar-danger";
                            $scope.spanClass = "pull-right text-danger";
                        }
                        $scope.progressStyle = {"width": $scope.usedMemoryPercent + "%"};


                        if ($scope.quota.app_instance_limit > 0) {
                            $scope.usedApplicationPercent = Math.round(($scope.sumApplication/$scope.quota.app_instance_limit) * 100);
                        } else {
                            $scope.usedApplicationPercent = 0;
                        }
                        if ($scope.usedApplicationPercent < 50) {
                            $scope.progressClassApp = "progress-bar progress-bar-info";
                            $scope.spanClassApp = "pull-right text-info";
                        }
                        else if ($scope.usedApplicationPercent >= 50) {
                            $scope.progressClassApp = "progress-bar progress-bar-warning";
                            $scope.spanClassApp = "pull-right text-warning";
                        }
                        else {
                            $scope.progressClassApp = "progress-bar progress-bar-danger";
                            $scope.spanClassApp = "pull-right text-danger";
                        }
                        $scope.progressStyleApp = {"width": $scope.usedApplicationPercent + "%"};


                        if ($scope.quota.total_services > 0) {
                            $scope.usedServicePercent = Math.round(($scope.maxService/$scope.quota.total_services) * 100);
                        } else {
                            $scope.usedServicePercent = 0;
                        }
                        if ($scope.usedServicePercent < 50) {
                            $scope.progressClassService = "progress-bar progress-bar-info";
                            $scope.spanClassService = "pull-right text-info";
                        }
                        else if ($scope.usedServicePercent >= 50) {
                            $scope.progressClassService = "progress-bar progress-bar-warning";
                            $scope.spanClassService = "pull-right text-warning";
                        }
                        else {
                            $scope.progressClassService = "progress-bar progress-bar-danger";
                            $scope.spanClassService = "pull-right text-danger";
                        }
                        $scope.progressStyleService = {"width": $scope.usedServicePercent + "%"};


                        if ($scope.quota.total_routes > 0) {
                            $scope.usedRoutesPercent = Math.round(($scope.maxRoute/$scope.quota.total_routes) * 100);
                        } else {
                            $scope.usedRoutesPercent = 0;
                        }
                        if ($scope.usedRoutesPercent < 50) {
                            $scope.progressClassRoute = "progress-bar progress-bar-info";
                            $scope.spanClassRoute = "pull-right text-info";
                        }
                        else if ($scope.usedRoutesPercent >= 50) {
                            $scope.progressClassRoute = "progress-bar progress-bar-warning";
                            $scope.spanClassRoute = "pull-right text-warning";
                        }
                        else {
                            $scope.progressClassRoute = "progress-bar progress-bar-danger";
                            $scope.spanClassRoute = "pull-right text-danger";
                        }
                        $scope.progressStyleRoute = {"width": $scope.usedRoutesPercent + "%"};
                    })

                }, function(err) {
                    $log.error(err.data.description);
                });
            }, function(err) {
                $log.error(err.data.description);
            });
        }

        $scope.getSpace()

    }]);

app.controller('Spaceforname', [ '$rootScope', '$scope','$stateParams','$log',
    function($rootScope, $scope,$stateParams,$log) {
        $scope.space_name =$stateParams.spacename;

    }]);


app.controller('spaceSetting', ['$rootScope', '$scope','$stateParams','$log','spaceService','organizationService','notificationService',
    function ($rootScope, $scope,$stateParams,$log, spaceService,organizationService,notificationService) {
        spaceService.getSpace($stateParams.guid).then(function (response) {
            var organization_guid = response.data.entity.organization_guid;
            organizationService.getOrganization(organization_guid).then(function (response) {
                $scope.organizationName = response.data.entity.name;
            });
        });

        $scope.getSpace = function(){
            spaceService.getSpace($stateParams.guid).then(function(response) {
                var data = response.data;
                $scope.spaceName = data.entity.name;
                $scope.spaceId = data.metadata.guid;
                $scope.quotaDefID = data.entity.space_quota_definition_guid;
            }, function(err) {
                $log.error(err.data.description);
            });
        }
        $scope.getSpace();
        $scope.updateSpace =function(){
            $scope.space = {
                id: $stateParams.guid,
                name: $scope.spaceName,
            };
            spaceService.editSpace($scope.space).then(function(){
                notificationService.success('修改空间成功');
            })
        }

        $scope.deleteSpace = function(){
            spaceService.deleteSpaceQuota($scope.quotaDefID).then(function(resp){
                notificationService.success('删除空间配额成功');
                spaceService.deleteSpace($stateParams.guid).then(function (response)  {
                    notificationService.success('删除空间[' + $stateParams.spacename + ']成功');
                }, function (err, status) {
                    $log.error(err);
                    if (err.data.code)

                    notificationService.error('删除空间[' + $stateParams.spacename + ']失败,原因是:\n' + err.data.description);
                })
            }, function (err, status) {
                $log.error(err);
                if (err.data.code)
                notificationService.error('删除空间配额失败,原因是:\n' + err.data.description);
            });
        }

        spaceService.getSpace($stateParams.guid).then(function (response) {
            var organization_guid = response.data.entity.organization_guid;
            var userAuthInfo= JSON.parse(localStorage.getItem('userAuthInfo'));
            var info = userAuthInfo.data[organization_guid];
            var role = info['org-roleC'];
            var spaceInfo = info['org-spaces'][$stateParams.guid];
            var spaceRole = spaceInfo['spa-roleC'];
            if(role.includes("4")){
                document.getElementById("deleteSpace").style.visibility="visible";
            }else {
                document.getElementById("deleteSpace").style.visibility="hidden";
            }
            if(role.includes("4")||spaceRole.includes("4")||spaceRole.includes("1")){
                document.getElementById("updateSpace").style.visibility="visible";
            }else {
                document.getElementById("updateSpace").style.visibility="hidden";
            }
        });

    }]);

app.controller('spaceUserInfoCtl', ['$rootScope', '$scope', '$modal', '$log', '$q', '$stateParams', 'organizationService', 'spaceService','userService', 'i18nService', 'notificationService', 'dialogs', function ($rootScope, $scope, $modal, $log, $q, $stateParams, organizationService,spaceService, userService, i18nService, notificationService, dialogs) {
    i18nService.setCurrentLang("zh-cn");
    $scope.currentUser = {
        name: localStorage.getItem('userName'),
        currentManager: false
    };
    $scope.id = $stateParams.guid;

    $scope.retrieveRolesOfAllUsersForTheSpace = function () {
        $scope.users = [];

        spaceService.retrieveRolesOfAllUsersForTheSpace($scope.id).then(function (response) {
            var data = response.data;

            angular.forEach(data.resources, function (user, key) {

                var spaceManager = false;
                var spaceAuditor = false;
                var spaceDeveloper = false;
                var rolelist = [];
                var userRoles = [];

                angular.forEach(user.entity.space_roles, function (userRole, key) {

                    var objectRole = {
                        role: userRole
                    };

                    if (userRole === 'space_manager') {
                        spaceManager = true;
                        rolelist.push('管理员');
                        objectRole.label = '管理员';

                    }
                    if (userRole === 'space_developer') {
                        spaceDeveloper = true;
                        rolelist.push('开发员');
                        objectRole.label = '开发员';
                    }
                    if (userRole === 'space_auditor') {
                        spaceAuditor = true;
                        rolelist.push('审计员');
                        objectRole.label = '审计员';
                    }

                    userRoles.push(objectRole);

                });

                var objectUser = {
                    id: user.metadata.guid,
                    spaceId: $scope.id,
                    name: user.entity.username,
                    userRoles: rolelist.join(','),
                    roleMaps: userRoles,
                    spaceManager: spaceManager,
                    spaceAuditor: spaceAuditor,
                    spaceDeveloper: spaceDeveloper,
                    currentUser: $scope.currentUser.name === user.entity.username
                };
                $scope.users.push(objectUser);

                if ($scope.currentUser.name === user.entity.username) {
                    $scope.currentUser.currentManager = spaceManager;
                }

            });
        }, function (err) {
            $log.error(err);
        });

    };
    $scope.retrieveRolesOfAllUsersForTheSpace();

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
        data: $scope.users
    };

    $scope.$watch('filter.filterBindedUser', function (newVal, oldVal) {
        if (newVal == oldVal)
            return;
        $scope.bindedUserGridOptions.data = $scope.users.filter(function (data) {
            if (data.name.toLowerCase().indexOf($scope.filter.filterBindedUser) > -1) {
                return true;
            }
            else {
                return false;
            }
        });

    }, true);


    var linkCellTemplate = '<button  class="btn btn-sm btn-info" ng-click="grid.appScope.bind(row.entity)">绑定</button><button  class="btn btn-sm btn-danger" ng-click="grid.appScope.unbind(row.entity)">解除绑定</button>';

    $scope.bindedUserGridOptions.columnDefs = [
        {name: 'spaceId', displayName: 'spaceId', visible: false},
        {name: 'name', displayName: '用户名'},
        {name: 'userRoles', displayName: '角色', visible: false},
        {
            name: 'spaceManager',
            displayName: '管理员',
            cellTemplate: '<input type="checkbox" ng-disabled="!grid.appScope.whetherShow||(!row.entity.spaceAuditor&&(row.entity.spaceManager||row.entity.spaceDeveloper))" ng-change="grid.appScope.bind_unbind(row.entity,\'space_manager\')" ng-model="row.entity.spaceManager">'
        },
        {
            name: 'spaceAuditor',
            displayName: '审计员',
            cellTemplate: '<input type="checkbox" ng-disabled="!grid.appScope.whetherShow||(!row.entity.spaceAuditor&&(row.entity.spaceManager||row.entity.spaceDeveloper))" ng-change="grid.appScope.bind_unbind(row.entity,\'space_auditor\')" ng-model="row.entity.spaceAuditor">'
        },
        {
            name: 'spaceDeveloper',
            displayName: '开发员',
            cellTemplate: '<input type="checkbox" ng-disabled="!grid.appScope.whetherShow||(!row.entity.spaceAuditor&&(row.entity.spaceManager||row.entity.spaceDeveloper))" ng-change="grid.appScope.bind_unbind(row.entity,\'space_developer\')" ng-model="row.entity.spaceDeveloper">'
        },
        {name: 'roleMaps', visible: false},
        {name: 'id', visible: false, cellTemplate: linkCellTemplate, width: 120, enableSorting: false}
    ];

    $scope.refresh = function () {
        $scope.retrieveRolesOfAllUsersForTheSpace();
        $scope.bindedUserGridOptions.data = $scope.users;
    };


    $scope.bind_unbind = function (obj, role) {
        if (role == 'space_manager') {
            if (obj.spaceManager) {
                associateManagerWithSpace(obj);
            }
            else {
                disassociateManagerWithSpace(obj);
            }
        }
        if (role == 'space_auditor') {
            if (obj.spaceAuditor) {
                associateAuditorWithSpace(obj);
            }
            else {
                disassociateAuditorWithSpace(obj);
            }
        }
        if (role == 'space_developer') {
            if (obj.spaceDeveloper) {
                associateDeveloperWithSpace(obj);
            }
            else {
                disassociateDeveloperWithSpace(obj);
            }
        }
    }


    $scope.addUser = function () {
        var dlg = dialogs.create('tpl/app_space_usr_bind.html', 'BindDialogCtrl', $scope.id, 'default');
        dlg.result.then(function (roles, name) {
            var obj = {"spaceId": $scope.id, "name": name};
            var promises = [];
            angular.forEach(roles, function (role, i) {
                if (role == 'space_manager') {
                    promises.push(associateManagerWithSpace(obj));
                }
                if (role == 'space_auditor') {
                    promises.push(associateAuditorWithSpace(obj));
                }
                if (role == 'space_developer') {
                    promises.push(associateDeveloperWithSpace(obj));
                }
            });
            $q.all(promises).then(function () {
                $scope.refresh();
            });
        }, function () {
            notificationService.info('未作任何变更');
        });
    }

    function disassociateManagerWithSpace(obj) {
        spaceService.disassociateManagerWithSpace(obj).then(function (response) {
            notificationService.info('管理员解绑成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('管理员解绑失败:' + err.data.description);
        });
    }

    function associateManagerWithSpace(obj) {
        spaceService.associateManagerWithSpace(obj).then(function (response) {
            notificationService.info('管理员绑定成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('管理员绑定失败:' + err.data.description);
        });
    }

    function disassociateAuditorWithSpace(obj) {
        spaceService.disassociateAuditorWithSpace(obj).then(function (response) {
            notificationService.info('审计员解绑成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('审计员解绑失败:' + err.data.description);
        });
    }

    function associateAuditorWithSpace(obj) {
        spaceService.associateAuditorWithSpace(obj).then(function (response) {
            notificationService.info('审计员绑定成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('审计员绑定失败:' + err.data.description);
        });
    }

    function disassociateDeveloperWithSpace(obj) {
        spaceService.disassociateDeveloperWithSpace(obj).then(function (response) {
            notificationService.info('开发员解绑成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('开发员解绑失败:' + err.data.description);
        });
    }

    function associateDeveloperWithSpace(obj) {
        spaceService.associateDeveloperWithSpace(obj).then(function (response) {
            notificationService.info('开发员绑定成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('开发员绑定失败:' + err.data.description);
        });
    }

}]);

app.controller('BindDialogCtrl', ['$scope', '$modalInstance', '$confirm', '$log', '$q', 'spaceService', 'userService', 'notificationService', 'data', function ($scope, $modalInstance, $confirm, $log, $q, spaceService, userService, notificationService, data) {
    $scope.data = data;

    $scope.roles = [{
        label: '管理员',
        role: 'space_manager'
    }, {
        label: '开发员',
        role: 'space_developer'
    }, {
        label: '审计员',
        role: 'space_auditor'
    }];

    $scope.ok = function () {
        $confirm({
            text: '请确认绑定角色:' + $scope.selectedTags.join(','),
            title: "确认绑定",
            ok: "确认",
            cancel: '取消'
        }).then(function () {
            if ($scope.selected.length > 0) {
                $modalInstance.close($scope.selected, $scope.name);
            }
            else
                $modalInstance.dismiss('cancel');
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.selected = [];
    $scope.selectedTags = [];

    var updateSelected = function (action, id, name) {
        if (action == 'add' && $scope.selected.indexOf(id) == -1) {
            $scope.selected.push(id);
            $scope.selectedTags.push(name);
        }
        if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx, 1);
            $scope.selectedTags.splice(idx, 1);
        }
    }

    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id, checkbox.name);
    }

    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    }

}
]);

app.controller('spaceServiceInfoCtl', ['$rootScope', '$scope', '$modal', '$log', '$q', '$stateParams', 'organizationService', 'spaceService','serviceService','userService', 'i18nService', 'notificationService', 'dialogs', function ($rootScope, $scope, $modal, $log, $q, $stateParams, organizationService,spaceService,serviceService ,userService, i18nService, notificationService, dialogs) {
    i18nService.setCurrentLang("zh-cn");
    $scope.spaceId = $stateParams.guid;

    $scope.getServices = function(){
        $scope.services = [];
        spaceService.getSpaceSummary($scope.spaceId).then(function(response){

            var data = response.data;
            angular.forEach(data.services,function(_data,i){
            serviceService.getServiceInstance(_data.guid).then(function(resp){
                $scope.serviceInstanceCredentials = resp.data.entity.credentials;
            }).then(function(){
                serviceService.getServicePlanForTheService(_data.service_plan.guid).then(function(res){
                    if(res.data.entity.free){
                        $scope.Free ="免费";
                    }else{
                        $scope.Free ="收费";
                    }
                    $scope.description = res.data.entity.description;
                }).then(function(){
                    var objService = {
                        serviceInstanceName:_data.name,
                        serviceInstanceId:_data.guid,
                        boundAppCount:_data.bound_app_count,
                        description:$scope.description,
                        servicePlanId:_data.service_plan.guid,
                        servicePlanName:_data.service_plan.service.label+'/'+_data.service_plan.name,
                        serviceid:_data.service_plan.service.guid,
                        serviceInstanceCredentials: $scope.serviceInstanceCredentials,
                        isFree:$scope.Free
                    };
                    $scope.services.push(objService);
                })
            })
            })




        }, function(err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('获取服务信息失败:' + err.data.description);
        })
    }

    $scope.getServices();

    $scope.serviceGridOptions = {
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
        data: $scope.services
    };

    $scope.$watch('filter.filterBindedUser', function (newVal, oldVal) {
        if (newVal == oldVal)
            return;
        $scope.serviceGridOptions.data = $scope.services.filter(function (data) {
            if (data.serviceInstanceName.toLowerCase().indexOf($scope.filter.filterBindedUser) > -1) {
                return true;
            }
            else {
                return false;
            }
        });

    }, true);


    var linkCellTemplate = '<button  class="btn btn-sm btn-info" ng-click="grid.appScope.bind(row.entity)">绑定</button><button  class="btn btn-sm btn-danger" ng-click="grid.appScope.unbind(row.entity)">解除绑定</button>';

    $scope.serviceGridOptions.columnDefs = [
        {name: 'serviceInstanceId', displayName: 'Id', visible: false},
        {name: 'serviceInstanceCredentials', displayName: 'serviceInstanceCredentials', visible: false},
        {name: 'serviceInstanceName', displayName: '服务实例'},
        {name: 'servicePlanName', displayName: '服务方案'},
        {name: 'boundAppCount', displayName: '绑定应用'},
        {name: 'description', displayName: '描述'},
        {name: 'isFree', displayName: '计费情况'},
        {name: 'id', visible: false, cellTemplate: linkCellTemplate, width: 120, enableSorting: false}
    ];

    $scope.refresh = function () {
        $scope.getServices();
        $scope.serviceGridOptions.data = $scope.services;
    };

}]);
