(function() {
  //module('myModule', ['hl.sticky']);
  angular.module('app')
    .component('post', {
      controller: controller,
      template: `
      <a ng-click="$ctrl.test()">posts</a>
      <div id="boxes" class="row">
        <div class="post-div col s2 m4 l4" ng-repeat="box in $ctrl.curBoxes">
          <p>{{ box.color }}</p>
          <canvas id={{box.id}} class="canvas-style" canvas-init></canvas>
        </div>
      </div>
      <a ng-click="$ctrl.launchEditor()">create</a>
      <ng-include src="'./modals/auth.template.html'"></ng-include>
      `
    })

    // controller.$inject = ['$state', '$http', '$stateParams'];
    // controller.$inject = ['hl.sticky'];

    //this is used because it is called when the canvas is available in dom,
    //so then it becomes possible to call $ctrl.genBox(box, canvas),
    //as genBox() needs a canvas element in the dom to work.
    .directive('canvasInit', function() {
      return {
        link: function($scope, element, attrs) {
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
  controller.$inject = ['$state', '$http', 'authService'];
  function controller($state, $http, authService) {
    // function controller() {
    const vm = this

    // vm.formMode = authService.formMode;
    vm.formMode = "signin"

    vm.email = null;
    vm.password = null;

    console.log("navbar controller")

    vm.$onInit = function() {
      //needed for materialize modal stuff to work
      $(document).ready(function() {
        // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
      });

      vm.allBoxes = [

        {
          color: "box01"
        },
        {
          color: "box02"
        },
        {
          color: "box03"
        },
        {
          color: "box04"
        },
        {
          color: "box05"
        },
        {
          color: "box06"
        },
        {
          color: "box07"
        },
        {
          color: "box08"
        },
        {
          color: "box09"
        },
        {
          color: "box10"
        },
        {
          color: "box11"
        },
        {
          color: "box12"
        },
        {
          color: "box13"
        },
        {
          color: "box14"
        },
        {
          color: "box15"
        },
        {
          color: "box16"
        },
        {
          color: "box17"
        },
        {
          color: "box18"
        },
        {
          color: "box19"
        },
        {
          color: "box20"
        },
        {
          color: "box21"
        },
        {
          color: "box22"
        },
        {
          color: "box23"
        },
        {
          color: "box24"
        },
        {
          color: "box25"
        },
        {
          color: "box26"
        },
        {
          color: "box27"
        },
        {
          color: "box28"
        },
        {
          color: "box29"
        },
        {
          color: "box30"
        },
        {
          color: "box31"
        },
        {
          color: "box32"
        },
        {
          color: "box33"
        },
        {
          color: "box34"
        },
        {
          color: "box35"
        },
        {
          color: "box36"
        }

      ]

      // vm.getBoxes();
      // console.log(document.getElementById("2"))

      //pagination index
      vm.iPgn = 0;

      //used to calculate scroll pagination.
      vm.headerHeight = 64;
      vm.topSpacerHeight = 0;
      vm.boxDivHeight = 316;

      vm.pgnThresh = 100; //vm.headerHeight + vm.topSpacerHeight + (2*vm.boxDivHeight);
      vm.numItems = 3;
      vm.pageYOffsetAcm = 0;
      vm.prevPageYOffset = 0;
      //slice from index to nth item (+3 for initialization)
      vm.iFrom = vm.iPgn / vm.pgnThresh * vm.numItems;
      vm.iTo = vm.iFrom * vm.numItems + vm.numItems;
      vm.curBoxes = vm.allBoxes.slice(vm.iFrom, vm.iTo + 6);



      console.log("from to: ", vm.iFrom, vm.iTo)

      //put a listener on scroll event to update pagination
      window.addEventListener('scroll', function(e) {
        console.log(vm.pageYOffsetAcm)
        // console.log("scrolling: window.pageYOffset: ", window.pageYOffset)
        // console.log("scrolling: vm.pageYOffsetAcm: ", vm.pageYOffsetAcm)
        vm.pageYOffsetAcm += window.pageYOffset - vm.prevPageYOffset;
        vm.prevPageYOffset = window.pageYOffset;

        //on large screens:
        //when scrolling past 2 rows, delete two rows, load up two more (6 items).
        if (Math.abs(vm.pageYOffsetAcm - vm.iPgn) >= vm.pgnThresh) {
          //300, 600, 900
          //if scrolling down
          console.log("down: vm.iPgn: ", vm.iPgn)
          if (vm.pageYOffsetAcm > vm.iPgn) {
            vm.iPgn += vm.pgnThresh
            vm.prevPageYOffset = 0; //reset bc scroll height of window stays same when new stuff added (Since onld stuff deleted)
            vm.updatePage(1);
          } else {
            //if scrolling up
            vm.iPgn -= vm.pgnThresh
            vm.updatePage(-1);
          }
        }

      })
    };

    vm.formSubmit = function() {
      console.log("enter vm.formSubmit: ")
      console.log("vm.email: ", vm.email)
      authService.formSubmit(vm.email, vm.password, vm.formMode)
        .then(function(response) {
          console.log(response)
        })
        .catch(function(response) {
          console.log("catch")
        })

    }

    //called when first two rows of loaded boxes goes off screen
    vm.updatePage = function(direction) {
      if (direction === 1) {
        // console.log("down iPgn: ", vm.iPgn)
        // console.log("down");
        let boxes = document.getElementById("boxes");
        let boxesChildren = document.getElementById("boxes").children;

        for (let i = 0; i < vm.numItems; i++) {
          boxes.removeChild(boxesChildren[0]);
        }
        //jquery this for now.. figure out how to replace with angular-correct way
        /*
        <div class="post-div col s2 m4 l4" ng-repeat="box in $ctrl.curBoxes">
          <p>{{ box.color }}</p>
          <canvas id={{box.id}} class="canvas-style" canvas-init></canvas>
        </div>
        */
        for (i = 0; i < vm.numItems; i++) {
          // console.log("vm.iPgn: ", vm.iPgn)
          // console.log("vm.iPgn/vm.pgnThresh: ", vm.iPgn/vm.pgnThresh)
          let iAllBoxes = vm.iPgn / vm.pgnThresh * vm.numItems + i;
          let div = $('<div>').addClass("post-div col s2 m4 l4")
          let p = $('<p>').text(vm.allBoxes[iAllBoxes + 6].color)
          let canvas = $('<canvas>')
          div.append(p);
          div.append(canvas);
          canvas.addClass('canvas-style');
          $("#boxes").append(div);
          vm.genBox(vm.allBoxes[iAllBoxes + 6], canvas[0]);
        }
      } else {
        console.log("up")
      }
      //delete first six loaded boxes
      //load next six boxes
    }

    /*
        const flexColDiv = $('<div>').addClass('helper-flex-col');
          const rightIcon = $('<i>').addClass('circle-right material-icons').text('account_circle');
          flexColDiv.append(rightIcon);

          if (name) {
            const messageIcon = $('<i>').addClass('material-icons helper-icon').text('message');
            const helperNameP = $('<p>').text(name).attr('id','helperName')
            flexDiv.append(messageIcon);
            flexColDiv.append(helperNameP)
          } else {
            rightIcon.addClass('grey-text text-lighten-2')
          }

          flexDiv.append(flexColDiv);
          rightItemDiv.append(flexDiv);
          avatarDiv.append(rightItemDiv);
    */

    vm.test = function() {
      console.log("snarfff")
    }
    //generate box from parameters from box description from database
    vm.genBox = function(box, canvas) {
      // console.log("cur box", box)
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
      //load up all the boxes to front end but do not render them.
      //rendering will be front-end paginated
      // (todo: paginate this load)

      //request this endpoint from server.js
      $http.get('/api/boxes').then(function(response) {
        vm.boxes = response.data;
      })
    }

    // $.getJSON('/token')
    //   .then((result) => {
    //     if (result.length > 0) {
    //
    //       $('#current_user').text("Currently logged in: " + result[0].email)
    //     } else {
    //       $('#current_user').text("")
    //     }
    //   })
    //   .catch((err) => {
    //     Materialize.toast('Please login' + err.responseText, 3000);
    //   })

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
          $('#modal-signinup').modal('open')
        })
    }

  }

}());
