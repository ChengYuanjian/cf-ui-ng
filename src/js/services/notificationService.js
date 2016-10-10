angular.module('app').factory('notificationService', function () {
    return {
        success: function (text) {
            toastr.success(text,"成功");
        },
        error: function (text) {
            toastr.error(text, "错误");
        },
        info: function (text) {
            toastr.info(text, "提示");
        },
        warning: function (text) {
          toastr.warning(text, "注意");
        }
    };
});
