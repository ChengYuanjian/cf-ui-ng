app.controller('OrganizationPreviewCtrl', ['$rootScope', '$scope', '$modal', '$log','$q', '$confirm', 'organizationService', 'i18nService', 'notificationService', 'uiGridConstants', function ($rootScope, $scope, $modal, $log,$q, $confirm, organizationService, i18nService, notificationService, uiGridConstants) {

    $scope.getOrganizations = function () {
        $scope.organizations = [];
        organizationService.getOrganizations().then(function (response) {
            var data = response.data;
            $scope.nrOfOrganizations = data.total_results;

            // create organization objects
            angular.forEach(data.resources, function (organization, i) {

                var objectOrganization = {
                    id: organization.metadata.guid,
                    quota_definition_guid: organization.entity.quota_definition_guid,
                    name: organization.entity.name,
                    status: organization.entity.status,
                    created_at: organization.metadata.created_at,
                    updated_at: organization.metadata.updated_at
                };
                $scope.organizations.push(objectOrganization);
            });
            $scope.gridOptions.data = $scope.organizations;
            // $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
            // $scope.$apply();
        }, function (err, status) {
            $log.error(err);
        });
    };
    $scope.getOrganizations();

    $scope.addOrganization = function () {
        var modalInstance = $modal.open({
            templateUrl: 'tpl/app_org_create.html',
            controller: 'OrganizationAddCtrl',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['js/controllers/organizationAddCtrl.js']);
                    }]
            }
        });

        modalInstance.result.then(function (result) {
            if (result)
                $scope.refresh();
        });
    };

    $scope.showOrg = function (orgId, event) {
        if (event.ctrlKey == 1) {
            window.open('#/organizations/' + orgId);
        } else {
            window.location = '#/organizations/' + orgId;
        }
    };

    $scope.deleteOrganization = function () {
        if ($scope.gridApi.selection.getSelectedRows().length < 1)
            notificationService.info('请选择一条记录');
        else {
            $confirm({
                text: '请确认是否删除选择的' + $scope.gridApi.selection.getSelectedRows().length + '个组织',
                title: "确认删除",
                ok: "确认",
                cancel: '取消'
            }).then(function () {
                var promises = [];
                angular.forEach($scope.gridApi.selection.getSelectedRows(), function (org, i) {
                    promises.push($scope.delete(org));
                });
                $q.all(promises).then(function () {
                    $scope.refresh();
                })
            });
        }
    };

    $scope.delete = function (org) {
        var defer = $q.defer();
        organizationService.deleteOrganization(org).then(function (response) {
            notificationService.success('删除组织[' + org.name + ']成功');
            organizationService.deleteQuota(org.quota_definition_guid);
            defer.resolve();
        }, function (err, status) {
            defer.reject();
            $log.error(err);
            if (err.data.code)
                notificationService.error('删除组织[' + org.name + ']失败,原因是:\n' + err.data.description);
        });
        return defer.promise;
    }

    i18nService.setCurrentLang("zh-cn");

    $scope.gridOptions = {
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
        $scope.gridOptions.data = $scope.organizations.filter(function (data) {
            if (data.name.toLowerCase().indexOf($scope.filter.filterText) > -1) {
                return true;
            }
            else {
                return false;
            }
        });

    }, true);

    var linkCellTemplate = '<div>' +
        '  <a ui-sref="app.org_manage.detail({guid:row.entity.id,name:row.entity.name})">{{COL_FIELD}}</a>' +
        '</div>';

    $scope.gridOptions.columnDefs = [
        {name: 'id', displayName: 'ID', visible: false},
        {name: 'name', displayName: '组织名称', cellTemplate: linkCellTemplate},
        {name: 'status', displayName: '组织状态'},
        {
            name: 'created_at', displayName: '创建时间', sort: {
            direction: uiGridConstants.DESC,
            priority: 1,
        },
        },
        {
            name: 'updated_at', displayName: '更新时间', sort: {
            direction: uiGridConstants.DESC,
            priority: 0,
        },
        }
    ];

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    }

    $scope.refresh = function () {
        $scope.getOrganizations();
    }

}
]);
