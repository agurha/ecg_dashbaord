/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 31/03/2013
 * Time: 12:44
 * To change this template use File | Settings | File Templates.
 */
angular.module('ecg', ['ecg.filters', 'ecg.services', 'ecg.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'partials/index',
      controller: IndexCtrl
    });
    $routeProvider.when('/channels', {
      templateUrl: 'partials/channels',
      controller: ChannelsCtrl
    });
    $routeProvider.when('/channel', {
      templateUrl: 'partials/channel',
      controller: ChannelCtrl
    });
    $routeProvider.when('/new_channel', {
      templateUrl: 'partials/new_channel',
      controller: NewChannelCtrl
    });
    $routeProvider.when('/profile', {
      templateUrl: 'partials/profile/index',
      controller: ProfileCtrl
    });
    /*$routeProvider.otherwise({
     redirectTo: '/'
     });*/
    $locationProvider.html5Mode(true);
  }]);