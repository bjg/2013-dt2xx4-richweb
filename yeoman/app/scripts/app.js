'use strict';

angular.module('yeomanApp', [
        'ui.router'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                template: '<message-sender></message-sender>'
            })

    });
