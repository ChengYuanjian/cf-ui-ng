/**
 * Created by mas on 2016/7/22.
 */

app.controller('UserListCtl', function($scope,userService,dialogs,$confirm,organizationService,$log,spaceService,i18nService,notificationService) {

    $scope.create = function (size) {

        var dlg = dialogs.create('tpl/app_user_create.html', 'userCrudCtl', null, 'default');
        dlg.result.then(function () {
            $scope.refresh();
        });
    };

    var currOrg;
    var currSpa;
    $scope.users=[];
    //供后面按组织和空间条件筛选使用
    $scope.usersMap={};
    $scope.organizations = [];
    $scope.spaces=[];
    $scope.getAllUser=function(){
        $scope.users=[];
        $scope.usersMap={};
        userService.getAllUaaUsers1().then(function(resp){
            var _data=resp.data;
            angular.forEach(_data.resources, function (user, i) {
                var _email='';
                var _phone='';
                if (null!=user.emails){
                    _email=user.emails[0].value;
                }if(null!=user.phoneNumbers){
                    _phone=user.phoneNumbers[0].value;
                }
                var objUser={
                    'guid':user.id,
                    'name':user.userName,
                    'email':_email,
                    'phone':_phone,
                    'createtime':user.meta.created,
                    'updatetime':user.meta.lastModified
                };
                $scope.users.push(objUser);
                var key=user.id;
                $scope.usersMap[key]=user;
            });
            $scope.refresh1();
        });

        //userService.getUsers().then(function(resp){
        //    var _data=resp.data;
        //    angular.forEach(_data.resources, function (user, i) {
        //        var objUser={
        //          'guid':user.metadata.guid,
        //          'name':user.entity.username,
        //          'createtime':user.metadata.created_at,
        //          'updatetime':user.metadata.updated_at
        //        };
        //        $scope.users.push(objUser);
        //    });
        //    $scope.refresh1();
        //});
    };

    //get all orgs
    $scope.getAllOrgs=function(){
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

    $scope.getAllSpaByOrg=function(org){
        if(org==null){
            $scope.getAllUser();
            return;
        }
        currOrg=org;
        $scope.spaces=[];
        organizationService.getSpacesForTheOrganization(org.guid).then(function(response){
            var spacedata = response.data;
            angular.forEach(spacedata.resources,function(_spacedata){
                var space={
                    guid:_spacedata.metadata.guid,
                    name:_spacedata.entity.name
                };
                $scope.spaces.push(space);
                //$scope.getUsersBySpace(_spacedata.metadata.guid);
            });
            $scope.getUsersByOrg(org);
        });
    };

    $scope.getUsersBySpace=function(space){
        if(space==null){
            $scope.getUsersByOrg(currOrg);
            return;
        }
        currSpa=space;
        $scope.users=[];
        spaceService.retrieveRolesOfAllUsersForTheSpace(space.guid).then(function(resp){
            var userData=resp.data;
            angular.forEach(userData.resources,function(user){
                var key=user.metadata.guid;

                //for test
                //userService.getUaaUser(key).then(function(resp){
                //    var data =resp.data;
                //});

                var _email='';
                var _phone='';
                if ($scope.usersMap[key].emails){
                    _email=$scope.usersMap[key].emails[0].value;
                }if($scope.usersMap[key].phoneNumbers){
                    _phone=$scope.usersMap[key].phoneNumbers[0].value;
                }
                var userObj={
                    'guid':user.metadata.guid,
                    'name':user.entity.username,
                    'email':_email,
                    'phone':_phone,
                    'createtime':$scope.usersMap[key].meta.created,
                    'updatetime':$scope.usersMap[key].meta.lastModified
                };
                $scope.users.push(userObj);
            });
            $scope.refresh1();
        });
    };

    $scope.getUsersByOrg=function(org){
        if(org===null){
            $scope.getAllUser();
            return;
        };
        $scope.users=[];
        organizationService.getAllUsersForTheOrganization(org.guid).then(function(resp){
            var userData=resp.data;
            angular.forEach(userData.resources,function(user){
                var key=user.metadata.guid;
                var _email='';
                var _phone='';
                if ($scope.usersMap[key].emails){
                    _email=$scope.usersMap[key].emails[0].value;
                }if($scope.usersMap[key].phoneNumbers){
                    _phone=$scope.usersMap[key].phoneNumbers[0].value;
                }
                var userObj={
                    'guid':user.metadata.guid,
                    'name':user.entity.username,
                    'email':_email,
                    'phone':_phone,
                    'createtime':$scope.usersMap[key].meta.created,
                    'updatetime':$scope.usersMap[key].meta.lastModified
                };
                $scope.users.push(userObj);
                //取单个用户
                //userService.getUaaUser(user.metadata.guid).then(function(resp){
                //    var data =resp.data;
                //});
            });
            $scope.refresh1();
        });
    };

    $scope.getAllUser();
    $scope.getAllOrgs();

    //use ui-grid

    i18nService.setCurrentLang("zh-cn");

    $scope.gridOptions = {
        data: $scope.users,
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
        if (newVal === oldVal)
            return;
        $scope.gridOptions.data = $scope.users.filter(function (data) {
            if(data.name){
                if (data.name.toLowerCase().indexOf($scope.filter.filterText) > -1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        });

    }, true);

    var linkCellTemplate = '<div>' +
        '<a ui-sref="app.user_manage.detail({guid:row.entity.guid,username:row.entity.name, email:row.entity.email,' +
        'createtime:row.entity.createtime,updatetime:row.entity.updatetime,phone:row.entity.phone})">{{COL_FIELD}}</a>' +
        '</div>';

    //var linkCellTemplate = '<div>' +
    //    '<a ng-controller="userDoCtl" ng-click="update(row.entity)">{{COL_FIELD}}</a>' +
    //    '</div>';

    $scope.gridOptions.columnDefs = [
        {name: 'guid', displayName: 'ID', visible: false},
        {name: 'name', displayName: '用户名称', cellTemplate: linkCellTemplate},
        {name: 'email', displayName: '邮箱'},
        {name: 'phone', displayName: '手机'},
        {name: 'createtime', displayName: '创建时间'},
        {name: 'updatetime', displayName: '更新时间'}
    ];

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    };

    $scope.refresh = function () {
        $scope.getAllUser();
        $scope.gridOptions.data = $scope.users;
        $scope.gridApi.core.refresh();
    };

    $scope.refresh1= function () {
        $scope.gridOptions.data = $scope.users;
        $scope.gridApi.core.refresh();
    };

    $scope.delete=function(){
        if ($scope.gridApi.selection.getSelectedRows().length < 1)
            notificationService.info('请选择一条记录');
        else {
            $confirm({
                text: '请确认是否删除选择的' + $scope.gridApi.selection.getSelectedRows().length + '个用户',
                title: "确认删除",
                ok: "确认",
                cancel: '取消'
            }).then(function () {
                angular.forEach($scope.gridApi.selection.getSelectedRows(), function (user, i) {
                    userService.deleteUaaUser(user).then(function(){
                        userService.deleteUser1(user).then(function(){
                            notificationService.success('删除用户[' + user.name + ']成功');
                            if(i===$scope.gridApi.selection.getSelectedRows().length-1){
                                $scope.refresh();
                            }
                        },function (err, status) {
                            $log.error(err);
                            if (err.data.code)
                                notificationService.error('删除用户[' + user.name + ']失败,原因是:\n' + err.data.description);
                        });
                    });
                });

            });
        }
    };
});

app.controller('chgPasswordCtl', function($scope,userService,dialogs,$confirm,notificationService,$modalInstance) {
    $scope.username=localStorage.getItem('userName');
    $scope.guid=localStorage.getItem('userGuid');
    $scope.ok=function(){
        if($scope.newpasswordconfirm!=$scope.newpassword){
            notificationService.info("两次新密码输入不一致");
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
            $modalInstance.dismiss('cancel');
        },function(err){
            notificationService.error('修改密码失败,原因是:\n' + err.data.description);
            $modalInstance.dismiss('cancel');
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});