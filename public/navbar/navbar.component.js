(function() {
  angular.module('app')
    .component('navbar', {
      controller: controller,
      template: `





        `
    })
  // controller.$inject = ['$state', '$http', '$stateParams'];

  // function controller($state, $http, $stateParams) {
  function controller() {
    const vm = this
    console.log("navbar controller")

    vm.$onInit = function() {
      console.log("init navbar")
    };
  }

}());
