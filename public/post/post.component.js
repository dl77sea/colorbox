(function() {
  //module('myModule', ['hl.sticky']);
  angular.module('app')
    .component('post', {
      controller: controller,
      template: `
      <br></br>
      <div id="boxes" class="row">
        <div class="post-div col s2 m4 l4" ng-repeat="box in $ctrl.curBoxes">
          <!-- <p>{{ box.color }}</p> -->
            <div style="width: 100%">
              <p style="display: inline-block; margin: 0px">{{ box.email }}</p>
              <div style="float: right" ng-if="box.self == true">
                <a ng-click="$ctrl.update(box)" style="display: inline-block">edit</a>
                <a ng-click="$ctrl.delete(box)" style="display: inline-block">delete</a>
              </div>
            </div>

          <canvas id={{box.id}} class="canvas-style" canvas-init></canvas>
        </div>
      </div>

      <a ng-click="$ctrl.launchEditor()">create</a>
      `
    })

    //this is used because it is called when the canvas is available in dom,
    //so then it becomes possible to call $ctrl.genBox(box, canvas),
    //as genBox() needs a canvas element in the dom to work.
    .directive('canvasInit', function() {
      return {
        link: function($scope, element, attrs) {
          let canvas = element[0];

          $scope.$parent.$ctrl.genBox($scope.box, canvas)

          //needed for materialize modal stuff to work
          $(document).ready(function() {
            // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
            $('.modal').modal();
          });

        }
      }
    });

  controller.$inject = ['$state', '$http', 'authService', 'updateService'];

  function controller($state, $http, authService, updateService) {
    // function controller() {
    const vm = this
    // vm.formMode = authService.formMode;
    vm.formMode = "signin"
    vm.loginMode = "siginedout"

    vm.email = null;
    vm.password = null;

    console.log("navbar controller")

    vm.$onInit = function() {

      // vm.curBoxes = [
      //
      //   {
      //     color: "box01"
      //   },
      //   {
      //     color: "box02"
      //   },
      //   {
      //     color: "box03"
      //   },
      //   {
      //     color: "box04"
      //   },
      //   {
      //     color: "box05"
      //   },
      //   {
      //     color: "box06"
      //   }
      // ]
      vm.getBoxes()
    }

    vm.formSubmit = function() {
      console.log("formSubmit from post")
      authService.formSubmit(vm.email, vm.password, vm.formMode)
        .then(function(response) {
          if (response.success === true) {
            vm.formMode = response.formMode;
            vm.loginMode = response.loginMode;
          }
        })
        .catch(function(response) {
          console.log("signup error")
        })
    }

    //generate box from parameters from box description from database
    vm.genBox = function(box, canvas) {
      console.log("cur box", box)
      // console.log("cur canv: ", canvas)
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
        width: box.width,
        height: box.height,
        depth: box.depth,
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
      //load up all the boxes to front end but do not render them.
      //rendering will be front-end paginated
      // (todo: paginate this load)

      //request this endpoint from server.js
      $http.get('/api/boxes').then(function(response) {
        vm.curBoxes = response.data;
      })
    }

    vm.launchEditor = function() {
      //check if user is logged in
      $http.get('/api/users/auth')
        .then(function(response) {
          console.log("auth success")
          $state.go('edit')
        })
        .catch(function(response) {
          console.log("auth err")
          console.log(response)
          $('#modal-auth').modal('open')
        })
    }

    vm.update = function(box) {
      console.log("entered post update")
      updateService.box = box
      $state.go('edit')
    }

    vm.delete = function(box) {

    }

  }
}());
