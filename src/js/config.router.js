'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
        [          '$rootScope', '$state', '$stateParams','authService','$location' ,
            function ($rootScope,   $state,   $stateParams, authService, $location) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                $rootScope.nrOfUnauthorizedRequests = 0;
                authService.fillAuthData();

                $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
                    if(toState.name.match(/^access\./) != null) {
                        return;
                    } else {
                        $rootScope.nrOfUnauthorizedRequests = 0;
                        var authentication = authService.authentication;

                        if (!authentication.isAuth) {
                            event.preventDefault();
                            return $state.go('access.login',{from:fromState.name,w:'notLogin'},{location: true});
                        }
                    }
                });
            }
        ]
    )
    .config(
        [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
            function ($stateProvider,   $urlRouterProvider, JQ_CONFIG) {

                $urlRouterProvider
                    .otherwise('/app/dashboard');

                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'tpl/app.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/logoutCtl.js','js/controllers/loadMenuCtl.js']);
                                }]
                        }
                    })
                    .state('app.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/app_dashboard.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/chart.js']);
                                }]
                        }
                    })
                    .state('app.space_manage',{
                        url: '/space_manage',
                        template: '<div ui-view></div>'
                    })
                    .state('app.space_manage.list',{
                        url: '/list',
                        templateUrl: 'tpl/app_space_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/spaceListCtl.js']);
                                }]
                        }
                    })
                    .state('app.space_manage.detail',{
                        url: '/space_detail/:guid/:spacename/:orgGuid',
                        templateUrl: 'tpl/app_space_detail.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/spaceListCtl.js','js/controllers/spaceUserCtl.js']);
                                }]
                        }
                    })

                    .state('app.org_manage',{
                        url: '/org_manage',
                        template: '<div ui-view></div>'
                    })
                    .state('app.org_manage.detail',{
                        url: '/org_detail/:guid/:name',
                        templateUrl: 'tpl/app_org_detail.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/organizationDetailsCtrl.js']);
                                }]
                        }
                    })
                    .state('app.app_manage',{
                        url: '/app_manage',
                        template: '<div ui-view></div>'
                    })
                    .state('app.app_manage.list',{
                        url: '/list',
                        templateUrl: 'tpl/app_app_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/appListCtrl.js']);
                                }]
                        }
                    })
                    .state('app.app_manage.detail',{
                        url: '/detail/:guid/:space_guid/:name/:org/:org_guid/:space',
                        templateUrl: 'tpl/app_app_detail.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/appDetailCtrl.js']);
                                }]
                        }
                    })
                    .state('app.router_manage',{
                        url: '/router_manage',
                        template: '<div ui-view></div>',
                    })
                    .state('app.router_manage.list',{
                        url: '/list',
                        templateUrl: 'tpl/app_router_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/routerListCtl.js']);
                                }]
                        }
                    })

                    .state('app.domain_manage',{
                        url: '/domain_manage',
                        template: '<div ui-view></div>'
                    })
                    .state('app.domain_manage.list',{
                        url: '/list',
                        templateUrl: 'tpl/app_domain_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/domainListCtl.js']);
                                }]
                        }
                    })

                    .state('app.user_manage',{
                        url: '/user_manage',
                        template: '<div ui-view></div>'
                    })
                    .state('app.user_manage.list',{
                        url: '/list',
                        templateUrl: 'tpl/app_user_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/userCtl.js','js/controllers/userCrudCtl.js']);
                                }]
                        }
                    })
                    .state('app.user_manage.detail',{
                        url: '/detail/:guid/:username/:email/:createtime/:updatetime/:phone',
                        templateUrl: 'tpl/app_user_detail.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/userDetailCtl.js']);
                                }]
                        }
                    })
                    .state('app.user.chgPassword',{
                        url: '/chgPassword',
                        templateUrl: 'tpl/app_user_password_change.html'
                    })
                    .state('app.user_manage.create',{
                        url: '/userCreate',
                        templateUrl: 'tpl/app_user_create.html'
                    })
                    .state('access', {
                        url: '/access',
                        template: '<div ui-view></div>'
                    })
                    .state('access.login', {
                        url: '/login',
                        templateUrl: 'tpl/login.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/loginCtl.js','js/controllers/userCtl.js']);
                                }]
                        }
                    })
                    .state('app.marketplace',{
                        url: '/marketplace',
                        template: '<div ui-view></div>'
                    })
                    .state('app.marketplace.list', {
                        url: '/list',
                        templateUrl: 'tpl/app_marketplace_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/marketplaceAddServiceCtrl.js']);
                                }]
                        }
                    })
                    .state('app.marketplace.serviceplan', {
                        url: '/:serviceId/:serviceName',
                        templateUrl: 'tpl/app_marketplace_serviceplan.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/marketplaceSelectServicePlanCtrl.js']);
                                }]
                        }
                    })
                    .state('app.marketplace.serviceinstance', {
                        url: '/:serviceId/:serviceName/:servicePlanId/:servicePlanName',
                        templateUrl: 'tpl/app_marketplace_serviceinstance.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function( $ocLazyLoad ){
                                    return $ocLazyLoad.load(['js/controllers/marketplaceAddServiceInstanceCtrl.js']);
                                }]
                        }
                    })
            }
        ]
    );
