(function() {
  'use strict';
  console.log('Hello config iffe');
  angular.module('app').config(config)
    .service('authService', authService)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

  function config($stateProvider, $urlRouterProvider, $locationProvider) {

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

  authService.$inject = ['$http'];
  function authService($http) {
    const vm = this;
    // vm.formMode = "signin"
    vm.email = null;
    vm.password = null;

    vm.formSubmitSignin = function(data) {
      //verify submitted login
      $http.post('/api/users/signin', data)
        //200s go here
        .then(function success(response) {
          console.log("form signin success")
          $('#modal-signinup').modal('close');
        })
        //others go here
        .catch(function error(response) {
          console.log("form signin fail")
          alert(response.data) //replace with modal expandable
          //status code in response.status
          //status message in response.data
        })
    }

    vm.formSubmit = function(email, password, formMode) {
      console.log("formSubmit")
      vm.formMode=formMode

      let data = {
        email: email,
        password: password
      }

      if (formMode === "signin") {
        vm.formSubmitSignin(data);
      }

      if (formMode === "signup") {
        vm.formSubmitSignup(data);
      }
    }

    vm.formSubmitSignup = function(data) {
      //verify submitted login
      console.log("formSubmitSignup")
      return $http.post('/api/users/signup', data)
        //200s go here
        .then(function success(response) {
          console.log("form signup success")
          console.log(response.data)
          console.log(vm.formMode)
          return true; // vm.formMode = "signin"
        })
        //others go here
        .catch(function error(response) {
          console.log("form signup fail")
          console.log(response)
          alert(response.data) //replace with modal expandable
          return false;
          //status code in response.status
          //status message in response.data
        })
    }

    return new Promise(function(success, fail) {
      $http.post('/api/users/signup', data)
        //200s go here
        .then(function success(response) {
          console.log("form signup success")
          console.log(response.data)
          console.log(vm.formMode)
          return success(...); // vm.formMode = "signin"
        })
        //others go here
        .catch(function error(response) {
          console.log("form signup fail")
          console.log(response)
          alert(response.data) //replace with modal expandable
          return false;
          //status code in response.status
          //status message in response.data
        })
    })


  };


}());
