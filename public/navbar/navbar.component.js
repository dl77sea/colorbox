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
      <footer class="page-footer">
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
     <h4>Sign In</h4>
     <div class="container">
  <div class="row">

    <form id="signin-form" class="col s12">

      <div class="row">
        <div class="col s12"></div>
        <div class="input-field">
          <input id="email" type="text" class="validate">
          <label for="email">email</label>
        </div>
        <div class="col s12"></div>
        <div class="input-field">
          <input id="password" type="password" class="validate">
          <label for="password">password</label>
        </div>
      </div>


      <div class="center-align">
        <button class="btn waves-effect waves-light blue" type="submit" name="action">sign in</button>
        <p id="info-text" class="center-align">Please sign in or <a href="signup.html">sign up</a></p>

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
  function controller() {
    const vm = this
    console.log("navbar controller")

    vm.$onInit = function() {
      console.log("init navbar")

      $(document).ready(function() {
        // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();
      });

      $("#signin-form").submit(function (e) {

        let email = $("#email").val().trim();
        let password = $("#password").val().trim();
        console.log(email, password)
      });



    };
  }

}());
