/**
 * Created by AIyou on 2015/7/14.
 */
define(['modulesPath/index/view'], function (View) {
   return function(){
    	  var view = new View();
    	  view.listenTo(view.model,"change",view.render);
    };
});