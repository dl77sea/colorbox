(function() {
  'use strict';
  console.log('Hello config iffe');
  angular.module('app').config(config)
    .service('authService', authService)
    .service('updateService', updateService)

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

  function updateService() {
    const vm = this;
    console.log("updateService entered")
    // this value assigned from post component, selected box to edit
    vm.box = null;
  }

  authService.$inject = ['$http'];
  function authService($http) {
    const vm = this;

    console.log("authService entered")

    // vm.formMode = "signin"
    vm.username = null;
    vm.password = null;

    //gets set from two possible sources:
    //  1) formSubmitSignin response: (typically, when user comes to site, signed out)
    //  2) usrs /auth route, when user comes to site signed in
    //check if user logged in (token valid)
    vm.username = null;
    $http.get('/api/users/auth')
      .then(function(response) {
        console.log("authService success: ", response.data)
        // vm.loginMode = "signedin"
        // this.test();
        vm.username = response.data;
      })
      .catch(function(response) {
        console.log("auth fail")
        console.log(response)
        vm.loginMode = "signedout"
        vm.formMode = "signin"
      })

    vm.formSubmit = function(email, password, formMode) {
      console.log("formSubmit")
      vm.formMode=formMode

      let data = {
        email: email,
        password: password
      }

      if (formMode === "signin") {
        //needs to return even though sign in returns no values, just to conform to promise in component that needs val returned from signup
        return vm.formSubmitSignin(data);
      }

      if (formMode === "signup") {
        //this one is returned bc return val to component controller method determines ng-if visability.
        return vm.formSubmitSignup(data);
      }
    }

    vm.formSubmitSignin = function(data) {
      //verify submitted login
      return $http.post('/api/users/signin', data)
        //200s go here
        .then(function success(response) {
          console.log("form signin success", response)
          vm.username = response.email;

          console.log("authService formSubmitSignin:", response.email)
          $('#modal-auth').modal('close');
          return {success: true, formMode: 'signin', loginMode: 'signedin'}
        })
        //others go here
        .catch(function error(response) {
          console.log("form signin fail")
          alert(response.data) //replace with modal expandable
          //status code in response.status
          //status message in response.data
        })
    }

    vm.formSubmitSignup = function(data) {
      //verify submitted login
      return $http.post('/api/users/signup', data)
        //200s go here
        .then(function success(response) {
          console.log("form signup success")
          console.log(response.data)
          console.log(vm.formMode)
          return {success: true, formMode: 'signin', loginMode: 'signedout'}; // vm.formMode = "signin"
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
  };


}());
