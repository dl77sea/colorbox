(function() {
  angular.module('app')
    .component('navbar', {
      controller: controller,
      template: `
      <header>
        <div class="navbar-fixed">
          <nav>
            <div class="nav-wrapper">
              <a ui-sref="posts" class="brand-logo">BoxEZ</a>
              <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li>
                  <a ng-if="$ctrl.loginMode=='signedout'" class="modal-trigger" href="#modal-auth">Sign in</a>
                  <a ng-if="$ctrl.loginMode=='signedin'" ng-click="$ctrl.signOut()">Sign out</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
      <main>
        <div class="container" style="transform: translate(0,0); height: 100%">
          <ui-view></ui-view>
        </div>
      </main>
      <!--
      <footer class="page-footer footer-fixed">
        <div class="footer-fixed">
          <div class="footer-copyright">
            <div class="container">
              © 2014 Copyright Text
              <a class="grey-text text-lighten-4 right" href="#!">More Links</a>
            </div>
          </div>
        </div>
      </footer>
      -->
      <ng-include src="'./modals/auth.template.html'" modal-init></ng-include>
      `
    })
    .directive('modalInit', function() {
      return {
        link: function($scope, element, attrs) {
          // let canvas = element[0];
          //
          // $scope.$parent.$ctrl.genBox($scope.box, canvas)

          //needed for materialize modal stuff to work
          $(document).ready(function() {
            // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
            $('.modal').modal();
          });
        }
      }
    });

  controller.$inject = ['$state', '$http', 'authService', '$scope'];

  function controller($state, $http, authService, $scope) {

    const vm = this
    console.log("navbar controller: ", authService)

    vm.user = null;
    vm.password = null;

    vm.$onInit = function() {
      console.log("init navbar")

      //check if user logged in (token valid) might not need to leave this in navbar?
      $http.get('/api/users/auth')
        .then(function(response) {
          console.log("auth success", response)
          vm.loginMode = "signedin"
          $scope.$emit('eventName', { message: "msg" });
        })
        .catch(function(response) {
          console.log("auth fail")
          console.log(response)
          vm.loginMode = "signedout"
          vm.formMode = "signin"
        })
    }

    vm.signOut = function() {
      console.log("sign out")
      $http.delete('/api/users/auth')
        .then(function(response) {
          vm.formMode = "signin"
          vm.loginMode = "signedout"
          console.log("signed out success")
        })
        .catch(function(response) {
          alert(response.data)
        })
    }
    vm.clearInputs = function () {
        vm.formMessage=null;
        vm.user = null;
        vm.password = null;
        $('#user').removeClass('active')
        $('#password').removeClass('active')
    }

    vm.formSubmit = function() {
      console.log("enter navbar formSubmit")
      authService.formSubmit(vm.user, vm.password, vm.formMode)
        .then(function(response) {
          if (response.success === true) {
            console.log("now logged in")

            console.log(response)
            //happens when sign in or signup succeeds
            vm.formMode = response.formMode;
            vm.loginMode = response.loginMode;
            vm.formMessage = response.formMessage;
            if(vm.formMessage == 'sigininsuc') { vm.clearInputs(); }
          } else {
            //happens when signup fails
            console.log("this happens instead of catch")
            vm.formMessage = response.formMessage;
          }
        })
        // //why does this catch not happen when app.config.js goes into catch?
        // .catch(function(response) {
        //   console.log("auth error")
        //   // console.log(response)
        //   vm.formMessage = response.formMessage;
        //   // vm.loginMode = response.loginMode;
        // })
    }

  }

}());
