app.controller('OrganizationAddCtrl', ['$scope', '$modalInstance', '$log', 'organizationService', 'messageService', 'notificationService', function ($scope, $modalInstance, $log, organizationService, messageService, notificationService) {

    $scope.ok = function () {
        // $scope.quota.name = $scope.organization.name+'的组织配额';
        $scope.quota.name = $scope.organization.name + '的组织配额';
        //新增组织配额
        organizationService.addQuota($scope.quota).then(function (response) {
            $scope.organization.quota_definition_guid = response.data.metadata.guid;
            //新增组织
            organizationService.addOrganization($scope.organization).then(function (response) {
                $modalInstance.close(true);
                notificationService.success('组织：' + $scope.organization.name + '创建成功！');
            }, function (err) {
                $log.error(err);
                notificationService.error('组织：' + $scope.organization.name + '创建失败！' + err.data.description);
                //新增组织失败后，删除组织配额信息
                organizationService.deleteQuota($scope.organization.quota_definition_guid);
                $modalInstance.close(false);
            });
        }, function (err) {
            $log.error(err);
            notificationService.error('组织：' + $scope.organization.name + '创建失败！' + err.data.description);
            $modalInstance.close(false);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.isActive = function (option) {
        if (option == 's') {
            $scope.quota = {
                "total_services": 5,
                "total_routes": 5,
                "total_private_domains": 5,
                "memory_limit": 512,
                "instance_memory_limit": 512,
                "app_instance_limit": 5
            };
        }
        if (option == 'm') {
            $scope.quota = {
                "total_services": 20,
                "total_routes": 20,
                "total_private_domains": 20,
                "memory_limit": 2048,
                "instance_memory_limit": 1024,
                "app_instance_limit": 20
            };
        }
        if (option == 'l') {
            $scope.quota = {
                "total_services": 50,
                "total_routes": 50,
                "total_private_domains": 50,
                "memory_limit": 10240,
                "instance_memory_limit": 2048,
                "app_instance_limit": 50
            };
        }
    };
}]);
