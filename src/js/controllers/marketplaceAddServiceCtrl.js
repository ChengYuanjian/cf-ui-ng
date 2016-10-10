app.controller('marketplaceAddServiceCtrl', ['$q', '$rootScope', '$scope', '$location', '$log', 'serviceService', 'serviceBindingService', 'organizationService', 'spaceService', 'serviceInstanceService', 'notificationService', function($q, $rootScope, $scope, $location, $log, serviceService, serviceBindingService, organizationService, spaceService, serviceInstanceService, notificationService) {

    $scope.organizationId = null;
    $scope.spaceId = null;
    $scope.applicationId = null;
    $scope.services = [];
    $scope.selectedService = null;
    $scope.organizations = [];
    $scope.spaces = [];
    $scope.applications = [];
    $scope.hideSelectService  = false;

    var getServicesPromise = null;

    if ($scope.organizationId){
        getServicesPromise = spaceService.getServicesForTheSpace($scope.spaceId);
    } else{
        getServicesPromise = serviceService.getServices();
    }

    getServicesPromise.then(function(response) {

        angular.forEach(response.data.resources, function(service, i) {
            var extraData = JSON.parse(service.entity.extra);

            var objectService = {
                id: service.metadata.guid,
                //cope with cases where extraData is Null and avoid premature exit
                name: (extraData && extraData.displayName) ? extraData.displayName : service.entity.label,
                description: service.entity.description,
                longDescription: (extraData && extraData.longDescription) ? extraData.longDescription : service.entity.long_description,
                provider: (extraData && extraData.providerDisplayName) ? extraData.providerDisplayName : service.entity.provider,
                imageUrl: (extraData && extraData.imageUrl) ? extraData.imageUrl : null,
                documentationUrl: (extraData && extraData.documentationUrl) ? extraData.documentationUrl : service.entity.documentation_url,
                supportUrl: (extraData && extraData.supportUrl) ? extraData.supportUrl : null
            };

            $scope.services.push(objectService);
        });

    }, function(err) {
        $log.error(err);
        if (err.data.code)
            notificationService.error('获取服务信息失败:' + err.data.description);
    });

}]);