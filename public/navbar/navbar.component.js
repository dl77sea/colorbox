(function() {
  angular.module('app')
    .component('navbar', {
      controller: controller,
      template: `

      <div class="ui-view-expander">
      <header>
        <nav>
          <div class="nav-wrapper">
            <a ui-sref="posts" class="brand-logo">Logo</a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
              <li><a href="snarf1.html">Snarf1</a></li>
              <li><a href="snarf2.html">Snarf2</a></li>
              <li><a href="snarf3.html">Snarf3</a></li>
            </ul>
          </div>
        </nav>
      </header>

        <main>
          <div class="container">
            <div id="boxgrid" class="row">
            <ui-view></ui-view>
            </div>
          </div>
        </main>

      <footer class="page-footer">
                <div class="container">
                  <div class="row">
                    <div class="col l6 s12">
                      <h5 class="white-text">Footer Content</h5>
                      <p class="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
                    </div>
                    <div class="col l4 offset-l2 s12">
                      <h5 class="white-text">Links</h5>
                      <ul>
                        <li><a class="grey-text text-lighten-3" href="#!">Link 1</a></li>
                        <li><a class="grey-text text-lighten-3" href="#!">Link 2</a></li>
                        <li><a class="grey-text text-lighten-3" href="#!">Link 3</a></li>
                        <li><a class="grey-text text-lighten-3" href="#!">Link 4</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="footer-copyright">
                  <div class="container">
                  © 2014 Copyright Text
                  <a class="grey-text text-lighten-4 right" href="#!">More Links</a>
                  </div>
                </div>
              </footer>
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
    };
  }

}());
