app.controller('DomainListCtrl', [ '$rootScope', '$scope','$modal','$confirm','organizationService', 'messageService','$log','i18nService','notificationService','domainService','uiGridConstants',
  function($rootScope, $scope, $modal,$confirm,organizationService, messageService, $log,i18nService,notificationService,domainService,uiGridConstants) {
    $scope.organizations = [];
    $scope.domains = [];

    //create router page
    $scope.create = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/app_domain_create.html',
        controller: 'DomainCreateCtrl',
        resolve: {
          deps: ['$ocLazyLoad',
            function ($ocLazyLoad) {
              return $ocLazyLoad.load(['js/controllers/domainCreateCtrl.js']);
            }]
        }
      });

      modalInstance.result.then(function () {
        $scope.refresh();
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


    $scope.getDomains = function() {
      $scope.domains = [];
      organizationService.getOrganizations().then(function(response) {
      $scope.organizations = [];
        var data = response.data;

        organizationService.getSharedDomainsForTheOrganization().then(function(response) {
          var data = response.data;
          angular.forEach(data.resources, function(sharedDomain, i){
            var sharedDomainObject = {
              guid:sharedDomain.metadata.guid,
              id: sharedDomain.metadata.guid,
              name: sharedDomain.entity.name,
              created_at: sharedDomain.metadata.created_at,
              updated_at: sharedDomain.metadata.updated_at,
              type: "共享域名",
              org_name: "-",
            };
            $scope.domains.push(sharedDomainObject);
          });
          $scope.refresh1();
        }, function(err) {
          $log.error(err.data.description);
        });

        angular.forEach(data.resources, function(organization, i) {

          var objectOrganization = {
            id: organization.metadata.guid,
            name: organization.entity.name,
          };
          $scope.organizations.push(objectOrganization);

          organizationService.getPrivateDomainsForTheOrganization(organization.metadata.guid).then(function(response) {
            var data = response.data;
            angular.forEach(data.resources, function(sharedDomain, i){
              var sharedDomainObject = {
                guid:sharedDomain.metadata.guid,
                id: sharedDomain.metadata.guid,
                name: sharedDomain.entity.name,
                created_at: sharedDomain.metadata.created_at,
                updated_at: sharedDomain.metadata.updated_at,
                type: "私有域名",
                org_name: organization.entity.name,
              };
              $scope.domains.push(sharedDomainObject);
            });
            $scope.refresh1();
          }, function(err) {
            $log.error(err.data.description);
          }
          );

        });

      }, function (err) {
        messageService.addMessage('danger', 'The organizations have not been loaded.', true);
        $log.error(err);
      });
    };
    $scope.getDomains();

    $scope.getDomainsByOrg = function(selected_org) {
      $scope.domains = [];
      organizationService.getPrivateDomainsForTheOrganization(selected_org.id).then(function(response) {
        var data = response.data;
        angular.forEach(data.resources, function(sharedDomain, i){
          var sharedDomainObject = {
            guid:sharedDomain.metadata.guid,
            id: sharedDomain.metadata.guid,
            name: sharedDomain.entity.name,
            created_at: sharedDomain.metadata.created_at,
            updated_at: sharedDomain.metadata.updated_at,
            type: "私有域名",
            org_name: selected_org.name,
          };
          $scope.domains.push(sharedDomainObject);
        });
        $scope.refresh1();
      }, function(err) {
        $log.error(err.data.description);
      });
    };

    $scope.getDomainsByParams = function(selected_org) {
      if ( selected_org == null) {
        $scope.getDomains();
      } else {
        $scope.getDomainsByOrg(selected_org);
      }
    };


    //删除路由
    $scope.deleteDomains = function () {

      if ($scope.gridApi.selection.getSelectedRows().length < 1)
        notificationService.info('请选择一条记录');
      else {
        $confirm({
          text: '请确认是否删除选择的' + $scope.gridApi.selection.getSelectedRows().length + '个路由',
          title: "确认删除",
          ok: "确认",
          cancel: '取消'
        }).then(function () {
          angular.forEach($scope.gridApi.selection.getSelectedRows(), function (domain, i) {
            if(domain.type=="私有域名"){
              domainService.deletePrivateDomain(domain.guid).then(function (response) {
                notificationService.success('删除路由[' + domain.name + ']成功');
                /*$scope.gridApi.selection.clearSelectedRows();
                $scope.refresh();*/
              }, function (err, status) {
                $log.error(err);
                if (err.data.code)
                  notificationService.error('删除组织[' + domain.name + ']失败,原因是:\n' + err.data.description);
              });
            }else if(domain.type == "共享域名"){
              domainService.deleteSharedDomain(domain.guid).then(function (response) {
                notificationService.success('删除路由[' + domain.name + ']成功');
                /*$scope.gridApi.selection.clearSelectedRows();
                $scope.refresh();*/
              }, function (err, status) {
                $log.error(err);
                if (err.data.code)
                  notificationService.error('删除组织[' + domain.name + ']失败,原因是:\n' + err.data.description);
              });
            }

          });
          $scope.gridApi.selection.clearSelectedRows();
          $scope.refresh();
        });

      }

    };
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    i18nService.setCurrentLang("zh-cn");

    $scope.gridOptions = {
      data: $scope.domains,
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
      $scope.gridOptions.data = $scope.domains.filter(function (data) {
        if (data.name.toLowerCase().indexOf($scope.filter.filterText) > -1) {
          return true;
        }
        else {
          return false;
        }
      });

    }, true);

     var linkCellTemplate = '<div>' +
        '  <a ui-sref="app.domain_manage.detail({guid:domain.entity.id,name:domain.entity.name})">{{COL_FIELD}}</a>' +
        '</div>';

    $scope.gridOptions.columnDefs = [
      {name: 'id', displayName: 'ID', visible: false},
      {name: 'name', displayName: '域名名称'},
      {name: 'type', displayName: '域名类型'},
      {name: 'org_name', displayName: '组织'},
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
    $scope.refresh1 = function () {
      $scope.gridOptions.data = $scope.domains;
     /* $scope.gridApi.core.refresh();*/
    }
    $scope.refresh = function () {
      $scope.getDomains();
      $scope.gridOptions.data = $scope.domains;
      $scope.gridApi.core.refresh();
    }


    /*$scope.getDomains();*/
  }]);
