/**
 * Created by mas on 2016/8/19.
 */
app.controller('loadMenuCtl', function ($scope, $state,dialogs,$modal,notificationService) {
    //根据组织获取组织空间树
    $scope.getTreeDataByOrg = function (selected_org) {
        $scope.mydata = [];
        var userAuthInfo = JSON.parse(localStorage.getItem('userAuthInfo'));
        //var org = {
        //    uid: selected_org.orgGuid,
        //    label: selected_org.name
        //};
        //org.children = [];
        for (var spaid in userAuthInfo.data[selected_org.orgGuid]['org-spaces']) {
            var spa = {
                uid: spaid,
                label: userAuthInfo.data[selected_org.orgGuid]['org-spaces'][spaid]['spa-name'],
                parent_uid:selected_org.orgGuid
            };
            //org.children.push(spa);
            $scope.mydata.push(spa);
        }
        //$scope.mydata.push(org);
        $state.go('app.org_manage.detail', {"guid": selected_org.orgGuid, "name": selected_org.name});
    };

    //获取用户所在组织
    $scope.getUserOrgs = function () {
        $scope.organizations = [];
        var userAuthInfo = JSON.parse(localStorage.getItem('userAuthInfo'));
        for (var orgid in userAuthInfo.data) {
            var org = {
                orgGuid: orgid,
                name: userAuthInfo.data[orgid]['org-name'],
            };
            $scope.organizations.push(org);
        }
        ;
        if ($scope.organizations.length > 0) {
            $scope.selected_org = $scope.organizations[0];
            $scope.getTreeDataByOrg($scope.selected_org);
        }
    };

    $scope.getUserOrgs();


    //获取所有的组织空间树
    $scope.getTreeData = function () {
        $scope.mydata = [];
        var userAuthInfo = JSON.parse(localStorage.getItem('userAuthInfo'));
        for (var orgid in userAuthInfo.data) {
            var org = {
                uid: orgid,
                label: userAuthInfo.data[orgid]['org-name']
            };
            org.children = [];
            for (var spaid in userAuthInfo.data[orgid]['org-spaces']) {
                var spa = {
                    uid: spaid,
                    label: userAuthInfo.data[orgid]['org-spaces'][spaid]['spa-name']
                };
                org.children.push(spa);
            }
            $scope.mydata.push(org);
        }
    };

    //$scope.getTreeData();
    $scope.my_tree_handler = function (branch) {
        var userAuthInfo = JSON.parse(localStorage.getItem('userAuthInfo'));
        $state.go('app.space_manage.detail', {"guid": branch.uid, "spacename": branch.label,"orgGuid":branch.parent_uid});
        ////空间信息界面，参数在页面controller中通过$stateParams.param获取
        //if (!userAuthInfo.data[branch.uid]) {
        //    $state.go('app.space_manage.detail', {"guid": branch.uid, "spacename": branch.label,"orgGuid":branch.parent_uid});
        //}
        ////组织信息界面
        //else {
        //    $state.go('app.org_manage.detail', {"guid": branch.uid, "name": branch.label});
        //}
    };

    $scope.chgPassword = function () {
        var dlg = dialogs.create('tpl/app_user_password_change.html','chgPasswordCtl',null, 'default');
        dlg.result.then(function(){

        });
    };

    var hasPriv=false;
    $scope.create=function(){

        if(!hasPriv){
            notificationService.info('对不起，您没有创建组织的权限！');
            return;
        }

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
            {

            }
        });
    };
});

