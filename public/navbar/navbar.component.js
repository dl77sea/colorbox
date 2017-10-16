(function() {
  angular.module('app')
    .component('navbar', {
      controller: controller,
      template: `
      <header>
        <div class="navbar-fixed">
          <nav>
            <div class="nav-wrapper">
              <a ui-sref="posts" class="brand-logo">Boxes</a>
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

        <div class="container">
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

  controller.$inject = ['$state', '$http', 'authService'];

  function controller($state, $http, authService) {

    const vm = this
    console.log("navbar controller: ", authService)

    vm.email = null;
    vm.password = null;

    vm.$onInit = function() {
      console.log("init navbar")

      //check if user logged in (token valid) might not need to leave this in navbar?
      $http.get('/api/users/auth')
        .then(function(response) {
          console.log("auth success", response)
          vm.loginMode = "signedin"
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

    vm.formSubmit = function() {
      console.log("enter navbar formSubmit")
      authService.formSubmit(vm.email, vm.password, vm.formMode)
        .then(function(response) {
          if (response.success === true) {
            console.log("enter navbar formSubmit success")
            console.log(response)
            vm.formMode = response.formMode;
            vm.loginMode = response.loginMode;
          }
        })
        .catch(function(response) {
          console.log("auth error")
        })
    }

  }

}());
