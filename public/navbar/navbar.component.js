(function() {
  angular.module('app')
    .component('navbar', {
      controller: controller,
      template: `
      <header>
        <div class="navbar-fixed">
          <nav>
            <div class="nav-wrapper">
              <a ui-sref="posts" class="brand-logo">Logo</a>
              <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li>
                  <a class="modal-trigger" href="#modal-signinup">Sign in</a>
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

      <!-- <footer class="page-footer"> -->
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

  controller.$inject = ['authService'];
  // function controller($state, $http, $stateParams) {
  function controller($state, $http, $stateParams) {
    const vm = this
    console.log("navbar controller")

    vm.$onInit = function() {
      console.log("init navbar")
      //needed for materialize modal stuff to work
      $(document).ready(function() {
        // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
      });
    }
  }
  
}());
