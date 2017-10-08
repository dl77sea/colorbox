(function() {
  //module('myModule', ['hl.sticky']);
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

        <a ui-sref="edit">create</a>
        <p>sdf<br><p>sdf<br><p>sdf<br><p>sdf<br><p>sdf<br><p>sdf<br><p>sdf<br>
        <p>sdf<br><p>sdf<br><p>sdf<br><p>sdf<br><p>sdf<br><p>sdf<br><p>sdf<br>

      </div>
      `
    })
  // controller.$inject = ['$state', '$http', '$stateParams'];
  // controller.$inject = ['hl.sticky'];

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
  // controller.$inject = ['ngMaterial'];
  function controller($state, $http, $stateParams) {
  // function controller() {
    const vm = this
    console.log("navbar controller")

    vm.$onInit = function() {
      vm.boxes = [
        {color: "box01"},
        {color: "box02"},
        {color: "box03"},
        {color: "box04"},
        {color: "box05"},
        {color: "box06"},
        {color: "box07"},
        {color: "box08"},
        {color: "box09"},
        {color: "box10"},
        {color: "box11"},
        {color: "box12"}
        // {color: "box13"},
        // {color: "box14"},
        // {color: "box15"},
        // {color: "box16"}
        // {color: "box17"},
        // {color: "box18"},
        // {color: "box19"}
        // {color: "box20"},
        // {color: "box21"},
        // {color: "box22"}
      ]
      console.log("init navbar")

      // vm.getBoxes();
      // console.log(document.getElementById("2"))
    };

    vm.purgeBoxes = function() {

    }

    vm.test = function() {
      console.log("snarfff")
    }
    //generate box from parameters from box description from database
    vm.genBox = function (box, canvas) {
      console.log("cur canv: ", canvas)
      // let currentCanvas = (box.id).toString();
      // console.log(currentCanvas)
      // console.log(document.getElementById("2"))

      let curCanvas = canvas //document.getElementById("editCanvas");

      let engine = new BABYLON.Engine(canvas, true);

      let scene = new BABYLON.Scene(engine);

      scene.clearColor = new BABYLON.Color3(0, 1, 0);

      let camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 120, new BABYLON.Vector3.Zero(), scene);
      camera.setPosition(new BABYLON.Vector3(50, 50, -100));
      // camera.position.x = 0;
      // camera.position.z = 50;
      // camera.position.z = 0;

      // This attaches the camera to the canvas
      camera.attachControl(canvas, false);

      var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-50, 100, 0), scene);

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

      let box01 = BABYLON.MeshBuilder.CreateBox("box01", boxOptions, scene)

      var materialSnarf = new BABYLON.StandardMaterial("snarf", scene);

      materialSnarf.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);

      materialSnarf.alpha = 0.5;

      box01.material = materialSnarf;

      box01.position.x = 0;
      box01.position.y = 0;
      box01.position.z = 0;

      engine.runRenderLoop(function() {
        box01.rotation.x += .0025
        box01.rotation.y += .0025
        box01.rotation.z += .0025
        scene.render();
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
