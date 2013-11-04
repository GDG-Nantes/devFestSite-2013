/** 
 * Application 
 */
var devfestApp = angular.module('devfest', []);


/** 
 *ROUTE Provider 
 */
devfestApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/homepage', {templateUrl: 'partials/homepage.html',   controller: 'NavigationCtrl'}).
      when('/sessions', {templateUrl: 'partials/sessions.html', controller: 'SessionsCtrl'}).
      when('/speakers', {templateUrl: 'partials/speakers.html', controller: 'SpeakersCtrl'}).
      when('/agenda', {templateUrl: 'partials/agenda.html', controller: 'AgendaCtrl'}).
      when('/sponsors', {templateUrl: 'partials/sponsors.html', controller: 'NavigationCtrl'}).
      when('/contacts', {templateUrl: 'partials/contacts.html', controller: 'NavigationCtrl'}).
      when('/credits', {templateUrl: 'partials/credits.html', controller: 'EmptyCtrl'}).
      when('/presse', {templateUrl: 'partials/presse.html', controller: 'EmptyCtrl'}).
      when('/cfp', {templateUrl: 'partials/cfp.html', controller: 'NavigationCtrl'}).
      when('/subscribe', {templateUrl: 'partials/subscribe.html', controller: 'NavigationCtrl'}).
      //when('/afterparty', {templateUrl: 'partials/afterparty.html', controller: 'EmptyCtrl'}).
      otherwise({redirectTo: '/homepage'});
}]);

/** 
 * Navigation controller (manage navigation bar) 
 */
devfestApp.controller('NavigationCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
  
  var DEFAULT = null;
  var ACTIVE = 'active';
    
  $scope.$on('$routeChangeSuccess', function(event, current, previous) { 
    if ((current.templateUrl === 'partials/sessions.html'
      || current.templateUrl === 'partials/speakers.html')
      && Object.keys(current.params).length > 0){
      for (var i = 0; i < $rootScope.navItems.length; i++){
        if ($rootScope.navItems[i].template === current.templateUrl){
          $rootScope.select($rootScope.navItems[i]);
        }
      }
    }
  });

  $scope.isIE = navigator.userAgent && navigator.userAgent.indexOf('MSIE') != -1;
  
  function getLocationItem(navItems, location) {
    for (var i = 0; i < navItems.length; i++) {
      if (location == navItems[i].url) {
        return navItems[i];
      }
    }
    return navItems[0];
  }

  // Url of the sponsor document
  $rootScope.urlPartenariat = "http://drive.google.com/uc?export=download&id=0Bx5mRU2mXdx0ZkdUWFlRWFFRcWs";
  $rootScope.urlDocPresse = "http://drive.google.com/uc?export=download&id=0Bx5mRU2mXdx0YWRRUkVOb3o1Tk0";

  // Manage the navigation
  $rootScope.navItems = [ {'label' : 'Accueil', 'url' : '/homepage', 'style': {}, 'template' : 'partials/homepage.html'  }, 
                      {'label' : 'Inscription', 'url' : '/subscribe', 'style': {}, 'template' : 'partials/subscribe.html' }, 
                      {'label' : 'Sessions', 'url' : '/sessions', 'style': {}, 'template' : 'partials/sessions.html' },
                      {'label' : 'Speakers', 'url' : '/speakers', 'style': {}, 'template' : 'partials/speakers.html' },
                      //{'label' : 'CFP', 'url' : '/cfp', 'style': {} },
                      {'label' : 'Agenda', 'url' : '/agenda', 'style': {}, 'template' : 'partials/agenda.html' },
                      {'label' : 'Sponsors', 'url' : '/sponsors', 'style': {}, 'template' : 'partials/sponsors.html' },
                      {'label' : 'Pratique', 'url' : '/contacts', 'style': {}, 'template' : 'partials/contacts.html' },
                      //{'label' : 'After Party', 'url' : '/afterparty', 'style': {} },
                      {'label' : 'Presse', 'url' : '/presse', 'style': {}, 'template' : 'partials/presse.html'} ];
  
  $rootScope.selected = getLocationItem($rootScope.navItems, $location.path());

  $rootScope.select = function( item ) {
    // Select the navigation item for the selected page
    if( $rootScope.selected )
      $rootScope.selected.style['class'] = DEFAULT; //$rootScope.selected.style.class = DEFAULT;//$rootScope.select.setAttribute("class",DEFAULT);
    $rootScope.selected = item;
    $rootScope.selected.style['class'] = ACTIVE;//$rootScope.selected.style.class = ACTIVE;//$rootScope.select.setAttribute("class",ACTIVE);
    // Hide the sponsor div in the sponsor page
    if (item.url == '/sponsors') {
        $rootScope.sponsorpage = true;
    } else {
        $rootScope.sponsorpage = false;
    }
  };
  
  // Select the current page to the navigation bar
  $rootScope.select($rootScope.selected );
}]);

/** 
 * Speakers controller 
 */
devfestApp.controller('SpeakersCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $http.get('json/sessions.json').success(function(data) {
    if ($location.search().speakerId){
      $scope.speakers = [];
      for (var i=0; i < data.speakers.length; i++){
        if (data.speakers[i].id === $location.search().speakerId){
          $scope.speakers.push(data.speakers[i]);
        }
      }
    }else{
      $scope.speakers = data.speakers;
    }
  });
}]);

/** 
 * Sessions controller 
 */
