/**
 * Created by wocao on 2016/7/22.
 */
app.controller('SpaceCreateInstanceCtrl', ['$scope', '$modalInstance','$log','spaceService','organizationService','messageService','organization','notificationService',
    function($scope, $modalInstance,$log,spaceService,organizationService,messageService,organization,notificationService) {
        $scope.organizations = [];
        $scope.organizationName;
        if(organization){
            $scope.organization =organization;
        }


        //组织下拉选单
        organizationService.getOrganizations().then(function (response) {
            var orgsdata = response.data;
            var j = 0;
            angular.forEach(orgsdata.resources, function (org, i) {
                var objectOrg = {
                    guid: org.metadata.guid,
                    id: org.metadata.guid,
                    name: org.entity.name,
                };if(organization){
                    if(organization.guid === org.metadata.guid)
                        j = i;
                }
                $scope.organizations.push(objectOrg);
            });
            $scope.organization = $scope.organizations[j];
        });



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


        $scope.isallowed = function (option)
        {
            if(option=='t')
            {
                $scope.nonallowed = {
                    "non_basic_services_allowed":true
                };

            }
            else
            {
                $scope.nonallowed = {
                    "non_basic_services_allowed":false
                };
            }

        };




        $scope.addspaceok = function () {
            // $scope.quota.name = $scope.organization.name+'的组织配额';
            $scope.quota.organization_guid  = $scope.organization.guid;
            $scope.quota.name = $scope.space.name ;
            $scope.quota.non_basic_services_allowed = $scope.nonallowed.non_basic_services_allowed ;
            //新增空间配额
            var  quota_definition_guid ;
            spaceService.addSpaceQuota($scope.quota).then(function(response){
                quota_definition_guid = response.data.metadata.guid;
                notificationService.success('创建配额成功');
                $scope.space.organizationId = $scope.organization.guid ;
                //新增空间
                spaceService.addSpace($scope.space).then(function(response) {
                    var space_guid = response.data.metadata.guid;
                    spaceService.associateSpaceWithSpaceQuata(quota_definition_guid,space_guid).then(function(){
                        notificationService.success('创建空间成功');
                        $modalInstance.close(true);
                    });
                }, function (err, status) {
                    $log.error(err);
                    if (err.data.code)
                        notificationService.error('创建空间失败,原因是:\n' + err.data.description);
                });

            }, function (err, status) {
                $log.error(err);
                if (err.data.code)
                    notificationService.error('创建配额失败,原因是:\n' + err.data.description);
            });
        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

}]);
