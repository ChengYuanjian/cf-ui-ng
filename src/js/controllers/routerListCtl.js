
app.controller('RouterListCtrl', [ '$rootScope', '$scope','$modal','$log','$q','$confirm','routeService','organizationService','spaceService','i18nService','notificationService','uiGridConstants',

    function($rootScope, $scope,$modal,$log,$q,$confirm, routeService,organizationService,spaceService,i18nService,notificationService,uiGridConstants) {
        $scope.organizations = [];
        $scope.spaces=[];
        $scope.routers = [];


        //create router page
        $scope.create = function () {
            var modalInstance = $modal.open({
                templateUrl: 'tpl/app_router_create.html',
                controller: 'RouterCreateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['js/controllers/routerCreateCtrl.js']);
                        }]
                }
            });

            modalInstance.result.then(function () {
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        var currOrg;
        //get all orgs
        organizationService.getOrganizations().then(function(response) {
            var orgsdata = response.data;
            angular.forEach(orgsdata.resources, function (org, i) {
                var objectOrg = {
                    id: org.metadata.guid,
                    name: org.entity.name,
                };
                $scope.organizations.push(objectOrg);
            });
        });

        //get apps by one space
        $scope.getRoutersBySpaceParams=function(selected_space){
            if(selected_space==null){
                $scope.getRoutersByOrgParams(currOrg);
                return;
            }
            $scope.routers=[];
            spaceService.getRoutesForTheSpace(selected_space.id).then(function(resp){
                var data=resp.data;
                angular.forEach(data.resources,function(appdata){
                    var objectHost = {
                        id:appdata.metadata.guid,
                        url: appdata.entity.host,
                        org: null,
                        space: null,
                        apps: null,
                        created_at:appdata.metadata.created_at,
                        updated_at:appdata.metadata.updated_at,
                    };

                    routeService.getAppsForRoute(appdata.metadata.guid, false).then(function(app_response){
                      var apps = app_response.data;
                      angular.forEach(apps.resources, function(app, i){
                        if (objectHost.apps == null){
                          objectHost.apps = app.entity.name;
                        } else {
                            objectHost.apps = objectHost.apps + "|" + app.entity.name;
                        }
                      })
                    });

                    spaceService.getSpace(selected_space.id).then(function(space_response){
                      var space = space_response.data.entity.name;
                      objectHost.space = space;
                      organizationService.getOrganization(space_response.data.entity.organization_guid).then(function(org_response){
                        var org = org_response.data.entity.name;
                        objectHost.org = org;
                      });
                    });

                    $scope.routers.push(objectHost);
                });
                $scope.refresh1();
            });
        };

//get apps by one org
        $scope.getRoutersByOrgParams=function(selected_org){
            currOrg=selected_org;
            if (selected_org==null){
                $scope.getRoutes();
                return;
            }

            //reset var
            $scope.routers=[];
            $scope.spaces=[];
            organizationService.getSpacesForTheOrganization(selected_org.id).then(function(response){
                var spacedata = response.data;
                angular.forEach(spacedata.resources,function(_spacedata){
                    var space={
                        id:_spacedata.metadata.guid,
                        name:_spacedata.entity.name,
                    }
                    $scope.spaces.push(space);

                    spaceService.getRoutesForTheSpace(_spacedata.metadata.guid).then(function(resp){
                        var data=resp.data;
                        angular.forEach(data.resources,function(appdata){
                            var objectHost = {
                                id:appdata.metadata.guid,
                                url: appdata.entity.host,
                                org: null,
                                space: null,
                                apps: null,
                                created_at:appdata.metadata.created_at,
                                updated_at:appdata.metadata.updated_at,
                            };

                            routeService.getAppsForRoute(appdata.metadata.guid, false).then(function(app_response){
                              var apps = app_response.data;
                              angular.forEach(apps.resources, function(app, i){
                                if (objectHost.apps == null){
                                  objectHost.apps = app.entity.name;
                                } else {
                                    objectHost.apps = objectHost.apps + "|" + app.entity.name;
                                }
                              })
                            });

                            var space = _spacedata.entity.name;
                            objectHost.space = space;
                            organizationService.getOrganization(_spacedata.entity.organization_guid).then(function(org_response){
                              var org = org_response.data.entity.name;
                              objectHost.org = org;
                            });

                            $scope.routers.push(objectHost);
                        });
                    });
                });
                $scope.refresh1();
            });
        };


        //get all routers
        $scope.getRoutes=function() {
            //set datas contains noting
            $scope.routers = [];
            routeService.getRoutes().then(function(response) {
                var data = response.data;
                angular.forEach(data.resources, function(organization, i) {
                  var objectOrganization = {
                      id:organization.metadata.guid,
                      url: organization.entity.host,
                      org: null,
                      space: null,
                      apps: null,
                      created_at:organization.metadata.created_at,
                      updated_at:organization.metadata.updated_at,
                  };

                  routeService.getAppsForRoute(organization.metadata.guid, false).then(function(app_response){
                    var apps = app_response.data;
                    angular.forEach(apps.resources, function(app, i){
                      if (objectOrganization.apps == null){
                        objectOrganization.apps = app.entity.name;
                      } else {
                          objectOrganization.apps = objectOrganization.apps + "|" + app.entity.name;
                      }
                    })
                  });

                  spaceService.getSpace(organization.entity.space_guid).then(function(space_response){
                    var space = space_response.data.entity.name;
                    objectOrganization.space = space;
                    organizationService.getOrganization(space_response.data.entity.organization_guid).then(function(org_response){
                      var org = org_response.data.entity.name;
                      objectOrganization.org = org;
                    });
                  });

                  $scope.routers.push(objectOrganization);
              });
                $scope.refresh1();
            });
        }

        $scope.getRoutes();

        $scope.deleteRoutes = function () {
            if ($scope.gridApi.selection.getSelectedRows().length < 1)
                notificationService.info('请选择一条记录');
            else {
                $confirm({
                    text: '请确认是否删除选择的' + $scope.gridApi.selection.getSelectedRows().length + '个路由',
                    title: "确认删除",
                    ok: "确认",
                    cancel: '取消'
                }).then(function () {
                    var promises = [];
                    angular.forEach($scope.gridApi.selection.getSelectedRows(), function (route, i) {
                        promises.push($scope.delete(route));
                    });
                    $q.all(promises).then(function () {
                        $scope.refresh();
                    })
                });
            }
        };

        $scope.delete = function (route) {
            var defer = $q.defer();
            routeService.deleteRoute(route.id).then(function (response) {
                notificationService.success('删除路由[' + route.url + ']成功');
                defer.resolve();
            }, function (err, status) {
                defer.reject();
                $log.error(err);
                if (err.data.code)
                    notificationService.error('删除路由[' + route.url + ']失败,原因是:\n' + err.data.description);
            });
            return defer.promise;
        }



        i18nService.setCurrentLang("zh-cn");

        $scope.gridOptions = {
            data: $scope.routers,
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
            $scope.gridOptions.data = $scope.routers.filter(function (data) {
                if (data.url.toLowerCase().indexOf($scope.filter.filterText) > -1) {
                    return true;
                }
                else {
                    return false;
                }
            });

        }, true);

        $scope.gridOptions.columnDefs = [
            {name: 'id', displayName: 'ID', visible: false},
            {name: 'url', displayName: '路由名称'},
            {name: 'org', displayName: '组织'},
            {name: 'space', displayName: '空间'},
            {name: 'apps', displayName: '应用'},
            {name: 'created_at', displayName: '创建时间', sort: {
                direction: uiGridConstants.DESC,
                priority: 1,
            },
            },
            {name: 'updated_at', displayName: '更新时间'}
        ];

        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        }

        $scope.refresh1= function () {
            $scope.gridOptions.data = $scope.routers;
            /*$scope.gridApi.core.refresh();*/
        };

        $scope.refresh = function () {
            $scope.getRoutes();
           /* $scope.gridOptions.data = $scope.routers;
            $scope.gridApi.core.refresh();*/
        }


    }
]);
