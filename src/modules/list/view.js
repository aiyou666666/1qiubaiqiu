/**
 * Created by aiyou 2016/6/16.
 */
define(['text!modulesPath/list/layout.tpl',"src/js/handlebars"], function (tpl,handlebars) {

    var view = Backbone.View.extend({
        el: '#container',
        initialize: function () {
        },
        render: function (name) {
            this.$el.html(_.template(tpl, {name: name}));
        }
    });

    return view;
});