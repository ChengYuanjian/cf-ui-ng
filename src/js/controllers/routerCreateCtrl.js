/**
 * Created by ssy on 2016/7/25.
 */

app.controller('RouterCreateCtrl', ['$scope','$modalInstance', '$log','organizationService','spaceService','routeService','applicationService','notificationService',
    function($scope, $modalInstance, $log,organizationService,spaceService,routeService,applicationService,notificationService) {
    $scope.domains = [];
    $scope.domainSharedList = [];
    $scope.domainPrivatedList = [];
    $scope.organizations = [];
    $scope.spaces=[];
    $scope.routers = [];
    $scope.selected_domain;
    $scope.selected_space;
    $scope.hostName;


            organizationService.getOrganizations().then(function(response) {
                var data = response.data;

                organizationService.getSharedDomainsForTheOrganization().then(function(response) {
                    var data = response.data;
                    angular.forEach(data.resources, function(sharedDomain, i){
                        var sharedDomainObject = {
                            id: sharedDomain.metadata.guid,
                            name: sharedDomain.entity.name+"(共享域)",
                            created_at: sharedDomain.metadata.created_at,
                            updated_at: sharedDomain.metadata.updated_at,
                            type: "共享域名",
                            org_name: "-",
                        };
                        $scope.domainSharedList.push(sharedDomainObject);
                    });
                    $scope.domains = $scope.domainSharedList;

                });
            });


//get all orgs
    organizationService.getOrganizations().then(function(response) {
        var orgsdata = response.data;
        angular.forEach(orgsdata.resources, function (org, i) {
            var objectOrg = {
                guid:org.metadata.guid,
                id: org.metadata.guid,
                name: org.entity.name,
            };
            $scope.organizations.push(objectOrg);
        });
    });

        //get all apps
        $scope.getapp=function(){
            //set datas contains noting
            $scope.apps=[];
            applicationService.getApplications().then(function(response){
                var data = response.data;
                angular.forEach(data.resources, function (app, i) {
                    var objectApp = {
                        guid:app.metadata.guid,
                        id: app.metadata.guid,
                        name: app.entity.name,
                    };
                    $scope.apps.push(objectApp);
                });
            });
        }

        //get all app
        $scope.getapp();


    //get space by one org
    $scope.getAppsByOrgParams=function(selected_org){
        currOrg=selected_org;
        if (selected_org==null){
            return;
        }

        //reset var
        $scope.datas=[];
        $scope.spaces=[];
        organizationService.getSpacesForTheOrganization(selected_org.id).then(function(response){
            var spacedata = response.data;
            angular.forEach(spacedata.resources,function(_spacedata){
                var space={
                    id:_spacedata.metadata.guid,
                    name:_spacedata.entity.name,
                }
                $scope.spaces.push(space);

            });
        });


        //获取私有域
        $scope.domainPrivatedList = [];
        organizationService.getPrivateDomainsForTheOrganization(selected_org.id).then(function(response) {
            var data = response.data;
            angular.forEach(data.resources, function(sharedDomain, i){
                var sharedDomainObject = {
                    id: sharedDomain.metadata.guid,
                    name: sharedDomain.entity.name+"(私有域)",
                    created_at: sharedDomain.metadata.created_at,
                    updated_at: sharedDomain.metadata.updated_at,
                    type: "私有域名",
                };
                $scope.domainPrivatedList.push(sharedDomainObject);

            });
            $scope.domains = $scope.domainSharedList.concat($scope.domainPrivatedList);
        });


    };

    //表单提交
    $scope.ok = function () {
        $scope.route = {
            domainId:$scope.selected_domain.id,
            spaceId:$scope.selected_space.id,
            host:$scope.hostName
        }
        routeService.createRoute($scope.route).then(function(resp){
            var routeId = resp.data.metadata.guid;
            var appId = $scope.selected_app.id;
            notificationService.success('创建路由成功');
            routeService.associateRouteWithApp(routeId,appId).then(function(response){
                notificationService.success('路由绑定成功');

                $modalInstance.close(true);
            } , function (err, status) {
                $log.error(err);
                if (err.data.code)
                    notificationService.error('创建路由失败,原因是:\n' + err.data.description);
                    $modalInstance.close(false);
            })
        } , function (err, status) {
            $log.error(err);
            if (err.data.code)
                notificationService.error('路由绑定失败,原因是:\n' + err.data.description);
                $modalInstance.close(false);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


}]);
