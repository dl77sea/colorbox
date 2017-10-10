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
                  <a class="modal-trigger" href="#modal-signin">Sign in</a>
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

 <!-- Sign in Modal -->
 <div id="modal-signin" class="modal">
   <div class="modal-content">
     <h4 ng-if="$ctrl.formMode=='signin'">Sign In</h4>
     <h4 ng-if="$ctrl.formMode=='signup'">Sign Up</h4>
     <div class="container">
  <div class="row">

    <form ng-submit="$ctrl.formSubmit()" id="signin-form" class="col s12">

      <div class="row">
        <div class="col s12"></div>
        <div class="input-field">
          <input ng-model="$ctrl.email" id="email" type="text" class="validate" required>
          <label for="email">email</label>
        </div>
        <div class="col s12"></div>
        <div class="input-field">
          <input ng-model="$ctrl.password" id="password" type="password" class="validate" required>
          <label for="password">password</label>
        </div>
      </div>

      <div ng-if="$ctrl.formMode=='signin'" class="center-align">
        <button class="btn waves-effect waves-light blue" type="submit" name="action">sign in</button>
        <p id="info-text" class="center-align">Please sign in or <a ng-click="$ctrl.formMode='signup'" href="signup.html">sign up</a></p>
      </div>

      <div ng-if="$ctrl.formMode=='signup'" class="center-align">
        <button class="btn waves-effect waves-light blue" type="submit" name="action">sign up</button>
        <p id="info-text" class="center-align">Please sign up or <a ng-click="$ctrl.formMode='signin'" href="signup.html">sign in</a></p>
      </div>

    </form>
  </div>
</div>
   </div>
 </div>
      `
    })
  // controller.$inject = ['$state', '$http', '$stateParams'];
  // function controller($state, $http, $stateParams) {
  function controller($state, $http, $stateParams) {
    const vm = this
    console.log("navbar controller")

    vm.$onInit = function() {
      console.log("init navbar")

      vm.formMode = "signin"
      vm.email = null;
      vm.password = null;

      //needed for materialize modal stuff to work
      $(document).ready(function() {
        // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
      });
    };

    vm.formSubmit = function() {
      console.log("formSubmit")

      let data = {
        email: vm.email,
        password: vm.password
      }

      if(vm.formMode === "signin") {
        vm.formSubmitSignin(data);
      }

      if(vm.formMode === "signup") {
        vm.formSubmitSignup(data);
      }
    }

    vm.formSubmitSignin = function (data) {
      //verify submitted login
      $http.post('/api/users/signin', data)
        //200s go here
        .then(function success(response) {
          console.log("form signin success")
        })
        //others go here
        .catch(function error(response) {
          console.log("form signin fail")
          //status code in response.status
          //status message in response.data
        })
    }

    vm.formSubmitSignup = function (data) {
      //verify submitted login
      $http.post('/api/users/signup', data)
        //200s go here
        .then(function success(response) {
          console.log("form signup success")
          console.log(response)
        })
        //others go here
        .catch(function error(response) {
          console.log("form signup fail")
          console.log(response)
          //status code in response.status
          //status message in response.data
        })
    }


  }

}());
