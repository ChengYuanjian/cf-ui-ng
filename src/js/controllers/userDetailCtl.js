/**
 * Created by mas on 2016/7/28.
 */

var flag="create";
var flagspa="create";

app.controller('UserShowName', [ '$rootScope', '$scope','$stateParams','$log',
    function($rootScope, $scope,$stateParams,$log) {
        $scope.username =$stateParams.username;

    }]);

app.controller('eventCtl', function($scope) {
    $scope.$on("UserOrgAddEvent",
        function (event, msg) {
            $scope.$broadcast("UserOrgAddEventFromParent", msg);
        });
    $scope.$on("UserSpaAddEvent",
        function (event, msg) {
            $scope.$broadcast("UserSpaAddEventFromParent", msg);
        });
});

app.controller('UserBaseInfoCtl', function($scope,userService,$stateParams,notificationService,organizationService,i18nService) {
    $scope.guid=$stateParams.guid;
    $scope.username=$stateParams.username;
    $scope.createtime=$stateParams.createtime;
    $scope.updatetime=$stateParams.updatetime;
    $scope.email=$stateParams.email;
    $scope.phone=$stateParams.phone;

    $scope.updateUser=function(){
        var user={
            guid:$scope.guid,
            username:$scope.username,
            email:$scope.email,
            phone:$scope.phone
        };
        userService.updateUaaUser(user).then(function(resp){
            notificationService.success("用户更新成功！");
        },function(err){
            notificationService.error('用户更新失败,原因是:\n' + err.data.description);
        });
    };

    $scope.reset=function(){
        $scope.username='';
        $scope.email='';
        $scope.phone='';
    };
});

