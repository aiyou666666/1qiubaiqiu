/**
 * Created by kenkozheng on 2015/7/14.
 */
define(['modulesPath/index/view'], function (View) {

    var controller = function () {
        var view = new View();
        view.render('第一个页面');
    };
    return controller;
});