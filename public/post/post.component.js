(function() {
  angular.module('app')
    .component('post', {
      controller: controller,
      template: `

    <p>posts</p>
    <a ui-sref="edit">create</a>
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
