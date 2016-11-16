app.controller('OrganizationDetailsBaseCtrl', ['$rootScope', '$scope', '$stateParams', '$q', '$log', 'organizationService', 'notificationService',
    function ($rootScope, $scope, $stateParams, $q, $log, organizationService, notificationService) {
        $scope.name = $stateParams.name;
        $scope.id = $stateParams.guid;

        $scope.userAuthInfo = JSON.parse(localStorage.getItem('userAuthInfo'));

        $scope.orgroles = $scope.userAuthInfo.data[$scope.id]["org-roleC"];
        //对象userAuthInfo提供了两种用户组织和空间权限的表示方式：org-roleC中的1代表组织普通用户、2代表组织审计员、4代表组织管理员、8代表组织计费员，org-role采用类似于Linux中的权限表示；spa-roleC中的1代表空间开发员、2代表空间审计员、4代表空间管理员，spa-role采用类似于Linux中的权限表示
        // $scope.sparoles = userAuthInfo.data[$scope.id]["org-spaces"];

        if ($scope.orgroles.indexOf("4") > -1)
            $scope.isorgmanager = true;
        else
            $scope.isorgmanager = false;

        if ($scope.orgroles.indexOf("2") > -1)
            $scope.isorgauditor = true;
        else
            $scope.isorgauditor = false;

        if ($scope.orgroles.indexOf("8") > -1)
            $scope.isorgbilling = true;
        else
            $scope.isorgbilling = false;

        if ($scope.orgroles.indexOf("1") > -1)
            $scope.isorguser = true;
        else
            $scope.isorguser = false;

        $scope.$on("GetMemoryEvent",
            function (event, msg) {
                $scope.$broadcast("GetMemoryEventFromParent", msg);
            });
    }]);

app.controller('OrganizationDetailsCtrl', ['$rootScope', '$scope', '$stateParams', '$q', '$log', 'organizationService', 'notificationService', 'dialogs',
    function ($rootScope, $scope, $stateParams, $q, $log, organizationService, notificationService, dialogs) {
        $scope.initialquota = {};
        $scope.quota = {};

        var defer2 = $q.defer();
        //get memory usage
        $scope.getMemoryUsage = function () {
            organizationService.getMemoryUsage($scope.id).then(function (response) {
                $scope.memory_usage_in_mb = response.data.memory_usage_in_mb;
                defer2.resolve();
            }, function (err) {
                $log.error(err);
                defer2.reject();
            });
            return defer2.promise;
        };

        var defer3 = $q.defer();
        // get particular organization
        $scope.getOrganization = function () {
            organizationService.getOrganization($scope.id).then(function (response) {
                var data = response.data;
                $scope.quotaDefID = data.entity.quota_definition_guid;
                defer3.resolve($scope.quotaDefID);
            }, function (err) {
                defer3.reject();
                $log.error(err);
                if (err.data.code)
                    notificationService.error('获取组织信息失败:' + err.data.description);
            });
            return defer3.promise;
        };

        // get organization quota
        $scope.getQuotaForTheOrganization = function () {
            organizationService.getQuotaForTheOrganization($scope.quotaDefID).then(function (response) {
                var data = response.data;

                if ($scope.quotaDefID === data.metadata.guid) {
                    $scope.quota.guid = $scope.quotaDefID;
                    $scope.initialquota.memory_limit = $scope.quota.memory_limit = data.entity.memory_limit;
                    $scope.initialquota.total_services = $scope.quota.total_services = data.entity.total_services;
                    $scope.initialquota.total_routes = $scope.quota.total_routes = data.entity.total_routes;
                    $scope.initialquota.app_instance_limit = $scope.quota.app_instance_limit = data.entity.app_instance_limit;
                    $scope.initialquota.total_private_domains = $scope.quota.total_private_domains = data.entity.total_private_domains;
                    $scope.initialquota.instance_memory_limit = $scope.quota.instance_memory_limit = data.entity.instance_memory_limit;
                }

                if ($scope.quota.memory_limit > 0) {
                    $scope.sumMemRate = (Math.round(($scope.memory_usage_in_mb / $scope.quota.memory_limit) * 10000) / 100).toFixed(2);
                } else {
                    $scope.sumMemRate = 0;
                }
                if ($scope.sumMemRate < 50) {
                    $scope.progressClass = "progress-bar progress-bar-info";
                    $scope.spanClass = "pull-right text-info";
                }
                else if ($scope.sumMemRate >= 50) {
                    $scope.progressClass = "progress-bar progress-bar-warning";
                    $scope.spanClass = "pull-right text-warning";
                }
                else {
                    $scope.progressClass = "progress-bar progress-bar-danger";
                    $scope.spanClass = "pull-right text-danger";
                }

                $scope.progressStyle = {"width": $scope.sumMemRate + "%"};
            }, function (err) {
                $log.error(err);
                if (err.data.code)
                    notificationService.error('获取组织配额信息失败:' + err.data.description);
            });
        };

        $scope.$on("GetMemoryEventFromParent",
            function (event, msg) {
                $scope.memory_usage_in_mb = msg;
                $q.all([$scope.getOrganization()]).then(function () {
                    $scope.getQuotaForTheOrganization();
                });
            });

        $scope.extand = function () {
            $scope.quota.orgName = $scope.name;
            $scope.quota.isorgmanager = $scope.isorgmanager;

            var dlg = dialogs.create('tpl/app_org_quota.html', 'OrgQuotaEditCtrl', $scope.quota, 'default');
            dlg.result.then(function () {
                $scope.getQuotaForTheOrganization();
            }, function () {
                notificationService.info('未作任何变更');
            });
        }
    }]);

