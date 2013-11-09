'use strict';

angular.module('oicApp', [
  'ngCookies',
  'ngSanitize',
  'ui.router'
])
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: 'views/main.html',
        controller: 'MainCtrl as main'
      });
  });