devfestApp.controller('SessionsCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
	$http.get('json/sessions.json').success(function(data) {
    $scope.speakers = data.speakers;
    $scope.agendaTimes = data.agendaTimes;
    $scope.hideFilters = $location.search().sessionId;
    if ($location.search().sessionId){
      $scope.sessions = [];
      for (var i=0; i < data.sessions.length; i++){
        if (data.sessions[i].id === +$location.search().sessionId){
          $scope.sessions.push(data.sessions[i]);
        }
      }
    }else{
      $scope.sessions = data.sessions;
    }
  });
}]);

/** 
 * Sessions Detail controller 
 */
devfestApp.controller('SessionDetailCtrl',['$scope', function ($scope) {
  
  function getSpeaker(scope, speakerId) {
   	for (var i=0; i<scope.speakers.length; i++) {
   		if (scope.speakers[i].id == speakerId) {
   			return scope.speakers[i];
   		}
   	}
    return "TBD";
  };

  function getAgendaTime(scope, timeId) {
    for (var i=0; i<scope.agendaTimes.length; i++) {
      var line = scope.agendaTimes[i];
      if (line.name == timeId) {
        return line.start + " - " + line.end;
      }
    }
    return "TBD";
  };
  
  $scope.sessionSpeakers = [];
  for (var i = 0; i< $scope.session.speaker.length; i++){
    $scope.sessionSpeakers.push(getSpeaker($scope, $scope.session.speaker[i]));   
  }

  var timeId = $scope.session.time;
  $scope.time = getAgendaTime($scope, timeId);
}]);

/** 
 * Agenda controller 
 */
devfestApp.controller('AgendaCtrl',['$scope', '$http', function ($scope, $http) {
  
  function getSpeaker(speakers, speakerId) {
    var speakersName = "";
    for (var i=0; i<speakers.length; i++) {
      for (var j = 0; j < speakerId.length; j++){
        if (speakers[i].id === speakerId[j]) {
          if (speakersName != ""){
            speakersName += ", ";
          }
          speakersName += speakers[i].displayName;
        }
      }
    }
    return speakersName;
  };

  $http.get('json/sessions.json').success(function(data) {
    var agendaTimes = data.agendaTimes;
    var sessions =  data.sessions;
    var speakers =  data.speakers;

    for (var i=0; i<sessions.length; i++) {
      // Get the session
      var session = sessions[i];
      for (var j=0; j<agendaTimes.length; j++) {
        // Get the timeline
        var line = agendaTimes[j];
        // Add session to the corresponding timeline
        if (session.time && line.name === session.time) {
          // Get speaker name of the session
          session.speakername = getSpeaker(speakers, session.speaker);
          session.classStar = localStorage && localStorage[session.id] ? "" : "-empty";
          // Add the session to the corresponding track line
          switch (session.track) {
            case "_mobile" :
              line.android = session;
              break;
            case "_web" :
              line.html5 = session;
              break;
            case "_cloud" :
              line.cloud = session;
              break;
            case "_decouverte" :
              line.decouverte = session;
              break;
            case "_codelab" :
              line.codelabs = session;
              break;
          }
          break;
        }
      }
    }
    // Add TBD times
    var tbd = {"label":"", "speakername" : "", "room" : ""};
    for (var j=0; j<agendaTimes.length; j++) {
      // Get the timeline
      var line = agendaTimes[j];
      if (!line.android) {
        line.android = tbd;
      }
      if (!line.html5) {
        line.html5 = tbd;
      }
      if (!line.cloud) {
        line.cloud = tbd;
      }
      if (!line.decouverte) {
        line.decouverte = tbd;
      }
      if (!line.codelabs) {
        line.codelabs = tbd;
      }
    }
    tbd.hide = true;
    // Add agenda times & sessions to the scope view
    $scope.times = agendaTimes;
  });
}]);

/** 
 * Empty controller 
 */
devfestApp.controller('EmptyCtrl', ['$scope', function ($scope) {
  // Always nothing to do
}]);


/** 
 * Directive FAQ
 */
devfestApp.directive('faq', function () {
   var directiveDefinitionObject = {
    templateUrl: 'partials/faq.html',
    replace: true,
    transclude: true,
    restrict: 'E',
    scope: {
        title : '@title'
    },    
    link: function postLink(scope, iElement, iAttrs) { 
        var faq_title = iElement.find(".faq_title");
        var content = iElement.find(".faq_content");
        var icon = iElement.find("i");
        content.css('height','0');
        content.css('opacity','0');
        var click = false;
        
        var prefix = Modernizr.prefixed('transition');
        
        
        content.css(prefix+'-duration','1s');
        content.css(prefix+'-property','opacity');
        
        
        faq_title[0].addEventListener('click', function(){
            click = !click;
            content.css('opacity',click ? '1' : '0');
            if (!click){
                setTimeout(function(){
                    content.css('height','0');
                },1000);
            }else{
                content.css('height','auto');
                
            }
            icon.toggleClass('icon-arrow-down');
            icon.toggleClass('icon-arrow-right');
        });
        
    }
  };
  return directiveDefinitionObject;
});

/**
*
*/
devfestApp.directive('devfeststore', function () {
   var directiveDefinitionObject = {
    templateUrl: 'partials/devfeststore.html',
    replace: true,
    restrict: 'E',
    scope: {
        session : '=session'
    },    
    link: function postLink($scope, iElement, iAttrs) { 
        iElement[0].addEventListener('click', function(){
            if (localStorage){
              if (localStorage[$scope.session.id]){
                localStorage.removeItem($scope.session.id);
                $scope.session.classStar ="-empty";
              }else{
                localStorage[$scope.session.id] = true;        
                $scope.session.classStar ="";
              }
              $scope.$apply();
            }
        });
        
    }
  };
  return directiveDefinitionObject;
});