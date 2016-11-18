angular.module('app').factory('notificationService', ['Flash', function (Flash) {
    return {
        success: function (text) {
            Flash.create('success', text);
            // toastr.success(text,"成功");
        },
        error: function (text) {
            Flash.create('danger', text);
        },
        info: function (text) {
            Flash.create('info', text);
        },
        warning: function (text) {
            Flash.create('warning', text);
        }
    };
}]);
