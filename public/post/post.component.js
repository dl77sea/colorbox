(function() {
  angular.module('app')
    .component('post', {
      controller: controller,
      template: `
      <p>posts</p>
      <div class="row">
        <div class="post-div col s2 m3 l3" ng-repeat="box in $ctrl.boxes">
          <div class="col s6 m6 l6">
            <p>{{ box.color }}</p>
          </div>
        </div>
      </div>
      <a ui-sref="edit">create</a>
      `
    })
  // controller.$inject = ['$state', '$http', '$stateParams'];

  // function controller($state, $http, $stateParams) {
  function controller() {
    const vm = this
    console.log("navbar controller")

    vm.$onInit = function() {
      vm.boxes = [{color: "a"},{color: "b"},{color: "c"},{color: "d"},{color: "e"},{color: "f"},{color: "g"},{color: "h"},{color: "i"},{color: "j"},{color: "k"}]
      console.log("init navbar")
    };
  }

}());
