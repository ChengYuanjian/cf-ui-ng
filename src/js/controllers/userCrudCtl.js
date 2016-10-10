/**
 * Created by mas on 2016/7/26.
 */
var flag;
var currUser;
app.controller('userCrudCtl', function($scope,usSpinnerService,organizationService,$stateParams,userService,notificationService,$modalInstance) {

    if(null !=$stateParams.guid){
        notificationService.success("not null");
    };

    //define var
    var currOrg;
    var currSpa;
    $scope.organizations = [];
    $scope.spaces=[];
    //get all orgs
    organizationService.getOrganizations().then(function(response) {
        // reset
        $scope.organizations = [];
        var orgsdata = response.data;
        angular.forEach(orgsdata.resources, function (org, i) {
            var objectOrg = {
                guid:org.metadata.guid,
                name: org.entity.name,
            };
            $scope.organizations.push(objectOrg);
        });
    });

    $scope.getCurrSpa=function(spa){
        currSpa=spa;
    };
    $scope.getSpacesByOrg=function(org){
        currOrg=org;
        // reset
        $scope.spaces=[];
        organizationService.getSpacesForTheOrganization(org.guid).then(function(response){
            var spacedata = response.data;
            angular.forEach(spacedata.resources,function(_spacedata){
                var space={
                    guid:_spacedata.metadata.guid,
                    name:_spacedata.entity.name,
                }
                $scope.spaces.push(space);
            });
        });
    };

    $scope.deleteUser=function(user){
        // delete cf user
        userService.deleteUser1(user).then(function(){
            //delete uaa user
            userService.deleteUaaUser(user);
        });
        //do someting or hint
        $scope.hint_create_user_error();
        return;
    };

    if(flag==='update'){
        $scope.username=currUser.name;
        $scope.email=currUser.email;
        //$scope.selected_org.name=currUser.org;  //error
    }

    //用户更新
    $scope.updateUser=function(){
        var uaaUser={
            //guid need to be add in list page
            guid:currUser.guid,
            username:$scope.username,
            password:$scope.password,
            email:$scope.email
        };
        var orgRole=$scope.org_role;
        var spaRole=$scope.spa_role;
        userService.updateUaaUser(uaaUser).then(function(resp){
            var userGuid=resp.data.id;
            var user={
                guid:userGuid,
                userName:resp.data.userName,
                orgGuid:currOrg.guid,
                organizationId:currOrg.guid,
                spaGuid:currSpa.guid
            };
            if(orgRole==='1'){
                userService.associateManagedOrgWithUser1(user).then(function(resp){

                },function(err){
                    $scope.hint_update_user_error();
                });
            }else if(orgRole==='2'){
                userService.associateAuditedOrgWithUser1(user).then(function(resp){

                },function(err){
                    $scope.hint_update_user_error();
                });
            }else if(orgRole==='3'){
                userService.associateBillingManagerWithUser(user).then(function(resp){

                },function(err){
                    $scope.hint_update_user_error();
                });
            }else if(orgRole==='4'){
                organizationService.associateUserWithOrganization(user).then(function(resp){

                },function(err){
                    $scope.hint_update_user_error();
                });
            };
            if(spaRole==='1'){
                userService.associateManagedSpaWithUser(user).then(function(resp){
                    $scope.hint_update_user_success();
                },function(err){
                    $scope.hint_update_user_error();
                });
            }else if(spaRole==='2'){
                userService.associateAuditedSpaWithUser(user).then(function(resp){
                    $scope.hint_update_user_success();
                },function(err){
                    $scope.hint_update_user_error();
                });
            }else if(spaRole==='3'){
                userService.associateDeveloperSpaWithUser(user).then(function(resp){
                    $scope.hint_update_user_success();
                },function(err){
                    $scope.hint_update_user_error();
                });
            }
        },function(err){
            $scope.hint_update_user_error();
        });
    };

    //创建成功后保存处理
    $scope.ok=function(){
        if($scope.passwordAgain!=$scope.password){
            notificationService.info("两次密码不一致，请重新输入！");
            return;
        }else if($scope.selected_space&&($scope.spa_role==''||!$scope.spa_role)){
            notificationService.info("请输入空间角色！");
            return;
        }else if(!$scope.selected_space&&($scope.spa_role!=''&&$scope.spa_role)){
            notificationService.info("请输入空间！");
            return;
        }
        //usSpinnerService.spin('spinner-1');
        var uaaUser={
            username:$scope.username,
            password:$scope.password,
            email:$scope.email,
            phone:$scope.phone
        };
        var orgRole=$scope.org_role;
        var spaRole=$scope.spa_role;
        userService.addUaaUser(uaaUser).then(function(resp){
            var userGuid=resp.data.id;
            var user={};
            if(currSpa!=''&&currSpa){
                 user={
                    guid:userGuid,
                    userName:resp.data.userName,
                    name:resp.data.userName, //给associateUserWithOrganization使用
                    orgGuid:currOrg.guid,
                    organizationId:currOrg.guid,//给associateUserWithOrganization使用
                    spaGuid:currSpa.guid
                };
            }else{
                 user={
                    guid:userGuid,
                    userName:resp.data.userName,
                    name:resp.data.userName, //给associateUserWithOrganization使用
                    orgGuid:currOrg.guid,
                    organizationId:currOrg.guid,//给associateUserWithOrganization使用
                }
            }
            userService.addUser(user).then(function(resp){
                if(orgRole==='1'){
                    userService.associateManagedOrgWithUser1(user).then(function(resp){
                        $scope.hint_create_user_org_role_success();
                        if(currSpa==''||!currSpa){
                            $scope.hint_create_user_success();
                            //usSpinnerService.stop('spinner-1');
                            $modalInstance.close();
                        }
                    },function(err){
                        $scope.hint_create_user_org_role_error();
                        $scope.deleteUser(user);
                        if(currSpa==''||!currSpa){
                            $scope.hint_create_user_error();
                            //usSpinnerService.stop('spinner-1');
                            $modalInstance.close();
                        }
                    });
                }else if(orgRole==='2'){
                    userService.associateAuditedOrgWithUser1(user).then(function(resp){
                        $scope.hint_create_user_org_role_success();
                        if(currSpa==''||!currSpa){
                            $scope.hint_create_user_success();
                            //usSpinnerService.stop('spinner-1');
                            $modalInstance.close();
                        }
                    },function(err){
                        $scope.hint_create_user_org_role_error();
                        $scope.deleteUser(user);
                        if(currSpa==''||!currSpa){
                            $scope.hint_create_user_error();
                            //usSpinnerService.stop('spinner-1');
                            $modalInstance.close();
                        }
                    });
                }else if(orgRole==='3'){
                    userService.associateBillingManagerWithUser(user).then(function(resp){
                        $scope.hint_create_user_org_role_success();
                        if(currSpa==''||!currSpa){
                            $scope.hint_create_user_success();
                            //usSpinnerService.stop('spinner-1');
                            $modalInstance.close();
                        }
                    },function(err){
                        $scope.hint_create_user_org_role_error();
                        $scope.deleteUser(user);
                        if(currSpa==''||!currSpa){
                            $scope.hint_create_user_error();
                            //usSpinnerService.stop('spinner-1');
                            $modalInstance.close();
                        }
                    });
                }else if(orgRole==='4'){
                    organizationService.associateUserWithOrganization(user).then(function(resp){
                        $scope.hint_create_user_org_role_success();
                        if(currSpa==''||!currSpa){
                            //usSpinnerService.stop('spinner-1');
                            $scope.hint_create_user_success();
                            $modalInstance.close();
                        }
                    },function(err){
                        $scope.deleteUser(user);
                        if(currSpa==''||!currSpa){
                            $scope.hint_create_user_error();
                            //usSpinnerService.stop('spinner-1');
                            $modalInstance.close();
                        }
                    });
                };
                if(spaRole==='1'){
                    userService.associateManagedSpaWithUser(user).then(function(resp){
                        $scope.hint_create_user_spa_role_success();
                        $scope.hint_create_user_success();
                        //usSpinnerService.stop('spinner-1');
                        $modalInstance.close();
                    },function(err){
                        $scope.hint_create_user_spa_role_error();
                        $scope.deleteUser(user);
                        //usSpinnerService.stop('spinner-1');
                        $modalInstance.close();
                    });
                }else if(spaRole==='2'){
                    userService.associateAuditedSpaWithUser(user).then(function(resp){
                        $scope.hint_create_user_spa_role_success();
                        $scope.hint_create_user_success();
                        //usSpinnerService.stop('spinner-1');
                        $modalInstance.close();
                    },function(err){
                        $scope.hint_create_user_spa_role_error();
                        $scope.deleteUser(user);
                        //usSpinnerService.stop('spinner-1');
                        $modalInstance.close();
                    });
                }else if(spaRole==='3'){
                    userService.associateDeveloperSpaWithUser2(user).then(function(resp){
                        $scope.hint_create_user_spa_role_success();
                        $scope.hint_create_user_success();
                        //usSpinnerService.stop('spinner-1');
                        $modalInstance.close();
                    },function(err){
                        $scope.hint_create_user_spa_role_error();
                        $scope.deleteUser(user);
                        //usSpinnerService.stop('spinner-1');
                        $modalInstance.close();
                    });
                }
            },function(err){
                $scope.deleteUser(user);
            });
        },function(err){
            $scope.hint_create_user_error();
        });
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

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


app.controller('pageCtl',function($scope){
    if(flag==='create'){
        $scope.titleName="创建用户";
        $scope.doName="创建";
    }else if(flag==='update'){
        $scope.titleName="更新用户";
        $scope.doName="更新";
    }
});

app.controller('userDoCtl', ['$scope', '$modal', '$log','dialogs', function($scope, $modal,$log,dialogs) {

    $scope.create = function (size) {

        var dlg = dialogs.create('tpl/app_user_create.html','userCrudCtl',null, 'default');
        dlg.result.then(function(){

        });

        //flag='create';
        //var modalInstance = $modal.open({
        //    templateUrl: 'tpl/app_user_create.html',
        //    //controller: 'UserCreateInstanceCtrl',
        //});
        //
        //modalInstance.result.then(function (selectedItem) {
        //    <!-- $scope.selected = selectedItem; -->
        //}, function () {
        //    $log.info('Modal dismissed at: ' + new Date());
        //});
    };

    $scope.update = function (user) {
        flag='update';
        currUser=user;
        var modalInstance = $modal.open({
            templateUrl: 'tpl/app_user_create.html',
            //controller: 'UserCreateInstanceCtrl',
        });

        modalInstance.result.then(function (selectedItem) {
            <!-- $scope.selected = selectedItem; -->
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);
