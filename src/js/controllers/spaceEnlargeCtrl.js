app.controller('SpaceEnlargeCtrl', [ '$rootScope', '$scope','$stateParams','$log','spaceService','organizationService','notificationService','$modalInstance',
    function($rootScope, $scope,$stateParams,$log, spaceService,organizationService,notificationService,$modalInstance) {

        $scope.organizations = [];
        $scope.spaces = [];
        $scope.spaceName='';
        $scope.spaceappdatas = [];
        $scope.spacedomaindatas = [];

        $scope.isActive = function (option)
        {
            if(option=='s')
            {
                $scope.quota = {
                    "total_services":5,
                    "total_routes":5,
                    "memory_limit":512,
                    "instance_memory_limit":512,
                    "app_instance_limit":5,
                    /* "total_reserved_route_ports":2,*/
                    "total_service_keys":5

                };

            }
            if(option=='m')
            {
                $scope.quota = {
                    "total_services":20,
                    "total_routes":20,
                    "memory_limit":2048,
                    "instance_memory_limit":1024,
                    "app_instance_limit":20,
                    /* "total_reserved_route_ports":5,*/
                    "total_service_keys":20
                };
            }
            if(option=='l')
            {
                $scope.quota = {
                    "total_services":50,
                    "total_routes":50,
                    "total_private_domains":50,
                    "memory_limit":10240,
                    "instance_memory_limit":2048,
                    "app_instance_limit":50,
                    /*"total_reserved_route_ports":10,*/
                    "total_service_keys":50
                };
            }
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
                        var maxService = 0;
                        var maxRoute=0;
                        var sumMem=0;
                        var sumApplication=0;
                        $scope.usedMemoryPercent;
                        $scope.usedApplicationPercent;
                        $scope.usedServicePercent;
                        $scope.usedRoutesPercent;
                        angular.forEach(data.apps,function(_data,i){
                            sumMem = _data.memory+sumMem;
                            sumApplication = _data.instances+sumApplication;
                            maxRoute = _data.routes.length+maxRoute;
                        })
                        maxService = data.services.length;
                        if ($scope.quota.memory_limit > 0) {
                            $scope.usedMemoryPercent = Math.round((sumMem/$scope.quota.memory_limit) * 100);
                        } else {
                            $scope.usedMemoryPercent = 0;
                        }
                        if ($scope.quota.app_instance_limit > 0) {
                            $scope.usedApplicationPercent = Math.round((sumApplication/$scope.quota.app_instance_limit) * 100);
                        } else {
                            $scope.usedApplicationPercent = 0;
                        }
                        if ($scope.quota.total_services > 0) {
                            $scope.usedServicePercent = Math.round((maxService/$scope.quota.total_services) * 100);
                        } else {
                            $scope.usedServicePercent = 0;
                        }
                        if ($scope.quota.total_routes > 0) {
                            $scope.usedRoutesPercent = Math.round((maxRoute/$scope.quota.total_routes) * 100);
                        } else {
                            $scope.usedRoutesPercent = 0;
                        }
                    })
                }, function(err) {
                    $log.error(err.data.description);
                });
            }, function(err) {
                $log.error(err.data.description);
            });
        }

        //更新
        $scope.ok = function () {
            $scope.space = {
                id: $stateParams.guid,
                name: $scope.spaceName,
            };
            /*   var quota = {
             id:$stateParams.guid,
             }*/
                spaceService.editSpace($scope.space).then(function(){
                $scope.quota.guid = $scope.quotaDefID;
                spaceService.editSpaceQuota($scope.quota);
                notificationService.success('修改空间成功');
                $modalInstance.close(true);
            }, function (err) {
                $log.error(err);
                if (err.data.code)
                    notificationService.error('修改空间失败,原因是:\n' + err.data.description);
                $modalInstance.close(false);
            })

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.getSpace()



    }]);