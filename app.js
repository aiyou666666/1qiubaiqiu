/**
 * Created by aiyou 2016/6/12.
 */

'use strict';

(function (win) {
    //配置baseUrl
    var baseUrl = document.getElementById('main').getAttribute('data-baseurl');

    /*
     * 文件依赖
     */
   var project="./"; 
    var config = {
        baseUrl: baseUrl,           //依赖相对路径
        paths: {                    //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
            zepto: 'src/js/zepto.min',
            jquery: 'src/js/zepto.min',
            underscore: 'src/js/underscore',
            backbone: 'src/js/backbone',
            text: 'src/js/text',//用于requirejs导入html类型的依赖
            handlebars:'src/js/handlebars',
            baceview:'src/js/baseview',
            stylePath: project + '/css',
            modulesPath:project+"src/modules/",
            utils:project+"src/js/common/utils",
            validate:project+"src/js/common/validate"
        },
        shim: {                     //引入没有使用requirejs模块写法的类库。backbone依赖underscore
            'underscore': {
                exports: '_'
            },
            'jquery': {
                exports: '$'
            },
            'zepto': {
                exports: '$$'
            },
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            }
        },
        urlArgs: "bust=" +  (new Date()).getTime() //加版本号
        
    };

    require.config(config);

    //Backbone会把自己加到全局变量中
    require(['backbone', 'underscore', 'router'], function(){
        Backbone.history.start();   //开始监控url变化
    });

})(window);
