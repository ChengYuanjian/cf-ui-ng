app.controller('LoginCtl', function($q,userService,organizationService,$scope, $state, $log, $stateParams, authService, $confirm, notificationService, usSpinnerService) {
    $scope.loginData = {
        userName: '',
        password: ''
    };

    $scope.code='' ; //在全局定义验证码
    $scope.validation='';
//产生验证码
    $scope.createCode=function(){
        var _code='';
        var codeLength = 4;//验证码的长度
        //var checkCode = document.getElementById("code");
        var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
            'S','T','U','V','W','X','Y','Z');//随机数
        for(var i = 0; i < codeLength; i++) {//循环操作
            var index = Math.floor(Math.random()*36);//取得随机数的索引（0~35）
            _code += random[index];//根据索引取得随机数加到code上
        }
        $scope.code=_code;
    };

    //初始加载验证码
    window.onload =$scope.createCode();

//校验验证码
    $scope.validate=function(){
        var inputCode = $scope.validation; //取得输入的验证码并转化为大写
        if(inputCode.length <= 0) { //若输入的验证码长度为0
            //则弹出请输入验证码
            alert("请输入验证码! ");
            //notificationService.warning("请输入验证码! ");
            return false;

        }
        else if(inputCode.toUpperCase() != $scope.code ) { //若输入的验证码与产生的验证码不一致时
            alert("验证码输入错误! ");
            //notificationService.error("验证码输入错误! "); //则弹出验证码输入错误
            $scope.createCode();//刷新验证码
            $scope.validation = '';//清空文本框
            return false;
        }
        else { //输入正确时
            return true;
        }
    };

    //记住账号密码相关代码
    $scope.addCookie = function (name,value,days,path)
    {
        var expires = new Date();
        expires.setTime(expires.getTime() + days * 3600000 * 24);
        path = path == "" ? "" : ";path=" + path;
        var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();
        document.cookie = name + "=" + value + _expires + path;
    };
    $scope.getCookieValue = function (name)
    {
        var allcookies = document.cookie;
        name += "=";
        var pos = allcookies.indexOf(name);
        if (pos != -1){
            var start = pos + name.length;
            var end = allcookies.indexOf(";",start);
            if (end == -1) end = allcookies.length;
            var value = allcookies.substring(start,end);
            return (value);
        }else{
            return "";
        }
    };
    $scope.deleteCookie =function(name,path)
    {
        var expires = new Date(0);
        path = path == "" ? "" : ";path=" + path;
        document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;
    };
    //checkbox代码
    $scope.updateSelection = function($event){
        var checkbox = $event.target ;
        var checked = checkbox.checked ;
        if(checked){
            $scope.addCookie("userName",$scope.loginData.userName,7,"/");
            $scope.addCookie("userPass",$scope.loginData.password,7,"/");
        }else{
            $scope.deleteCookie("userName");
            $scope.deleteCookie("userPass");
        }
    } ;

    $scope.loginData.userName= $scope.getCookieValue("userName");
    $scope.loginData.password=$scope.getCookieValue("userPass");

    authService.logout();
    $scope.login = function() {

        //验证码验证
        var isValid=new Boolean(false);
        isValid=$scope.validate();
        if(!isValid){
            return;
        }

        authService.logout();
        authService.login($scope.loginData).then(function(response) {
                //获取用户组织和空间权限信息
                $scope.getUserAuthInfo();
            },
            function (err) {
                notificationService.error(err.error_description);
                $log.error(err);
            });
    };

    // add by mas 20160819
    $scope.getUserAuthInfo=function(){
        userService.getUserInfo().then(function(resp){
            var userGuid=resp.data.user_id;
            localStorage.setItem('userGuid',userGuid);
            //创建3个deffered实例
            var deferred = $q.defer();
            var deferred1 = $q.defer();
            var deferred2 = $q.defer();
            var promise = deferred.promise;
            var promise1 = deferred1.promise;
            var promise2 = deferred2.promise;
            var num=0;
            $scope.isNext=function(i){
                if(num==i){num=0;return true;}
                else {return false}
            };
            var _userAuthInfo={};

            //获取空间角色信息
            promise.then(function (value) {
                var spas={};
                var spasO={};
                userService.getUserSpas(value).then(function(resp){
                    var data=resp.data;
                    angular.forEach(data.resources,function(spa){
                        var _spa={
                            'spa-guid':spa.metadata.guid,
                            'org-guid':spa.entity.organization_guid,
                            'spa-name':spa.entity.name,
                            'spa-roleC':'1',
                            'spa-role':1
                        };
                        //初始化spasO[spa.entity.organization_guid]
                        if(!spasO[spa.entity.organization_guid]){
                            spasO[spa.entity.organization_guid]={};
                        }
                        if(spas[spa.metadata.guid]){
                            spas[spa.metadata.guid]['spa-roleC']=spas[spa.metadata.guid]['spa-roleC']+',1';
                            spas[spa.metadata.guid]['spa-role']=1+spas[spa.metadata.guid]['spa-role'];
                            spasO[spa.entity.organization_guid][spa.metadata.guid]=spas[spa.metadata.guid];
                        }else{
                            spas[spa.metadata.guid]=_spa;
                            spasO[spa.entity.organization_guid][spa.metadata.guid]=_spa;
                        }
                    });
                    num=num+1;
                    if($scope.isNext(3)){
                        deferred1.resolve({value:value,spas:spas,spasO:spasO});
                    }
                });

                userService.getUserAuditSpas(value).then(function(resp){
                    var data=resp.data;
                    angular.forEach(data.resources,function(spa){
                        var _spa={
                            'spa-guid':spa.metadata.guid,
                            'org-guid':spa.entity.organization_guid,
                            'spa-name':spa.entity.name,
                            'spa-roleC':'2',
                            'spa-role':2
                        };
                        //初始化spasO[spa.entity.organization_guid]
                        if(!spasO[spa.entity.organization_guid]){
                            spasO[spa.entity.organization_guid]={};
                        }
                        if(spas[spa.metadata.guid]){
                            spas[spa.metadata.guid]['spa-roleC']=spas[spa.metadata.guid]['spa-roleC']+',2';
                            spas[spa.metadata.guid]['spa-role']=2+spas[spa.metadata.guid]['spa-role'];
                            spasO[spa.entity.organization_guid][spa.metadata.guid]=spas[spa.metadata.guid];
                        }else{
                            spas[spa.metadata.guid]=_spa;
                            spasO[spa.entity.organization_guid][spa.metadata.guid]=_spa;
                        }
                    });
                    num=num+1;
                    if($scope.isNext(3)){
                        deferred1.resolve({value:value,spas:spas,spasO:spasO});
                    }
                });

                userService.getUserManagerSpas(value).then(function(resp){
                    var data=resp.data;
                    angular.forEach(data.resources,function(spa){
                        var _spa={
                            'spa-guid':spa.metadata.guid,
                            'org-guid':spa.entity.organization_guid,
                            'spa-name':spa.entity.name,
                            'spa-roleC':'4',
                            'spa-role':4
                        };
                        //初始化spasO[spa.entity.organization_guid]
                        if(!spasO[spa.entity.organization_guid]){
                            spasO[spa.entity.organization_guid]={};
                        }
                        if(spas[spa.metadata.guid]){
                            spas[spa.metadata.guid]['spa-roleC']=spas[spa.metadata.guid]['spa-roleC']+',4';
                            spas[spa.metadata.guid]['spa-role']=4+spas[spa.metadata.guid]['spa-role'];
                            spasO[spa.entity.organization_guid][spa.metadata.guid]=spas[spa.metadata.guid];
                        }else{
                            spas[spa.metadata.guid]=_spa;
                            spasO[spa.entity.organization_guid][spa.metadata.guid]=_spa;
                        }
                    });
                    num=num+1;
                    if($scope.isNext(3)){
                        deferred1.resolve({value:value,spas:spas,spasO:spasO});
                    }
                });
            });

            //获取组织角色信息，并载入之前的空间角色信息
            promise1.then(function (result) {
                var userGuid=result.value;
                var spasO=result.spasO;
                var orgs={};
                //orgs.desc='该对象提供了两种用户组织和空间权限的表示方式：org-roleC中的1代表组织普通用户、2代表组织审计员、4代表组织管理员、8代表组织计费员，org-role采用类似于Linux中的权限表示；' +
                //    'spa-roleC中的1代表空间开发员、2代表空间审计员、4代表空间管理员，spa-role采用类似于Linux中的权限表示';
                userService.getUserOrgs(userGuid).then(function(resp){
                    var data=resp.data;
                    angular.forEach(data.resources,function(org){
                        var _org= {
                            'org-guid': org.metadata.guid,
                            'org-name': org.entity.name,
                            'org-roleC':'1',
                            'org-role': 1,
                            'org-spaces': spasO[org.metadata.guid]
                        };
                        //如果spasO[org.metadata.guid]不存在，则给_org['org-spaces']初始化{}，防止后面调用报错
                        if(!_org['org-spaces']){
                            _org['org-spaces']={};
                        }
                        //若已经存在该组织，则处理角色属性字段
                        if(orgs[org.metadata.guid]){
                            orgs[org.metadata.guid]['org-roleC']=orgs[org.metadata.guid]['org-roleC']+',1';
                            orgs[org.metadata.guid]['org-role']=1+orgs[org.metadata.guid]['org-role'];
                        }else{
                            orgs[org.metadata.guid]=_org;
                        }
                    });
                    num=num+1;
                    if($scope.isNext(4)){
                        deferred2.resolve(orgs);
                    }
                });
                userService.getUserAuditOrgs(userGuid).then(function(resp){
                    var data=resp.data;
                    angular.forEach(data.resources,function(org){
                        var _org= {
                            'org-guid': org.metadata.guid,
                            'org-name': org.entity.name,
                            'org-roleC':'2',
                            'org-role': 2,
                            'org-spaces': spasO[org.metadata.guid]
                        };
                        //如果spasO[org.metadata.guid]不存在，则给_org['org-spaces']初始化{}，防止后面调用报错
                        if(!_org['org-spaces']){
                            _org['org-spaces']={};
                        }
                        //若已经存在该组织，则处理角色属性字段
                        if(orgs[org.metadata.guid]){
                            orgs[org.metadata.guid]['org-roleC']=orgs[org.metadata.guid]['org-roleC']+',2';
                            orgs[org.metadata.guid]['org-role']=2+orgs[org.metadata.guid]['org-role'];
                        }else{
                            orgs[org.metadata.guid]=_org;
                        }
                    });
                    num=num+1;
                    if($scope.isNext(4)){
                        deferred2.resolve(orgs);
                    }
                });


                //内部顺序处理，为组织管理员下挂空间服务
                var subdeferred = $q.defer();
                var subpromise = subdeferred.promise;
                var subnum=0;
                $scope.subisNext=function(i){
                    if(subnum==i){subnum=0;return true;}
                    else {return false}
                };
                subpromise.then(function(){
                    num=num+1;
                    if($scope.isNext(4)){
                        deferred2.resolve(orgs);
                    }
                });

                userService.getUserManagerOrgs(userGuid).then(function(resp){
                    //如果不是组织管理员，则无需装在下挂空间
                    if(resp.data.total_results==0){
                        num=num+1;
                        if($scope.isNext(4)){
                            deferred2.resolve(orgs);
                        }
                        return;
                    }
                    var data=resp.data;
                    angular.forEach(data.resources,function(org){
                        var _org= {
                            'org-guid': org.metadata.guid,
                            'org-name': org.entity.name,
                            'org-roleC':'4',
                            'org-role': 4,
                            'org-spaces': spasO[org.metadata.guid]
                        };
                        //如果spasO[org.metadata.guid]不存在，则给_org['org-spaces']初始化{}，防止后面调用报错
                        if(!_org['org-spaces']){
                            _org['org-spaces']={};
                        }
                        //组织管理员角色可以查看和编辑所有该组织下面的空间,将该组织下面的所有空间进行载入
                        organizationService.getSpacesForTheOrganization(org.metadata.guid).then(function(resp1){
                            angular.forEach(resp1.data.resources,function(spa){
                                var _spa={
                                    'spa-guid':spa.metadata.guid,
                                    'org-guid':spa.entity.organization_guid,
                                    'spa-name':spa.entity.name,
                                    'spa-roleC':'0',
                                    'spa-role':0
                                };
                                //如果在上面装载的空间中不存在该空间，则加入org-spaces中，若存在，则不加入
                                if (!_org['org-spaces'][spa.metadata.guid]){
                                    _org['org-spaces'][spa.metadata.guid]=_spa;
                                }
                            });

                            //若已经存在该组织，则处理角色属性字段
                            if(orgs[org.metadata.guid]){
                                orgs[org.metadata.guid]['org-roleC']=orgs[org.metadata.guid]['org-roleC']+',4';
                                orgs[org.metadata.guid]['org-role']=4+orgs[org.metadata.guid]['org-role'];
                            }else{
                                orgs[org.metadata.guid]=_org;
                            }

                            //当所有的组织管理员角色下挂完空间之后，执行subpromise.then中的代码
                            subnum=subnum+1;
                            if($scope.subisNext(resp.data.total_results)){
                                subdeferred.resolve();
                            }

                        });
                    });
                });

                userService.getUserBillManagerOrgs(userGuid).then(function(resp){
                    var data=resp.data;
                    angular.forEach(data.resources,function(org){
                        var _org= {
                            'org-guid': org.metadata.guid,
                            'org-name': org.entity.name,
                            'org-roleC':'8',
                            'org-role': 8,
                            'org-spaces': spasO[org.metadata.guid]
                        };
                        //如果spasO[org.metadata.guid]不存在，则给_org['org-spaces']初始化{}，防止后面调用报错
                        if(!_org['org-spaces']){
                            _org['org-spaces']={};
                        }
                        //若已经存在该组织，则处理角色属性字段
                        if(orgs[org.metadata.guid]){
                            orgs[org.metadata.guid]['org-roleC']=orgs[org.metadata.guid]['org-roleC']+',8';
                            orgs[org.metadata.guid]['org-role']=8+orgs[org.metadata.guid]['org-role'];
                        }else{
                            orgs[org.metadata.guid]=_org;
                        }
                    });
                    num=num+1;
                    if($scope.isNext(4)){
                        deferred2.resolve(orgs);
                    }
                });
            });

            //保存用户权限数据，跳转到主页面
            promise2.then(function (result) {
                var desc='对象userAuthInfo提供了两种用户组织和空间权限的表示方式：' +
                        'org-roleC中的1代表组织普通用户、2代表组织审计员、4代表组织管理员、8代表组织计费员，org-role采用类似于Linux中的权限表示；' +
                        'spa-roleC中的1代表空间开发员、2代表空间审计员、4代表空间管理员、0代表该用户是组织管理员，但是还没有被授予空间的具体角色，spa-role采用类似于Linux中的权限表示';

                var userAuthInfo={data:result,desc:desc};
                //JSON.parse(str); //可以将json字符串转换成json对象
                //JSON.stringify(str); //可以将json对象转换成json对符串
                localStorage.setItem('userAuthInfo', JSON.stringify(userAuthInfo));
                userService.setUserAuthInfo(userAuthInfo);

                ////test
                //for (var a in userAuthInfo.data){
                //    var b= userAuthInfo.data[a];
                //}
                //跳转到主页面..
                notificationService.success("登录成功");
                $state.go('app.org_manage');

            });
            deferred.resolve(userGuid);
        });
    };
});
