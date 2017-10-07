(function() {
  angular.module('app')
    .component('post', {
      controller: controller,
      template: `
      <p>posts</p>
      <div class="row">
        <div class="post-div col s2 m4 l4" ng-repeat="box in $ctrl.boxes" ng-init="$ctrl.genBox(box)">
          <div class="col s6 m6 l6">
            <p>{{ box.color }}</p>
          </div>
        </div>
      </div>
      <a ui-sref="edit">create</a>
      `
    })
  // controller.$inject = ['$state', '$http', '$stateParams'];

  function controller($state, $http, $stateParams) {
  // function controller() {
    const vm = this
    console.log("navbar controller")

    vm.$onInit = function() {
      // vm.boxes = [{color: "a"},{color: "b"},{color: "c"},{color: "d"},{color: "e"},{color: "f"},{color: "g"},{color: "h"},{color: "i"},{color: "j"},{color: "k"}]
      console.log("init navbar")
      vm.getBoxes();
    };

    //generate box from parameters from box description from database
    vm.genBox = function (box) {
      console.log(box)
    }

    vm.getBoxes = function() {
      //request this endpoint from server.js
      $http.get('/api/boxes').then(function (response) {
        vm.boxes = response.data;
      })
    }
  }

}());
