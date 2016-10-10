/**
 * Created by ssy on 2016/8/2.
 */
app.controller('DomainCreateCtrl', ['$scope','$modalInstance', '$log','organizationService','spaceService','routeService','applicationService','notificationService','domainService',
    function($scope, $modalInstance, $log,organizationService,spaceService,routeService,applicationService,notificationService,domainService) {
        organizationService.getOrganizations().then(function(response) {
            $scope.domains = [];
            $scope.organizations = [];
            $scope.domainName;
            $scope.flag = 1;
            var data = response.data;
            angular.forEach(data.resources, function(organization, i) {

                var objectOrganization = {
                    id: organization.metadata.guid,
                    name: organization.entity.name,
                };
                $scope.organizations.push(objectOrganization);
                });
        });

        $scope.getOrgByParams = function(selected_org) {
            if ( selected_org == null) {
                return;
            } else {
                $scope.guid = selected_org.id;
            }
        };

        $scope.privateToShared = function(){
            $scope.flag  = 0;
            document.getElementById("org").style.visibility="hidden";
        }


        $scope.sharedToPrivate = function(){
            $scope.flag  = 1;
            document.getElementById("org").style.visibility="visible";
        }

        //表单提交
        $scope.ok = function () {
            //共享
            if($scope.flag  == 0){
                $scope.domain = {
                    name:$scope.domainName,
                }
                domainService.addSharedDomain($scope.domain).then(function(resp){
                    $modalInstance.close();
                    notificationService.success('创建路由成功');
                }, function (err, status) {
                        $log.error(err);
                        if (err.data.code)
                            notificationService.error('创建路由失败,原因是:\n' + err.data.description);
                    })
            }else if($scope.flag  == 1) {
                $scope.domain = {
                    organizationID:$scope.guid,
                    name: $scope.domainName,
                }
                domainService.addPrivateDomain($scope.domain).then(function (resp) {
                    $modalInstance.close();
                    notificationService.success('创建路由成功');
                }, function (err, status) {
                    $log.error(err);
                    if (err.data.code)
                        notificationService.error('创建路由失败,原因是:\n' + err.data.description);
                });
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
