/**
 * Created by kenkozheng on 2015/7/10.
 */
define(['text!modulesPath/index/layout.tpl',"src/js/handlebars"], function (tpl,handlebars) {

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