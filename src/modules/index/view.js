/**
 * Created by kenkozheng on 2015/7/10.
 */
define([
	'text!modulesPath/index/layout.tpl',
	"handlebars",
	"utils",
	"validate",
	"modulesPath/index/model",
	"text!modulesPath/index/index.css"
	],
	function (tpl,handlebars,utils,validata,model,style) {
    var view = Backbone.View.extend({
        el: '#container',
        model:model, 
        initialize: function () {
        	//创建样式
        	this.style=style;
        	utils.createInlineStyle.call(this);
        },
        render: function (data) {
          var data=this.model.get();
          this.tpl=handlebars.compile(tpl)
          this.$el.html(this.tpl(data));
        }
    });
    
    return view;
});