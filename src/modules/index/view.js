/**
 * Created by kenkozheng on 2015/7/10.
 */
define([
	'text!modulesPath/index/layout.tpl',
	"src/js/handlebars",
	"src/js/common/utils",
	"src/js/common/validate",
	"text!modulesPath/index/index.css"
	],
	function (tpl,handlebars,utils,validata,style) {

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