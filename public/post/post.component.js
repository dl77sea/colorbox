(function() {
  angular.module('app')
    .component('post', {
      controller: controller,
      template: `
      <a ng-click="$ctrl.test()">posts</a>

      <div class="row">
        <div class="post-div col s2 m4 l4" ng-repeat="box in $ctrl.boxes">

            <p>{{ box.color }}</p>
            <canvas id={{box.id}} class="canvas-style" canvas-init></canvas>

        </div>
      </div>
      <a ui-sref="edit">create</a>
      `
    })
  // controller.$inject = ['$state', '$http', '$stateParams'];

  //this is used because it is called when the canvas is available in dom,
  //so then it becomes possible to call $ctrl.genBox(box, canvas),
  //as genBox() needs a canvas element in the dom to work.
  .directive('canvasInit', function () {
      return {
          link: function ($scope, element, attrs) {
              let canvas = element[0];
              // element.bind('click', function () {
              //     element.html('You clicked me!');
              // });
              // element.bind('mouseenter', function () {
              //     element.css('background-color', 'yellow');
              // });
              // element.bind('mouseleave', function () {
              //     element.css('background-color', 'white');
              // });
              //console.log("blarf", $scope.box)
              $scope.$parent.$ctrl.genBox($scope.box, canvas)
          }
      }
  });

  function controller($state, $http, $stateParams) {
  // function controller() {
    const vm = this
    console.log("navbar controller")

    vm.$onInit = function() {
      // vm.boxes = [{color: "a"},{color: "b"},{color: "c"},{color: "d"},{color: "e"},{color: "f"},{color: "g"},{color: "h"},{color: "i"},{color: "j"},{color: "k"}]
      console.log("init navbar")
      vm.canvi = [];
      vm.getBoxes();
      // console.log(document.getElementById("2"))
    };



    vm.test = function() {

      console.log("snarfff")
    }
    //generate box from parameters from box description from database
    vm.genBox = function (box, canvas) {
      console.log("cur canv: ", canvas)
      // let currentCanvas = (box.id).toString();
      // console.log(currentCanvas)
      // console.log(document.getElementById("2"))

      vm.canvas = canvas //document.getElementById("editCanvas");

      vm.engine = new BABYLON.Engine(vm.canvas, true);

      vm.scene = new BABYLON.Scene(vm.engine);

      vm.scene.clearColor = new BABYLON.Color3(0, 1, 0);

      vm.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 120, new BABYLON.Vector3.Zero(), vm.scene);
      vm.camera.setPosition(new BABYLON.Vector3(50, 50, -100));
      // camera.position.x = 0;
      // camera.position.z = 50;
      // camera.position.z = 0;

      // This attaches the camera to the canvas
      vm.camera.attachControl(vm.canvas, false);

      var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-50, 100, 0), vm.scene);

      light.intensity = 1.0;

      var boxOptions = {
        // size: number,
        width: 25,
        height: 25,
        depth: 25,
        // faceUV: Vector4[],
        // faceColors: Color4[],
        // sideOrientation: number,
        // frontUVs: Vector4,
        // backUVs: Vector4,
        updatable: true
      };

      vm.box01 = BABYLON.MeshBuilder.CreateBox("box01", boxOptions, vm.scene)

      var materialSnarf = new BABYLON.StandardMaterial("snarf", vm.scene);

      materialSnarf.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);

      materialSnarf.alpha = 0.5;

      vm.box01.material = materialSnarf;

      vm.box01.position.x = 0;
      vm.box01.position.y = 0;
      vm.box01.position.z = 0;


      vm.engine.runRenderLoop(function() {
        vm.scene.render();
      });

    }

    vm.getBoxes = function() {
      //request this endpoint from server.js
      $http.get('/api/boxes').then(function (response) {
        vm.boxes = response.data;
      })
    }
  }

}());
