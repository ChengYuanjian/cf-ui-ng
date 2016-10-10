/**
 * Created by wocao on 2016/7/26.
 */
app.controller('AppCreateInstanceCtrl', ['$scope', '$modalInstance', '$log', 'spaceService', 'organizationService', 'notificationService',
    'buildpackService', 'applicationService', 'routeService', 'crypt',
    function ($scope, $modalInstance, $log, spaceService, organizationService, notificationService, buildpackService, applicationService, routeService, crypt) {
        $scope.organizations = [];
        $scope.buildpacks = [];
        $scope.app_file = {};
        var app_route_guid = "";
        var app_guid = "";

        //组织下拉选单
        organizationService.getOrganizations().then(function (response) {
            var orgsdata = response.data;
            angular.forEach(orgsdata.resources, function (org, i) {
                var objectOrg = {
                    guid: org.metadata.guid,
                    name: org.entity.name,
                };
                $scope.organizations.push(objectOrg);
            });
        }, function (err) {
            $log.error(err.data.description);
        });


        //应用类型下拉选单
        buildpackService.getBuildpacks().then(function (response) {
            var orgsdata = response.data;
            angular.forEach(orgsdata.resources, function (org, i) {
                var objectOrg = {
                    guid: org.metadata.guid,
                    name: org.entity.name,
                };
                $scope.buildpacks.push(objectOrg);
            });
        }, function (err) {
            $log.error(err.data.description);
        });


        //根据组织下拉选单来取得空间与域名下拉菜单
        $scope.getSpacesByOrganization = function (organization) {

            if (organization == null) {
                return;
            }
            //reset var
            $scope.domains = [];
            $scope.spaces = [];
            organizationService.getSpacesForTheOrganization(organization.guid).then(function (response) {
                var spacedata = response.data;
                angular.forEach(spacedata.resources, function (_spacedata) {
                    var space = {
                        guid: _spacedata.metadata.guid,
                        name: _spacedata.entity.name,
                    }
                    $scope.spaces.push(space);
                }, function (err) {
                    $log.error(err.data.description);
                });
            });

            organizationService.getPrivateDomainsForTheOrganization(organization.guid).then(function (response) {
                var spacedata = response.data;
                angular.forEach(spacedata.resources, function (_spacedata) {
                    var domain = {
                        guid: _spacedata.metadata.guid,
                        name: _spacedata.entity.name + '(私有)',
                    }
                    $scope.domains.push(domain);
                }, function (err) {
                    $log.error(err.data.description);
                });
            });

            organizationService.getSharedDomainsForTheOrganization(organization.guid).then(function (response) {
                var data = response.data;

                angular.forEach(data.resources, function (sharedDomain, i) {
                    var sharedDomainObject = {
                        guid: sharedDomain.metadata.guid,
                        name: sharedDomain.entity.name + '(共享)'
                    };
                    $scope.domains.push(sharedDomainObject);
                });
            }, function (err) {
                $log.error(err);
            });
        };


        $scope.isActive = function (option) {
            if (option == 's') {
                $scope.quota = {
                    "memory": 128,
                    "instances": 1,
                    "disk_quota": 512
                };

            }
            if (option == 'm') {
                $scope.quota = {
                    "memory": 512,
                    "instances": 2,
                    "disk_quota": 1024
                };
            }
            if (option == 'l') {
                $scope.quota = {
                    "memory": 1024,
                    "instances": 4,
                    "disk_quota": 2048
                };
            }
        };


        $scope.isallowed = function (option) {
            if (option == 't') {
                $scope.nonallowed = {
                    "non_basic_services_allowed": true
                };

            }
            else {
                $scope.nonallowed = {
                    "non_basic_services_allowed": false
                };
            }

        };

        $scope.processFiles = function (files) {
            var resources = [];
            angular.forEach(files, function (flowFile, i) {
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    result = event.target.result;
                    sha1 = crypt.SHA1(event.target.result.data);

                    var fileEntity = {
                        "sha1": sha1,
                        "fn": flowFile.relativePath,
                        "size": flowFile.file.size
                    }
                    resources.push(fileEntity);
                };
                fileReader.readAsBinaryString(flowFile.file);
            });

            $scope.uploadapp = {};
            $scope.uploadapp.resources = resources;
            $scope.uploadapp.application = files[0].file;
        };

        $scope.route = {};
        $scope.addapp = function () {

            // var filss = $scope.app_file.flow.files;
            $scope.quota.spaceId = $scope.space.guid;
            $scope.quota.name = $scope.app.name;
            $scope.quota.buildpack = $scope.buildpack.name;

            $scope.route.domainId = $scope.domain.guid;
            $scope.route.spaceId = $scope.space.guid;



            var iscreateRoute = false;
            var isrouteApp = false;
            var isApp = false;
            var creatappok = false;


            //新增App,由APP名称及空间产生APPid
            applicationService.createApplication($scope.quota).then(function (response) {
                isApp = true;
                $scope.app.guid = response.data.metadata.guid;
                app_guid = response.data.metadata.guid;
                $scope.space.quota_definition_guid = response.data.metadata.guid;
                $scope.space.organizationId = $scope.organization.guid;

                //创建路由
                routeService.createRoute($scope.route).then(function (response1) {
                    iscreateRoute = true;
                    $scope.route.guid = response1.data.metadata.guid;
                    app_route_guid = response1.data.metadata.guid;
                    //配置路由
                    $scope.app.route_guid = app_route_guid;
                    applicationService.associaterouteApplication($scope.app).then(function (response2) {
                        isrouteApp = true;
                        //导入APP
                        //    var  app_guid = "e84620b4-7639-4adf-9b89-3425d0e4a5af" ;
                        //封装字符串

                        $scope.uploadapp.id = app_guid;
                        applicationService.addApplicationOne($scope.uploadapp).then(function (response3) {
                            creatappok = true;

                            var editapp = {
                                "id": $scope.app.guid,
                                "state": "STARTED"
                            }

                            applicationService.stateApplication(editapp).then(function (response4) {
                                notificationService.info('应用：' + $scope.quota.name + '创建成功！')
                                $modalInstance.close();
                            }, function (err) {
                                $log.error(err);
                                notificationService.error('启动应用[' + apps.name + ']失败,原因是:\n' + err.data.description);
                            });

                        }, function (err) {
                            $log.error(err);
                            $scope.falsedelete(iscreateRoute, isrouteApp, isApp, creatappok);
                            if (err.data.code)
                                notificationService.error('应用：' + $scope.quota.name + '创建失败！' + err.data.description);
                            $modalInstance.dismiss();
                        });

                    }, function (err) {
                        $log.error(err);
                        $scope.falsedelete(iscreateRoute, isrouteApp, isApp, creatappok);
                        if (err.data.code)
                            notificationService.error('应用：' + $scope.quota.name + '创建失败！' + err.data.description);
                        $modalInstance.dismiss();
                    });
                }, function (err) {
                    $log.error(err);
                    $scope.falsedelete(iscreateRoute, isrouteApp, isApp, creatappok);
                    if (err.data.code)
                        notificationService.error('应用：' + $scope.quota.name + '创建失败！' + err.data.description);
                    $modalInstance.dismiss();
                });

                /*   creatappok = true ;
                 messageService.addMessage('success', '应用：' + $scope.quota.name + '创建成功！', true);
                 $modalInstance.close();*/
            }, function (err) {
                $log.error(err);
                $scope.falsedelete(iscreateRoute, isrouteApp, isApp, creatappok);
                if (err.data.code)
                    notificationService.error('应用：' + $scope.quota.name + '创建失败！' + err.data.description);
                $modalInstance.dismiss();
            });
        };


        $scope.falsedelete = function (iscreateRoute, isrouteApp, isApp, creatappok) {
            if (creatappok == false && (iscreateRoute == true || isrouteApp == true || isApp == true)) {
                if (isrouteApp == true) {
                    //删除配置路由
                    var routeAppdate = {
                        "route_guid": app_route_guid,
                        "guid": app_guid
                    }
                    applicationService.removerouteApplication(routeAppdate).then(function (response) {
                        //删除创建路由
                        var routeId = app_route_guid;
                        routeService.deleteRoute(routeId).then(function (response) {

                        }, function (err) {
                            $log.error(err);
                        });

                        //失败后，全部清除
                        applicationService.deleteApplication(app_guid).then(function (response) {

                        }, function (err) {
                            $log.error(err);
                        });
                    }, function (err) {
                        $log.error(err);
                    });
                } else {
                    //删除创建路由
                    var routeId = app_route_guid;
                    routeService.deleteRoute(routeId).then(function (response) {

                    }, function (err) {
                        $log.error(err);
                    });


                    //失败后，全部清除
                    applicationService.deleteApplication(app_guid).then(function (response) {

                    }, function (err) {
                        $log.error(err);
                    });
                }

            }

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);
