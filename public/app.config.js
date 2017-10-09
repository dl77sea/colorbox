(function() {
  'use strict';
  console.log('Hello config iffe');
  angular.module('app').config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']
  function config($stateProvider, $urlRouterProvider, $locationProvider){

    console.log('Hello config callback');

    $locationProvider.html5Mode(true)

    $stateProvider
      .state({
        name: 'nav',
        abstract: true,
        component: 'navbar',
      })
      .state({
        name: 'posts',
        url: '/',
        parent: 'nav',
        component: 'post'
      })
      .state({
        name: 'edit',
        url: '/edit',
        parent: 'nav',
        component: 'edit'
      })
  }
}());