app.controller('OrgQuotaEditCtrl', ['$scope', '$modalInstance', '$confirm', 'organizationService', 'data', function ($scope, $modalInstance, $confirm, organizationService, data) {
    $scope.quota = data;
    $scope.orgName = data.orgName;
    $scope.isorgmanager = data.isorgmanager;

    $scope.ok = function () {
        organizationService.editQuotaForOrganization($scope.quota).then(function (response) {
            notificationService.success('修改组织' + $scope.orgName + '配额成功');
            $modalInstance.close();
        }, function (err) {
            $modalInstance.dismiss('cancel');
            $log.error(err);
            if (err.data.code)
                notificationService.error(err);
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

app.controller('OrganizationDetailsCtrl1', ['$rootScope', '$scope', '$modal', '$log', '$stateParams', '$q', 'organizationService', 'spaceService', 'notificationService', function ($rootScope, $scope, $modal, $log, $stateParams, $q, organizationService, spaceService, notificationService) {

    $scope.getSpacesForTheOrganization = function () {
        organizationService.getSpaceSummaryForTheOrganization($scope.id).then(function (response) {
            $scope.spaces = [];
            $scope.total_memory = 0;
            var data = response.data.spaces;
            var promises = [];
            angular.forEach(data, function (space, i) {
                promises.push($scope.getQuotaForTheSpace(space));
            });
            $q.all(promises).then(function () {
                $scope.$emit("GetMemoryEvent", $scope.total_memory);
            });
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error("获取空间信息失败:" + err.data.description);
        });
    };

    $scope.getQuotaForTheSpace = function (space) {
        var defer = $q.defer();
        var spaceitem = {
            guid: space.guid,
            name: space.name
        };
        spaceService.getSpaceSummary(space.guid).then(function (responseSpace) {

            var dataSpace = responseSpace.data;

            // calculate space memory and stopped or started apps
            var memory = 0;
            var nrOfStartedApps = 0;
            var nrOfStoppedApps = 0;
            var nrOfCrashedApps = 0;
            angular.forEach(dataSpace.apps, function (application, i) {
                memory += application.memory * application.instances;

                // started apps
                if (application.state === 'STARTED') {
                    if ((application.instances - application.running_instances) > 0) {
                        nrOfCrashedApps++;
                    } else {
                        nrOfStartedApps++;
                    }
                }
                // stopped apps
                if (application.state === 'STOPPED') {
                    nrOfStoppedApps++;
                }

            });

            spaceitem.memory = memory;
            $scope.total_memory += memory;
            spaceitem.nrOfStartedApps = nrOfStartedApps;
            spaceitem.nrOfStoppedApps = nrOfStoppedApps;
            spaceitem.nrOfCrashedApps = nrOfCrashedApps;
            spaceitem.nrOfServices = dataSpace.services.length;
            $scope.spaces.push(spaceitem);
            defer.resolve();
        }, function (err) {
            $log.error(err);
            defer.reject();
        });

        return defer.promise;
    };

    if ($scope.isorgmanager)
        $scope.getSpacesForTheOrganization();
    else {
        var sparoleinfo = $scope.userAuthInfo.data[$scope.id]["org-spaces"];
        $scope.spaces = [];
        $scope.total_memory = 0;
        var promises = [];
        for (var spa in sparoleinfo) {
            var space = {guid: spa, name: sparoleinfo[spa]["spa-name"]};
            promises.push($scope.getQuotaForTheSpace(space));
        }
        $q.all(promises).then(function () {
            $scope.$emit("GetMemoryEvent", $scope.total_memory);
        });
    }

    $scope.createSpace = function () {
        var organization = {
            id: $scope.id,
            guid: $scope.id,
            name: $scope.name
        };

        var modalInstance = $modal.open({
            templateUrl: 'tpl/app_space_create.html',
            controller: 'SpaceCreateInstanceCtrl',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['js/controllers/spaceAddCtrl.js']);
                    }],
                organization: function () {
                    return organization;
                }
            }
        });

        modalInstance.result.then(function (flag) {
            if (flag)
                $scope.refresh();
        }, function () {

        });
    };

    $scope.refresh = function () {
        $scope.getSpacesForTheOrganization();
    };


    $scope.updateQuotaForOrganization = function () {
        var organization = {
            id: $scope.id,
            name: $scope.organization.name
        };
        organizationService.editOrganization(organization);
        organizationService.editQuotaForOrganization($scope.quota).then(function (response) {
            notificationService.success('修改组织' + $scope.organization.name + '成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error(err);
        });

    };

    $scope.reset = function () {
        $scope.organization.name = $scope.initialquota.name;
        $scope.quota.memory_limit = $scope.initialquota.memory_limit;
        $scope.quota.total_services = $scope.initialquota.total_services;
        $scope.quota.total_routes = $scope.initialquota.total_routes;
        $scope.quota.app_instance_limit = $scope.initialquota.app_instance_limit;
        $scope.quota.total_private_domains = $scope.initialquota.total_private_domains;
        $scope.quota.instance_memory_limit = $scope.initialquota.instance_memory_limit;
    }

}]);


app.controller('OrganizationDetailsCtrl2', ['$rootScope', '$scope', '$modal', '$log', '$stateParams', '$confirm', 'organizationService', 'i18nService', 'notificationService', 'uiGridConstants',
    function ($rootScope, $scope, $modal, $log, $stateParams, $confirm, organizationService, i18nService, notificationService, uiGridConstants) {
        i18nService.setCurrentLang("zh-cn");

        $scope.getDomains = function () {
            $scope.domains = [];
            // get organization privateDomains
            organizationService.getPrivateDomainsForTheOrganization($scope.id).then(function (response) {
                var data = response.data;
                angular.forEach(data.resources, function (domain, i) {
                    var privateDomainObject = {
                        id: domain.metadata.guid,
                        owningOrganizationId: domain.entity.owning_organization_guid,
                        name: domain.entity.name,
                        created_at: domain.metadata.created_at,
                        updated_at: domain.metadata.updated_at,
                        type: '私有域名'
                    };
                    $scope.domains.push(privateDomainObject);
                });
                // get organization sharedDomains
                organizationService.getSharedDomainsForTheOrganization($scope.id).then(function (response) {
                    var data = response.data;
                    $scope.sharedDomains = (data.resources);
                    angular.forEach(data.resources, function (sharedDomain, i) {
                        var sharedDomainObject = {
                            id: sharedDomain.metadata.guid,
                            name: sharedDomain.entity.name,
                            created_at: sharedDomain.metadata.created_at,
                            updated_at: sharedDomain.metadata.updated_at,
                            type: '共享域名'
                        };
                        $scope.domains.push(sharedDomainObject);
                    });
                    $scope.domainGridOptions.data = $scope.domains;
                }, function (err) {
                    $log.error(err);
                });
            }, function (err) {
                $log.error(err);
            });
        };
        $scope.getDomains();


        $scope.domainGridOptions = {
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
            data: $scope.domains
        };

        $scope.$watch('filter.filterDomain', function (newVal, oldVal) {
            if (newVal == oldVal)
                return;
            $scope.domainGridOptions.data = $scope.domains.filter(function (data) {
                if (data.name.toLowerCase().indexOf($scope.filter.filterDomain) > -1) {
                    return true;
                }
                else {
                    return false;
                }
            });

        }, true);


        var linkCellTemplate = '<div ng-if="row.entity.type == \'私有域名\'"><button  class="btn btn-sm btn-danger" ng-click="grid.appScope.remove(row.entity)">解绑</button></div><div class="ui-grid-cell-contents" ng-if="row.entity.status == \'共享域名\'"></div>';


        $scope.domainGridOptions.columnDefs = [
            {name: 'id', displayName: 'ID', visible: false},
            {name: 'owningOrganizationId', displayName: 'owningOrganizationId', visible: false},
            {name: 'name', displayName: '域名'},
            {name: 'created_at', displayName: '创建时间'},
            {name: 'type', displayName: '类型'},
            {
                name: 'updated_at',
                displayName: '操作',
                cellTemplate: linkCellTemplate,
                enableSorting: false,
                width: '60',
                visible: $scope.isorgmanager
            }
        ];

        $scope.domainGridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };

        $scope.remove = function (obj) {
            obj.organizationId = $scope.id;
            if (obj.owningOrganizationId == $scope.id) {
                $confirm({
                    text: obj.name + '属于当前组织,无法解除绑定,将会被直接删除!',
                    title: "确认删除",
                    ok: "确认",
                    cancel: '取消'
                }).then(function () {
                    organizationService.deletePrivateDomains(obj.owningOrganizationId, obj.id).then(function (response) {
                        notificationService.info(obj.name + '已删除');
                        $scope.refresh();
                    }, function (err) {
                        $log.error(err);
                        if (err.data.code)
                            notificationService.error(obj.name + '删除失败,原因是:' + err.data.description);
                    });

                });
            } else {
                $confirm({
                    text: '域名' + obj.name + '将会解除绑定',
                    title: "确认解除绑定",
                    ok: "确认",
                    cancel: '取消'
                }).then(function () {
                    organizationService.disassociateDomainWithOrganization(obj).then(function (response) {
                        notificationService.info(obj.name + '已解除绑定');
                        $scope.$emit("DomainUnbindEvent", obj.name);
                        $scope.refresh();
                    }, function (err) {
                        $log.error(err);
                        if (err.data.code)
                            notificationService.error(obj.name + '解绑失败,原因是:' + err.data.description);
                    });

                });
            }

        };

        $scope.refresh = function () {
            $scope.getDomains();
        };

    }]);

app.controller('OrganizationDetailsCtrl3', ['$rootScope', '$scope', '$modal', '$log', '$q', '$stateParams', 'organizationService', 'userService', 'i18nService', 'notificationService', 'dialogs', function ($rootScope, $scope, $modal, $log, $q, $stateParams, organizationService, userService, i18nService, notificationService, dialogs) {
    i18nService.setCurrentLang("zh-cn");
    $scope.currentUser = {
        name: localStorage.getItem('userName'),
        currentManager: false
    };

    $scope.retrieveRolesOfAllUsersForTheOrganization = function () {
        $scope.users = [];

        organizationService.retrieveRolesOfAllUsersForTheOrganization($scope.id).then(function (response) {
            var data = response.data;

            angular.forEach(data.resources, function (user, key) {

                var orgManager = false;
                var orgAuditor = false;
                var billingManager = false;
                var rolelist = [];
                var userRoles = [];

                angular.forEach(user.entity.organization_roles, function (userRole, key) {

                    var objectRole = {
                        role: userRole
                    };

                    if (userRole === 'org_manager') {
                        orgManager = true;
                        rolelist.push('管理员');
                        objectRole.label = '管理员';

                    }
                    if (userRole === 'billing_manager') {
                        orgAuditor = true;
                        rolelist.push('计费员');
                        objectRole.label = '计费员';
                    }
                    if (userRole === 'org_auditor') {
                        billingManager = true;
                        rolelist.push('审计员');
                        objectRole.label = '审计员';
                    }
                    if (userRole === 'org_user') {
                        billingManager = true;
                        rolelist.push('普通用户');
                        objectRole.label = '普通用户';
                    }

                    userRoles.push(objectRole);

                });

                var objectUser = {
                    id: user.metadata.guid,
                    organizationId: $scope.id,
                    name: user.entity.username,
                    userRoles: rolelist.join(','),
                    roleMaps: userRoles,
                    orgManager: orgManager,
                    orgAuditor: orgAuditor,
                    billingManager: billingManager,
                    currentUser: $scope.currentUser.name === user.entity.username
                };
                $scope.users.push(objectUser);

                if ($scope.currentUser.name === user.entity.username) {
                    $scope.currentUser.currentManager = orgManager;
                }

            });
        }, function (err) {
            $log.error(err);
        });

    };
    // $scope.retrieveRolesOfAllUsersForTheOrganization();

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
        {name: 'organizationId', displayName: 'organizationId', visible: false},
        {name: 'name', displayName: '用户名'},
        {name: 'userRoles', displayName: '角色', visible: false},
        {
            name: 'orgManager',
            displayName: '管理员',
            cellTemplate: '<input type="checkbox" ng-disabled="!grid.appScope.isorgmanager||row.entity.orgManager" ng-change="grid.appScope.bind_unbind(row.entity,\'org_manager\')" ng-model="row.entity.orgManager">'
        },
        {
            name: 'orgAuditor',
            displayName: '审计员',
            cellTemplate: '<input type="checkbox" ng-disabled="!grid.appScope.isorgmanager||(!row.entity.orgAuditor&&(row.entity.orgManager||row.entity.billingManager))" ng-change="grid.appScope.bind_unbind(row.entity,\'org_auditor\')" ng-model="row.entity.orgAuditor">'
        },
        {
            name: 'billingManager',
            displayName: '计费员',
            cellTemplate: '<input type="checkbox" ng-disabled="!grid.appScope.isorgmanager" ng-change="grid.appScope.bind_unbind(row.entity,\'billing_manager\')" ng-model="row.entity.billingManager">'
        },
        {name: 'roleMaps', visible: false},
        {name: 'id', visible: false, cellTemplate: linkCellTemplate, width: 120, enableSorting: false}
    ];

    $scope.refresh = function () {
        $scope.retrieveRolesOfAllUsersForTheOrganization();
        $scope.bindedUserGridOptions.data = $scope.users;
    };


    $scope.bind_unbind = function (obj, role) {
        if (role == 'org_manager') {
            if (obj.orgManager) {
                associateManagerWithOrganization(obj);
            }
            else {
                if (obj.name == localStorage.getItem('userName')) {
                    return;
                }
                $scope.bindedUserGridOptions.gridApi.core.refresh();
                // disassociateManagerWithOrganization(obj);
            }
        }
        if (role == 'org_auditor') {
            if (obj.orgAuditor) {
                associateAuditorWithOrganization(obj);
            }
            else {
                disassociateAuditorWithOrganization(obj);
            }
        }
        if (role == 'billing_manager') {
            if (obj.billingManager) {
                associateBillingManagerWithOrganization(obj);
            }
            else {
                disassociateBillingManagerWithOrganization(obj);
            }
        }
    }

    // $scope.unbind = function (obj) {
    //     var dlg = dialogs.create('tpl/app_org_usr_unbind.html', 'UnbindDialogCtrl', obj, 'default');
    //     dlg.result.then(function (roles) {
    //         var promises = [];
    //         angular.forEach(roles, function (role, i) {
    //             if (role == 'org_manager') {
    //                 promises.push(disassociateManagerWithOrganization(obj));
    //             }
    //             if (role == 'org_auditor') {
    //                 promises.push(disassociateAuditorWithOrganization(obj));
    //             }
    //             if (role == 'billing_manager') {
    //                 promises.push(disassociateBillingManagerWithOrganization(obj));
    //             }
    //             if (role == 'org_user') {
    //                 promises.push(disassociateUserWithOrganization(obj));
    //             }
    //
    //             $q.all(promises).then(function () {
    //                 $scope.refresh();
    //             });
    //         });
    //     }, function () {
    //         notificationService.info('未作任何变更');
    //     });
    // };

    $scope.addUser = function () {
        var dlg = dialogs.create('tpl/app_org_usr_bind.html', 'BindDialogCtrl', $scope.id, 'default');
        dlg.result.then(function (roles, name) {
            var obj = {"organizationId": $scope.id, "name": name};
            var promises = [];
            angular.forEach(roles, function (role, i) {
                if (role == 'org_manager') {
                    promises.push(associateManagerWithOrganization(obj));
                }
                if (role == 'org_auditor') {
                    promises.push(associateAuditorWithOrganization(obj));
                }
                if (role == 'billing_manager') {
                    promises.push(associateBillingManagerWithOrganization(obj));
                }
            });
            $q.all(promises).then(function () {
                $scope.refresh();
            });
        }, function () {
            notificationService.info('未作任何变更');
        });
    }

    function disassociateManagerWithOrganization(obj) {
        organizationService.disassociateManagerWithOrganization(obj).then(function (response) {
            notificationService.info('管理员解绑成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('管理员解绑失败:' + err.data.description);
        });
    }

    function associateManagerWithOrganization(obj) {
        var defer = $q.defer();
        organizationService.associateManagerWithOrganization(obj).then(function (response) {
            notificationService.info('管理员绑定成功');
            defer.resolve();
        }, function (err) {
            defer.reject();
            $log.error(err);
            if (err.data.code)
                notificationService.error('管理员绑定失败:' + err.data.description);
        });
        return defer.promise;
    }

    function disassociateAuditorWithOrganization(obj) {
        organizationService.disassociateAuditorWithOrganization(obj).then(function (response) {
            notificationService.info('审计员解绑成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('审计员解绑失败:' + err.data.description);
        });
    }

    function associateAuditorWithOrganization(obj) {
        var defer = $q.defer();
        organizationService.associateAuditorWithOrganization(obj).then(function (response) {
            notificationService.info('审计员绑定成功');
            defer.resolve();
        }, function (err) {
            defer.reject();
            $log.error(err);
            if (err.data.code)
                notificationService.error('审计员绑定失败:' + err.data.description);
        });
        return defer.promise;
    }

    function disassociateBillingManagerWithOrganization(obj) {
        organizationService.disassociateBillingManagerWithOrganization(obj).then(function (response) {
            notificationService.info('计费员解绑成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('计费员解绑失败:' + err.data.description);
        });
    }

    function associateBillingManagerWithOrganization(obj) {
        var defer = $q.defer();
        organizationService.associateBillingManagerWithOrganization(obj).then(function (response) {
            notificationService.info('计费员绑定成功');
            defer.resolve();
        }, function (err) {
            defer.reject();
            $log.error(err);
            if (err.data.code)
                notificationService.error('计费员绑定失败:' + err.data.description);
        });
        return defer.promise;
    }

    function disassociateUserWithOrganization(obj) {
        organizationService.disassociateUserWithOrganization(obj).then(function (response) {
            notificationService.info('普通用户解绑成功');
        }, function (err) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('普通用户解绑失败:' + err.data.description);
        });
    }

}]);

app.controller('BindDialogCtrl', ['$scope', '$modalInstance', '$confirm', '$log', '$q', 'organizationService', 'userService', 'notificationService', 'data', function ($scope, $modalInstance, $confirm, $log, $q, organizationService, userService, notificationService, data) {
    $scope.data = data;

    $scope.roles = [{
        label: '管理员',
        role: 'org_manager'
    }, {
        label: '计费员',
        role: 'billing_manager'
    }, {
        label: '审计员',
        role: 'org_auditor'
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
])
;


app.controller('OrganizationDetailsCtrl4', ['$rootScope', '$scope', '$location', '$log', '$stateParams', '$confirm', 'organizationService', 'notificationService',
    function ($rootScope, $scope, $location, $log, $stateParams, $confirm, organizationService, notificationService) {
        $scope.updateOrganization = function () {
            var organization = {
                id: $scope.id,
                name: $scope.name
            };
            organizationService.editOrganization(organization).then(function (response) {
                notificationService.success('修改组织' + $scope.organization.name + '成功');
            }, function (err) {
                $log.error(err);
                if (err.data.code)
                    notificationService.error(err);
            });
        };

        $scope.reset = function () {
            $scope.name = $stateParams.name;
        };

        $scope.delete = function () {
            $confirm({
                text: '请确认是否删除' + $scope.name,
                title: "确认删除",
                ok: "确认",
                cancel: '取消'
            }).then(function () {
                var org = {"id": $scope.id, "name": $scope.name};

                organizationService.getOrganization($scope.id).then(function (response) {
                    var data = response.data;
                    $scope.quotaDefID = data.entity.quota_definition_guid;
                    organizationService.deleteOrganization(org).then(function (response) {
                        notificationService.success('删除组织[' + org.name + ']成功');
                        organizationService.deleteQuota($scope.quotaDefID);
                        $location.path('/');
                    }, function (err, status) {
                        $log.error(err);
                        if (err.data.code)
                            notificationService.error('删除组织[' + org.name + ']失败,原因是:\n' + err.data.description);
                    });
                }, function (err) {
                    $log.error(err);
                    if (err.data.code)
                        notificationService.error(err.data.description);
                });
            });
        }

    }]);