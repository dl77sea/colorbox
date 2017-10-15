(function() {
  //module('myModule', ['hl.sticky']);
  angular.module('app')
    .component('post', {
      controller: controller,
      template: `
      <div id="boxes" class="row row-mod">
        <div class="entry-container col s2 m4 l4" ng-repeat="box in $ctrl.curBoxes">

          <canvas id={{box.id}} class="canvas-style" canvas-init></canvas>
            <div style="width: 100%; line-height: 0">
              <p style="display: inline-block; margin: 0">{{ box.email }}</p>
              <p style="display: inline-block; margin: 0">{{ box.id }}</p>
              <div style="float: right" ng-if="box.self == true">
                <a ng-click="$ctrl.update(box)" style="display: inline-block">edit</a>
                <a ng-click="$ctrl.delete(box)" style="display: inline-block">delete</a>
              </div>
            </div>

        </div>

      </div>

      <!-- <footer class="page-footer footer-fixed">-->
      <!-- <div class="footer-fixed"> -->

      <div class="page-container">
      <button ng-click="$ctrl.launchEditor()" class="btn waves-effect waves-light" type="submit" name="action">Add a box!
      <!-- <i class="material-icons right">send</i> -->
      </button>
      </div>


      <div id="pgn-container" class="page-container">
      </div>







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

    //this value is used by edit.component.js to determine if a box is being updated or created new
    updateService.box = null;

    vm.formMode = "signin"
    vm.loginMode = "siginedout"

    vm.email = null;
    vm.password = null;

    console.log("navbar controller")

    vm.$onInit = function() {
      vm.iPage = 0;
      vm.curBoxes = [];
      /*
      vm.allBoxes = vm.getBoxes() //would this work with async?
      console.log("from init vm.allBoxes ", vm.allBoxes.$$state.) //how to unpack promise?
      */

      //populate vm.allBoxes and get page from getBoxes.then
      vm.getBoxes()
      vm.numItems = 6;

      // vm.getPage(vm.iPage)
    }

    vm.getPage = function(iPage) {
      console.log("page: ", iPage)

      //is there an "angular way" to keep this from updating one by one in real time in view
      for(let i=0; i < vm.numItems; i++) {
        vm.curBoxes[i] = vm.allBoxes[iPage+i]
      }


      vm.paginate();
      // getBoxes
    }

    //figure out an "angular way" to do this
    vm.paginate = function() {
      /*

      <ul class="pagination">
        <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
        <li class="active"><a href="#!">1</a></li>
        <li class="waves-effect"><a href="#!">2</a></li>
        <li class="waves-effect"><a href="#!">3</a></li>
        <li class="waves-effect"><a href="#!">4</a></li>
        <li class="waves-effect"><a href="#!">5</a></li>
        <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
      </ul>

      */

      let pgnUl = $('<ul>').addClass('pagination')

      let pgnLeftLi = $('<li>').addClass('disabled')
      let pgnLeftA = $('<a>').attr('href','#!')
      let pgnLeftI = $('<i>').addClass('material-icons').text('chevron_left')

      let pgnNumLi = $('<li>') //.addClass("waves-effect") //alt class: .addClass('active')
      let pgnNumA = $('<a>').attr('href','#!') //.text(`${valNum}`)

      let pgnRightLi = $('<li>').addClass('waves-effect')
      let pgnRightA = $('<a>').attr('href','#!')
      let pgnRightI = $('<i>').addClass('material-icons').text('chevron_right')

      //build paginator
      pgnLeftA.append(pgnLeftI)
      pgnLeftLi.append(pgnLeftA)

      pgnRightA.append(pgnRightI)
      pgnRightLi.append(pgnRightA)

      pgnUl.append(pgnLeftLi)

      for(let i=1; i <= 3; i++) {
        let li;
        if(i===1) {
          li = $('<li>').addClass('active')
            .append($('<a>').attr('href','#!').text(`${i}`) )
        } else {
          li = $('<li>').addClass('waves-effect')
            .append($('<a>').attr('href','#!').text(`${i}`) )
        }
        pgnUl.append(li)
      }

      pgnUl.append(pgnRightLi)

      //console.log("first: ", pgnUl.find('li').first()[0])
      //pgnUl.find('li').first().addClass('active')
      $('#pgn-container').append(pgnUl[0])


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
      return $http.get('/api/boxes')
        .then(function(response) {
          console.log("allBoxes: ", response.data)
          vm.allBoxes = response.data;
          vm.getPage(vm.iPage)
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
      console.log("entered post update", box)
      updateService.box = box
      $state.go('edit')
    }
    //$http.patch('/api/boxes/' + updateService.box.id, newBox)
    vm.delete = function(box) {
      console.log("enter post delete")
      $http.delete('/api/boxes/'+box.id)
        .then(function() {
          vm.getBoxes()
        })
        .catch(function() {
          console.log("post.component.js get fail")
        })
    }

  }
}());
