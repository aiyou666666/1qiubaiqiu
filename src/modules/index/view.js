/**
 * Created by kenkozheng on 2015/7/10.
 */
define([
	'text!modulesPath/index/layout.tpl',
	"handlebars",
	"utils",
	"validate",
	"text!modulesPath/index/index.css"
	],
	function (tpl,handlebars,utils,validata,style) {

    var view = Backbone.View.extend({
        el: '#container',
        
        initialize: function () {
        	//创建样式
        	this.style=style;
        	utils.createInlineStyle.call(this);
        },
        render: function (name) {
          this.tpl=handlebars.compile(tpl)
           this.$el.html(this.tpl({title:"首页"}));
        }
    });

    return view;
});