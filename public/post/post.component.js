(function() {
  //module('myModule', ['hl.sticky']);
  angular.module('app')
    .component('post', {
      // bindings: {
      //   // person: '<',
      //   onSave: '&' // this allows an outer component to pass in a function, basically
      // },
      controller: controller,
      bindings: {'bSignedin': '<'},
      template: `
      <ng-include src="'./post/post.template.html'"></ng-include>
      `
    })
    /*

                <!-- <div style="width: 100%; line-height: 0">
                  <p style="margin-bottom: 0">{{ box.email }}</p>

                  <div style="float: right" ng-if="box.self == true">
                    <a ng-click="$ctrl.update(box)" style="display: inline-block">edit</a>
                    <a ng-click="$ctrl.delete(box)" style="display: inline-block">delete</a>
                  </div>
                </div>-->

*/
    //this is used because it is called when the canvas is available in dom,
    //so then it becomes possible to call $ctrl.genBox(box, canvas),
    //as genBox() needs a canvas element in the dom to work.
    .directive('canvasInit', function() {
      return {
        template: `
          <canvas class="canvas-style">
          </canvas>
        `,
        link: function($scope, element, attrs) {
          /*
          let canvas = element[0];
          $scope.$parent.$ctrl.genBox($scope.box, canvas)
          */
          let canvas = element.find('canvas')[0];

          $scope.$watch('box', function(newValue, oldValue) {
            $scope.$parent.$ctrl.genBox(newValue, canvas)
          });

          //needed for materialize modal stuff to work
          $(document).ready(function() {
            // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
            $('.modal').modal();
          });

          //style ui-view under body to fill up whole body - should this be ng-style?
          $("#body-ui").css("height", "100%");
        },
      }
    })
    .directive('paginator', function() {
      return {
        template: `
          <ul id="pgn-ul" ng-if="$ctrl.numPages > 1" class="pagination">
            <li class="disabled"><a><i class="material-icons">chevron_left</i></a></li>

            <li ng-repeat="i in [].constructor($ctrl.numPages) track by $index" class="waves-effect"
              ng-class="{active: $ctrl.updateService.iPage === $index}" ng-click="$ctrl.loadPage($index)">
              <a>{{$index+1}}</a>
            </li>

            <li class="waves-effect"><a><i class="material-icons">chevron_right</i></a></li>
          </ul>
          `,
        /*
ng-class="{active: $ctrl.activeButton === 'list'}
          <li ng-repeat="x in products" ng-click="toggleSelection(x)"
            ng-style="{ 'class' : ({{x.alreadyTook}}) ? 'active' : 'waves-effect' }">{{x.item}}
          </li>

                      <li class="active"><a href="#!">1</a></li>
                      <li class="waves-effect"><a href="#!">2</a></li>
*/
        link: function($scope, element, attrs) {
          console.log('hello from paginator')
        },
      }
    });



  controller.$inject = ['$state', '$http', 'authService', 'updateService', '$scope'];

  function controller($state, $http, authService, updateService, $scope) {
    // function controller() {
    const vm = this
    console.log("post init bSignedin: ",  vm.bSignedin)

    $scope.$on('authChange', function(e, obj) {vm.getBoxes()})

    vm.updateService = updateService
    console.log("hello from post controller")
    //this value is used by edit.component.js to determine if a box is being updated or created new
    updateService.box = null;

    vm.formMode = "signin"
    vm.loginMode = "siginedout"

    vm.email = null;
    vm.password = null;

    vm.$onInit = function() {
      console.log("hello from post onInit")
      // updateService.iPage = 0;
      vm.numPages = null;
      vm.prevNumPages = null;
      vm.curBoxes = [];
      /*
      vm.allBoxes = vm.getBoxes() //would this work with async?
      console.log("from init vm.allBoxes ", vm.allBoxes.$$state.) //how to unpack promise?
      */

      //populate vm.allBoxes and get page from getBoxes.then
      vm.numItems = 6;
      vm.getBoxes()


      // vm.getPage(updateService.iPage)
    }

    // vm.submit = function() {
    //   // this line says
    //   //   call the passed in function..
    //   //   and where it asked for `savedPerson`, pass in `vm.person`
    //   vm.onSave({
    //     vm.test();
    //   })
    // }


    vm.loadPage = function(iPage) {
      console.log("loadPage index from loadPage: ", iPage)

      updateService.iPage = iPage

      let i;
      // vm.curBoxes=[];
      const newBoxes = [];
      //is there an "angular way" to keep this from updating one by one in real time in view
      for (i = 0; i < vm.numItems; i++) {

        if (vm.allBoxes[i + (vm.numItems * iPage)] !== undefined) {
          newBoxes.push(vm.allBoxes[(iPage * vm.numItems) + i]);
          // vm.curBoxes.push(vm.allBoxes[(iPage * vm.numItems) + i])
          // console.log("from loadPage for: ", vm.curBoxes[i].id)
        }
      }

      vm.curBoxes = newBoxes;

      console.log("vm.curBoxes from loadPage: ", vm.curBoxes);
    }


    //figure out an "angular way" to do this:
    //this gets called on init when items are more than fit on one page.
    //this gets called on calls to post if items fit exceed current pages.
    //this gets called on calls to delete if items require less fit current pages.
    //this does not get called on calls to patch.
    // vm.buildPaginator = function() {
    //   $('#pgn-container').empty()
    //
    //   let pgnUl = $('<ul>').addClass('pagination').attr('id', 'pgn-ul')
    //
    //   let pgnLeftLi = $('<li>').addClass('disabled')
    //   let pgnLeftA = $('<a>').attr('href', '#!')
    //   let pgnLeftI = $('<i>').addClass('material-icons').text('chevron_left')
    //
    //   let pgnNumLi = $('<li>') //.addClass("waves-effect") //alt class: .addClass('active')
    //   let pgnNumA = $('<a>').attr('href', '#!') //.text(`${valNum}`)
    //
    //   let pgnRightLi = $('<li>').addClass('waves-effect')
    //   let pgnRightA = $('<a>').attr('href', '#!')
    //   let pgnRightI = $('<i>').addClass('material-icons').text('chevron_right')
    //
    //   //build paginator
    //   pgnLeftA.append(pgnLeftI)
    //   pgnLeftLi.append(pgnLeftA)
    //
    //   pgnRightA.append(pgnRightI)
    //   pgnRightLi.append(pgnRightA)
    //
    //   pgnUl.append(pgnLeftLi)
    //
    //   //add number of pages needed for current load in allBoxes
    //   for (let i = 1; i <= vm.numPages; i++) {
    //     let li;
    //     if (i === 1) {
    //       li = $('<li>').addClass('active')
    //         .append($('<a>').attr('href', '#!').text(`${i}`))
    //     } else {
    //       li = $('<li>').addClass('waves-effect')
    //         .append($('<a>').attr('href', '#!').text(`${i}`))
    //     }
    //     pgnUl.append(li)
    //   }
    //
    //   //event handler for this paginator
    //   // $scope.$watch('box', function(newValue, oldValue) {
    //   //   $scope.$parent.$ctrl.genBox(newValue, canvas)
    //   // });
    //
    //   pgnUl.on('click', 'li', function() {
    //     let $curEle = $(this);
    //     let i = $(this).index()
    //     console.log(i)
    //     console.log(vm.numPages)
    //
    //     if (i === 0) {
    //       //paging left
    //       console.log("page left")
    //     } else if (i === vm.numPages + 1) {
    //       //paging right
    //       console.log("page right")
    //     } else {
    //       //load requested page
    //       console.log("load page")
    //
    //       let prevEle = $("#pgn-ul").find("li").eq(vm.prevPage)
    //
    //       prevEle.removeClass('active').addClass('waves-effect')
    //       $curEle.addClass('active')
    //       updateService.iPage = i - 1;
    //       vm.prevPage = i;
    //       vm.loadPage(updateService.iPage)
    //     }
    //   })
    //
    //   pgnUl.append(pgnRightLi)
    //   // pagination
    //   // $('#pgn-container').append(pgnUl[0])
    // }
    //
    // vm.formSubmit = function() {
    //   console.log("formSubmit from post")
    //   authService.formSubmit(vm.email, vm.password, vm.formMode)
    //     .then(function(response) {
    //
    //       if (response.success === true) {
    //         vm.formMode = response.formMode;
    //         vm.loginMode = response.loginMode;
    //         console.log("now logged in")
    //       }
    //     })
    //     .catch(function(response) {
    //       console.log("signup error")
    //     })
    // }
    //
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

      scene.clearColor = new BABYLON.Color3(1, 1, 1);

      let camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 120, new BABYLON.Vector3.Zero(), scene);
      camera.setPosition(new BABYLON.Vector3(50, 50, -100));
      // camera.position.x = 0;
      // camera.position.z = 50;
      // camera.position.z = 0;

      // This attaches the camera to the canvas
      // camera.attachControl(canvas, false);

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

    vm.getBoxes = function(typeOp = updateService.typeOp) {
      //load up all the boxes to front end but do not render them.
      //rendering will be front-end paginated
      $http.get('/api/boxes')
        .then(function(response) {
          console.log("allBoxes: ", response.data)
          console.log("vm.curBoxes from get: ", vm.curBoxes)
          vm.allBoxes = response.data



          //update paginator if total num of boxes exceeds fitting on one page
          vm.numPages = Math.ceil(vm.allBoxes.length / vm.numItems)

          //load whatever page needs to be loaded (0 defualt)
          switch (typeOp) {
            case "init":
              vm.loadPage(updateService.iPage)
              break;
            case "editAdd":
              if (updateService.prevAllBoxesLen === vm.allBoxes.length) {
                console.log("this happened1")
                vm.loadPage(updateService.iPage)
              } else {
                console.log("this happened2")
                updateService.iPage = (vm.numPages - 1)
                vm.loadPage(updateService.iPage)
              }
              break;
            case "del":
              if( (vm.allBoxes.length+1) - (updateService.iPage*vm.numItems) === 1) {
                updateService.iPage = (updateService.iPage - 1)
                vm.loadPage(updateService.iPage)
              } else {
                vm.loadPage(updateService.iPage)
              }

              break;

            default:
              // code block
          }

          updateService.prevAllBoxesLen = vm.allBoxes.length

          // //if current screen is full, go to last page
          // if( (updateService.iPage+1)*vm.numItems - vm.allBoxes.length === 0) {
          //   updateService.iPage = (vm.numPages-1)
          //   vm.loadPage(updateService.iPage)
          // }
        })
    }

    vm.launchEditor = function() {
      console.log("launchEditor bSignedin: ",  vm.bSignedin)
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

    vm.delete = function(box) {
      console.log("enter post delete")
      $http.delete('/api/boxes/' + box.id)
        .then(function() {
          updateService.typeOp = "del"
          vm.getBoxes()
        })
        .catch(function() {
          console.log("post.component.js get fail")
        })
    }

  }
}());
