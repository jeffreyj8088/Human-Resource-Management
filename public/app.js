var app = angular.module('employeeApp',['ngRoute','ngAnimate','ui.bootstrap','ngFileUpload']);

app.config(function($routeProvider) {

  $routeProvider.when('/home', {
    templateUrl: 'views/home.html',
    controller: 'empCtrl'
  })
  .when('/detail/:empID/:loc', {
    templateUrl: 'views/detail.html',
    controller: 'detailCtrl'
  })
  .when('/reports/:reportStr', {
    templateUrl: 'views/direcReport.html',
    controller: 'direRepCtrl'
  })
  .when('/new/', {
    templateUrl: 'views/forms.html',
    controller: 'newCtrl'
  })
  .when('/edit/:empID', {
    templateUrl: 'views/forms.html',
    controller: 'editCtrl'
  })
  .otherwise({ redirectTo: '/home' });

});

app.directive('infiniteScroll', [
    '$rootScope',
    '$window',
    function($rootScope, $window) {
      return {
        link: function(scope, elem, attrs) {

          var scrollEnabled, loadData, scrollTrigger = .90,scrollEnabled = true;;
          $window = angular.element($window);
          if (attrs.infiniteNoScroll != null) {
             scope.$watch(attrs.infiniteNoScroll, function(value) {
               scrollEnabled = (value == true) ? false : true;
             });
          }

          if ((attrs.infiniteScrollTrigger != undefined) && (attrs.infiniteScrollTrigger > 0 && attrs.infiniteScrollTrigger <100) ) {
              scrollTrigger = attrs.infiniteScrollTrigger/100;
          }

          loadData = function() {
              var wintop = window.pageYOffset;
              var docHeight = window.document.body.clientHeight;
              var windowHeight = window.innerHeight;
              var triggered = (wintop/(docHeight - windowHeight));

              if((scrollEnabled) && (triggered >= scrollTrigger) ){
                 return scope.$apply(attrs.infiniteScroll);
              }
            };

          $window.on('scroll', loadData);
          scope.$on('$destroy', function() {
              return $window.off('scroll', loadData);
          });
        }
      };
    }
]);