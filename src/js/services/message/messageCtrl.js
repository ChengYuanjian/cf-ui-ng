angular.module('app').controller('MessagesCtrl', ['$rootScope', '$scope', '$stateParams', '$location', 'messageService', function($rootScope, $scope, $stateParams, $location, messageService) {
  $scope.messages = messageService.messages;

  var from = $stateParams["from"];
  if(from !== 'login') messageService.removeAllMessages();
  console.log(messageService.messages);

  $scope.closeMessage = function(index) {
    $scope.messages.splice(index, 1);
  };

}]);