app.controller('UserOrgInfoCtl', function($log,$scope,dialogs,userService,$stateParams,$confirm,notificationService,organizationService,$stateParams,i18nService,$modal) {

    $scope.$on("UserOrgAddEventFromParent",
        function (event, msg) {
            $scope.refreshOrgInfo();
        });

    $scope.create=function(){
        flag='create';

        var dlg = dialogs.create('tpl/app_user_org_create.html','userOrgCrudCtl',null, 'default');
        dlg.result.then(function(){
            $scope.refreshOrgInfo();
        });
        //var modalInstance = $modal.open({
        //    templateUrl: 'tpl/app_user_org_create.html',
        //    controller:'userOrgCrudCtl'
        //});
        //
        //modalInstance.result.then(function (selectedItem) {
        //    $scope.refreshOrgInfo();
        //}, function () {
        //    $log.info('Modal dismissed at: ' + new Date());
        //});
    };

    var currUserOrg;
    $scope.update=function(userinfo){
        currUserOrg=userinfo;
        flag='update';
        var modalInstance = $modal.open({
            templateUrl: 'tpl/app_user_org_create.html'
        });

        modalInstance.result.then(function (selectedItem) {

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.orgs=[];
    $scope.getUserOrgInfo=function(){
        $scope.orgs=[];
        userService.getUserSummary($stateParams.guid).then(function(resp){
            var userinfo=resp.data;
            angular.forEach(userinfo.entity.organizations,function(org){
                var orgObj={
                    'guid':org.metadata.guid,
                    'username':$stateParams.username,
                    'orgName':org.entity.name,
                    'orgRole':'普通用户',
                    'createtime':org.metadata.created_at,
                    'updatetime':org.metadata.updated_at
                };
                $scope.orgs.push(orgObj);
            });
            angular.forEach(userinfo.entity.managed_organizations,function(org){
                var orgObj={
                    'guid':org.metadata.guid,
                    'username':$stateParams.username,
                    'orgName':org.entity.name,
                    'orgRole':'管理者',
                    'createtime':org.metadata.created_at,
                    'updatetime':org.metadata.updated_at
                };
                $scope.orgs.push(orgObj);
            });
            angular.forEach(userinfo.entity.billing_managed_organizations,function(org){
                var orgObj={
                    'guid':org.metadata.guid,
                    'username':$stateParams.username,
                    'orgName':org.entity.name,
                    'orgRole':'计费者',
                    'createtime':org.metadata.created_at,
                    'updatetime':org.metadata.updated_at
                };
                $scope.orgs.push(orgObj);
            });
            angular.forEach(userinfo.entity.audited_organizations,function(org){
                var orgObj={
                    'guid':org.metadata.guid,
                    'username':$stateParams.username,
                    'orgName':org.entity.name,
                    'orgRole':'审计者',
                    'createtime':org.metadata.created_at,
                    'updatetime':org.metadata.updated_at
                };
                $scope.orgs.push(orgObj);
            });

            $scope.refresh();
        });
    };

    $scope.delete=function(){
        if ($scope.gridApi.selection.getSelectedRows().length < 1)
            notificationService.info('请选择一条记录');
        else {
            $confirm({
                text: '请确认是否删除选择的' + $scope.gridApi.selection.getSelectedRows().length + '个用户组织关系',
                title: "确认删除",
                ok: "确认",
                cancel: '取消'
            }).then(function () {
                angular.forEach($scope.gridApi.selection.getSelectedRows(), function (user, i) {
                    var _user={
                        organizationId:user.guid,
                        id:$stateParams.guid
                    }
                    if(user.orgRole==="管理者"){
                        organizationService.disassociateManagerWithOrganization(_user).then(function(){
                            notificationService.success('删除用户组织关系[' + user.orgRole + ']成功');
                            //最后刷新，避免重复
                            if(i===$scope.gridApi.selection.getSelectedRows().length-1){
                                $scope.refreshOrgInfo();
                            }
                        },function (err, status) {
                            $log.error(err);
                            if (err.data.code)
                                notificationService.error('删除用户组织关系[' + user.orgRole + ']失败,原因是:\n' + err.data.description);
                        });

                    }else if(user.orgRole==="审计者"){
                        organizationService.disassociateAuditorWithOrganization(_user).then(function(){
                            notificationService.success('删除用户组织关系[' + user.orgRole + ']成功');
                            //最后刷新，避免重复
                            if(i===$scope.gridApi.selection.getSelectedRows().length-1){
                                $scope.refreshOrgInfo();
                            }
                        },function (err, status) {
                            $log.error(err);
                            if (err.data.code)
                                notificationService.error('删除用户组织关系[' + user.orgRole + ']失败,原因是:\n' + err.data.description);
                        });

                    }else if(user.orgRole==="计费者"){
                        organizationService.disassociateBillingManagerWithOrganization(_user).then(function(){
                            notificationService.success('删除用户组织关系[' + user.orgRole + ']成功');
                            //最后刷新，避免重复
                            if(i===$scope.gridApi.selection.getSelectedRows().length-1){
                                $scope.refreshOrgInfo();
                            }
                        },function (err, status) {
                            $log.error(err);
                            if (err.data.code)
                                notificationService.error('删除用户组织关系[' + user.orgRole + ']失败,原因是:\n' + err.data.description);
                        });
                    }else if(user.orgRole==="普通用户"){
                        organizationService.disassociateUserWithOrganization(_user).then(function(){
                            notificationService.success('删除用户组织关系[' + user.orgRole + ']成功');
                            //最后刷新，避免重复
                            if(i===$scope.gridApi.selection.getSelectedRows().length-1){
                                $scope.refreshOrgInfo();
                            }
                        },function (err, status) {
                            $log.error(err);
                            if (err.data.code)
                                notificationService.error('删除用户组织关系[' + user.orgRole + ']失败,原因是:\n' + err.data.description);
                        });
                    }

                    //organizationService.disassociateUserWithOrganization(_user).then(function(){
                    //    notificationService.success('删除用户组织关系[' + user.orgRole + ']成功');
                    //    $scope.refreshOrgInfo();
                    //},function (err, status) {
                    //    $log.error(err);
                    //    if (err.data.code)
                    //        notificationService.error('删除用户组织关系[' + user.orgRole + ']失败,原因是:\n' + err.data.description);
                    //});

                });
            });
        }
    };

    //use ui-grid  add by mas 20160727
    i18nService.setCurrentLang("zh-cn");

    $scope.orgGridOptions = {
        data: $scope.orgs,
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

    $scope.$watch('filter.filterOrg', function (newVal, oldVal) {
        if (newVal == oldVal)
            return;
        $scope.orgGridOptions.data = $scope.orgs.filter(function (data) {
            if(data.orgName){
            if (data.orgName.toLowerCase().indexOf($scope.filter.filterOrg) > -1) {
                return true;
            }
            else {
                return false;
            }}
        });

    }, true);


    var linkCellTemplate = '<div>' +
        '<a ng-controller="UserOrgInfoCtl" ng-click="update(row.entity)">{{COL_FIELD}}</a>' +
        '</div>';

    $scope.orgGridOptions.columnDefs = [
        {name: 'guid', displayName: 'ID', visible: false},
        {name: 'username', displayName: '用户名'},//cellTemplate: linkCellTemplate},
        {name: 'orgName', displayName: '组织名称'},
        {name: 'orgRole', displayName: '用户组织角色'},
        {name: 'createtime', displayName: '创建时间'},
        {name: 'updatetime', displayName: '更新时间'}
    ];

    $scope.orgGridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    };

    $scope.refresh = function () {
        $scope.orgGridOptions.data = $scope.orgs;
        $scope.gridApi.core.refresh();
    };

    $scope.refreshOrgInfo=function(){
        $scope.getUserOrgInfo();
        $scope.orgGridOptions.data = $scope.orgs;
    };

    $scope.refreshOrgInfo();

});

app.controller('UserSpaceInfoCtl', function($scope,$log,$modal,$confirm,dialogs,userService,organizationService,spaceService,notificationService,$stateParams,i18nService) {

    $scope.create=function(){
        flagspa='create';

        var dlg = dialogs.create('tpl/app_user_space_create.html','userSpaCrudCtl',null, 'default');
        dlg.result.then(function(){
            $scope.refreshSpaceInfo();
        });

        //var modalInstance = $modal.open({
        //    templateUrl: 'tpl/app_user_space_create.html'
        //});
        //
        //modalInstance.result.then(function (selectedItem) {
        //    $scope.refreshSpaceInfo();
        //}, function () {
        //    $log.info('Modal dismissed at: ' + new Date());
        //});
    };

    $scope.spaces=[];
    $scope.getUserSpaceInfo=function(){
        $scope.spaces=[];
        userService.getUserSummary($stateParams.guid).then(function(resp){
            var userinfo=resp.data;
            angular.forEach(userinfo.entity.managed_spaces,function(space){
                spaceService.getSpace(space.metadata.guid).then(function(resp1){
                    var spaceinfo=resp1.data;
                    var spaceOrgGuid=spaceinfo.entity.organization_guid;
                    organizationService.getOrganization(spaceOrgGuid).then(function(resp2){
                        var spaceObj={
                            'guid':space.metadata.guid,
                            'username':$stateParams.username,
                            'orgName':resp2.data.entity.name,
                            'spaceName':space.entity.name,
                            'spaceRole':'管理者',
                            'createtime':space.metadata.created_at,
                            'updatetime':space.metadata.updated_at
                        };
                        $scope.spaces.push(spaceObj);
                    });
                });
            });

            angular.forEach(userinfo.entity.audited_spaces,function(space){
                spaceService.getSpace(space.metadata.guid).then(function(resp1){
                    var spaceinfo=resp1.data;
                    var spaceOrgGuid=spaceinfo.entity.organization_guid;
                    organizationService.getOrganization(spaceOrgGuid).then(function(resp2){
                        var spaceObj={
                            'guid':space.metadata.guid,
                            'username':$stateParams.username,
                            'orgName':resp2.data.entity.name,
                            'spaceName':space.entity.name,
                            'spaceRole':'审计者',
                            'createtime':space.metadata.created_at,
                            'updatetime':space.metadata.updated_at
                        };
                        $scope.spaces.push(spaceObj);
                    });
                });
            });
            angular.forEach(userinfo.entity.spaces,function(space){
                spaceService.getSpace(space.metadata.guid).then(function(resp1){
                    var spaceinfo=resp1.data;
                    var spaceOrgGuid=spaceinfo.entity.organization_guid;
                    organizationService.getOrganization(spaceOrgGuid).then(function(resp2){
                        var spaceObj={
                            'guid':space.metadata.guid,
                            'username':$stateParams.username,
                            'orgName':resp2.data.entity.name,
                            'spaceName':space.entity.name,
                            'spaceRole':'开发者',
                            'createtime':space.metadata.created_at,
                            'updatetime':space.metadata.updated_at
                        };
                        $scope.spaces.push(spaceObj);
                    });
                });
            });

            $scope.refresh();
        });
    };

    $scope.delete=function(){
        if ($scope.gridApi.selection.getSelectedRows().length < 1)
            notificationService.info('请选择一条记录');
        else {
            $confirm({
                text: '请确认是否删除选择的' + $scope.gridApi.selection.getSelectedRows().length + '个用户空间关系',
                title: "确认删除",
                ok: "确认",
                cancel: '取消'
            }).then(function () {
                angular.forEach($scope.gridApi.selection.getSelectedRows(), function (user, i) {
                    var _user={
                        spaceId:user.guid,
                        id:$stateParams.guid
                    };
                    if(user.spaceRole==="管理者"){
                        spaceService.disassociateManagerWithSpace(_user).then(function(){
                            notificationService.success('删除用户空间关系[' + user.spaceRole + ']成功');
                            //最后刷新，避免重复
                            if(i===$scope.gridApi.selection.getSelectedRows().length-1){
                                $scope.refreshSpaceInfo();
                            }
                        },function (err, status) {
                            $log.error(err);
                            if (err.data.code)
                                notificationService.error('删除用户空间关系[' + user.spaceRole + ']失败,原因是:\n' + err.data.description);
                        });
                    } else if(user.spaceRole==="审计者"){
                        spaceService.disassociateAuditorWithSpace(_user).then(function(){
                            notificationService.success('删除用户空间关系[' + user.spaceRole + ']成功');
                            //最后刷新，避免重复
                            if(i===$scope.gridApi.selection.getSelectedRows().length-1){
                                $scope.refreshSpaceInfo();
                            }
                        },function (err, status) {
                            $log.error(err);
                            if (err.data.code)
                                notificationService.error('删除用户空间关系[' + user.spaceRole + ']失败,原因是:\n' + err.data.description);
                        });
                    }else if(user.spaceRole==="开发者"){
                        spaceService.disassociateDeveloperWithSpace(_user).then(function(){
                            notificationService.success('删除用户空间关系[' + user.spaceRole + ']成功');
                            //最后刷新，避免重复
                            if(i===$scope.gridApi.selection.getSelectedRows().length-1){
                                $scope.refreshSpaceInfo();
                            }
                        },function (err, status) {
                            $log.error(err);
                            if (err.data.code)
                                notificationService.error('删除用户空间关系[' + user.spaceRole + ']失败,原因是:\n' + err.data.description);
                        });
                    }
                });
            });
        }
    };

    //use ui-grid  add by mas 20160727
    i18nService.setCurrentLang("zh-cn");

    $scope.spaceGridOptions = {
        data: $scope.spaces,
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

    $scope.$watch('filter.filterSpace', function (newVal, oldVal) {
        if (newVal == oldVal)
            return;
        $scope.spaceGridOptions.data = $scope.spaces.filter(function (data) {
            if(data.spaceName){
            if (data.spaceName.toLowerCase().indexOf($scope.filter.filterSpace) > -1) {
                return true;
            }
            else {
                return false;
            }}
        });

    }, true);

    $scope.spaceGridOptions.columnDefs = [
        {name: 'guid', displayName: 'ID', visible: false},
        {name: 'username', displayName: '用户名'},
        {name: 'orgName', displayName: '空间所在组织'},
        {name: 'spaceName', displayName: '空间名称'},
        {name: 'spaceRole', displayName: '用户空间角色'},
        {name: 'createtime', displayName: '创建时间'},
        {name: 'updatetime', displayName: '更新时间'}
    ];

    $scope.spaceGridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    };

    $scope.refresh = function () {
        $scope.spaceGridOptions.data = $scope.spaces;
        $scope.gridApi.core.refresh();
    };

    $scope.refreshSpaceInfo=function(){
        $scope.getUserSpaceInfo();
        $scope.spaceGridOptions.data = $scope.spaces;
    };

    $scope.refreshSpaceInfo();

});


app.controller('userSpaCrudCtl', function($scope,userService,organizationService,$modalInstance,spaceService,notificationService,$stateParams,i18nService) {
    //主页面传递过来的，在userDetailCtl.JS下面的多个controller均可以使用
    $scope.guid=$stateParams.guid;
    $scope.username=$stateParams.username;
    $scope.organizations=[];
    $scope.orgSpaces=[];
    //get all orgs
    $scope.getAllOrgs=function(){
        $scope.organizations=[];
        organizationService.getOrganizations().then(function(response) {
            var orgsdata = response.data;
            angular.forEach(orgsdata.resources, function (org, i) {
                var objectOrg = {
                    guid:org.metadata.guid,
                    name: org.entity.name
                };
                $scope.organizations.push(objectOrg);
            });
        });
    };

    $scope.getAllOrgs();
    //get spaces by org
    $scope.getSpaceByOrg=function(org){
        $scope.orgSpaces=[];
        organizationService.getSpacesForTheOrganization(org.guid,true).then(function(response){
            var spacedata = response.data;
            angular.forEach(spacedata.resources,function(_spacedata){
                var space={
                    guid:_spacedata.metadata.guid,
                    name:_spacedata.entity.name
                };
                $scope.orgSpaces.push(space);
            });
        });
    };

    $scope.addUserSpa=function(){
        var user={
            guid:$scope.guid,
            userName:$scope.username,
            spaGuid:$scope.selected_spa.guid
        };

        var spaRole=$scope.spa_role;

        if(spaRole==='1'){
            userService.associateManagedSpaWithUser(user).then(function(resp){
                $scope.hint_create_user_spa_role_success();
                $modalInstance.close();
            },function(err){
                $scope.hint_create_user_spa_role_error();
            });
        }else if(spaRole==='2'){
            userService.associateAuditedSpaWithUser(user).then(function(resp){
                $scope.hint_create_user_spa_role_success();
                $modalInstance.close();
            },function(err){
                $scope.hint_create_user_spa_role_error();
            });
        }else if(spaRole==='3') {
            userService.associateDeveloperSpaWithUser2(user).then(function (resp) {
                $scope.hint_create_user_spa_role_success();
                $modalInstance.close();
            }, function (err) {
                $scope.hint_create_user_spa_role_error();
            });
        }
    };

    $scope.ok=function(){
        if(flag==="create"){
            $scope.addUserSpa();
        }else if (flag==="update"){
            //先删除，再新建
        }
    };

    $scope.cancel=function(){
        $modalInstance.dismiss('cancel');
    };

    $scope.hint_update_user_success=function(){
        notificationService.success("用户更新成功");
    };

    $scope.hint_update_user_error=function(){
        notificationService.error("用户更新失败");
    };

    $scope.hint_create_user_org_role_success=function(){
        notificationService.success("用户组织角色创建成功");
    };

    $scope.hint_create_user_org_role_error=function(){
        notificationService.error("用户组织角色创建失败");
    };

    $scope.hint_create_user_spa_role_success=function(){
        notificationService.success("用户空间角色创建成功");
    };

    $scope.hint_create_user_spa_role_error=function(){
        notificationService.error("用户空间角色创建失败");
    };

    $scope.hint_create_user_success=function(){
        notificationService.success("用户创建成功");
    };

    $scope.hint_create_user_error=function(){
        notificationService.error("用户创建失败,回滚成功");
    };

});


app.controller('userOrgCrudCtl', function($scope,userService,organizationService,$modalInstance,notificationService,$stateParams,i18nService) {
    //主页面传递过来的，在userDetailCtl.JS下面的多个controller均可以使用
    $scope.guid=$stateParams.guid;
    $scope.username=$stateParams.username;
    $scope.organizations = [];
    //get all orgs
    $scope.getAllOrgs=function(){
        $scope.organizations = [];
        organizationService.getOrganizations().then(function(response) {
            var orgsdata = response.data;
            angular.forEach(orgsdata.resources, function (org, i) {
                var objectOrg = {
                    guid:org.metadata.guid,
                    name: org.entity.name
                };
                $scope.organizations.push(objectOrg);
            });
        });
    };

    $scope.getAllOrgs();

    $scope.addUserOrg=function(){
        var user={
            guid:$scope.guid,
            userName:$scope.username,
            orgGuid:$scope.selected_org.guid,
            name:$scope.username, //给associateUserWithOrganization使用
            organizationId:$scope.selected_org.guid,//给associateUserWithOrganization使用
        };
        if($scope.org_role==='1'){
            userService.associateManagedOrgWithUser1(user).then(function(resp){
                $scope.hint_create_user_org_role_success();
                $modalInstance.close();
            },function(err){
                $scope.hint_create_user_org_role_error();
            });
        }else if($scope.org_role==='2'){
            userService.associateAuditedOrgWithUser1(user).then(function(resp){
                $scope.hint_create_user_org_role_success();
                $modalInstance.close();
            },function(err){
                $scope.hint_create_user_org_role_error();
            });
        }else if($scope.org_role==='3'){
            userService.associateBillingManagerWithUser(user).then(function(resp){
                $scope.hint_create_user_org_role_success();
                $modalInstance.close();
            },function(err){
                $scope.hint_create_user_org_role_error();
            });
        }else if($scope.org_role==='4'){
            organizationService.associateUserWithOrganization(user).then(function(resp){
                $scope.hint_create_user_org_role_success();
                $modalInstance.close();
            },function(err){
                $scope.deleteUser(user);
            });
        };
        $scope.$emit("UserOrgAddEvent");
    };

    $scope.deleteUserOrg=function(){
        var userGuid=$stateParams.guid;
        var orgGuid=currUserOrg.guid;
        var user={
            organizationId:orgGuid,
            id:userGuid
        }
        organizationService.disassociateUserWithOrganization(user).then(function(){

        });
        //userService.removeManagedOrgWithUser(userGuid,orgGuid).then(function(){
        //    //先删除，再新建
        //});
    };

    $scope.ok=function(){
        if(flag==="create"){
           $scope.addUserOrg();
        }else if (flag==="update"){
            //先删除，再新建
        }
    };

    $scope.cancel=function(){
        $modalInstance.dismiss('cancel');
    };

    $scope.hint_update_user_success=function(){
        notificationService.success("用户更新成功");
    };

    $scope.hint_update_user_error=function(){
        notificationService.error("用户更新失败");
    };

    $scope.hint_create_user_org_role_success=function(){
        notificationService.success("用户组织角色创建成功");
    };

    $scope.hint_create_user_org_role_error=function(){
        notificationService.error("用户组织角色创建失败");
    };

    $scope.hint_create_user_spa_role_success=function(){
        notificationService.success("用户空间角色创建成功");
    };

    $scope.hint_create_user_spa_role_error=function(){
        notificationService.error("用户空间角色创建失败");
    };

    $scope.hint_create_user_success=function(){
        notificationService.success("用户创建成功");
    };

    $scope.hint_create_user_error=function(){
        notificationService.error("用户创建失败,回滚成功");
    };

});

app.controller('pageCtl', function($scope,userService,organizationService,$stateParams,i18nService) {
    if(flag==="create"){
        $scope.titleName='创建用户组织关系';
        $scope.doName='创建';
    }else if(flag==="update"){
        $scope.titleName='更新用户组织关系';
        $scope.doName='更新';
    }
});

app.controller('pageSpaCtl', function($scope,userService,organizationService,$stateParams,i18nService) {
    if(flagspa==="create"){
        $scope.titleName='创建用户空间关系';
        $scope.doName='创建';
    }else if(flagspa==="update"){
        $scope.titleName='更新用户空间关系';
        $scope.doName='更新';
    }
});

app.controller('UserPaaswordChangeCtl', function($scope,userService,$stateParams,i18nService,notificationService) {
    $scope.guid=$stateParams.guid;
    $scope.username=$stateParams.username;
    $scope.updateUserPassword=function(){
        if($scope.newpasswordconfirm!=$scope.newpassword){
            notificationService.info("密码不一致");
            return;
        }
        var user={
            guid:$scope.guid,
            password:$scope.newpassword, //changeUserPassword1使用
            oldPassword:$scope.oldpassword,
            newPassword:$scope.newpassword
        };
        userService.changeUserPassword(user).then(function(resp){
            var data =resp.data;
            notificationService.success("修改密码成功！");
        },function(err){
            notificationService.error('修改密码失败,原因是:\n' + err.data.description);
        });

    };

    $scope.reset=function(){
        $scope.oldpassword='';
        $scope.newpassword='';
        $scope.newpasswordconfirm='';
    };

});
