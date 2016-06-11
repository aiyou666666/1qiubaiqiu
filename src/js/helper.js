define(["handlebars"],function(handlebars){
	
 /*支持表达式*/
 handlebars.registerHelper("ifexp",function(v1,operator,v2,options) {
 	
 	
	switch (operator)
	    {
	    case "==":
	    console.log(v2);
	        return (v1==v2)?options.fn(this):options.inverse(this);
	
	    case "!=":
	        return (v1!=v2)?options.fn(this):options.inverse(this);
	
	    case "===":
	        return (v1===v2)?options.fn(this):options.inverse(this);
	
	    case "!==":
	        return (v1!==v2)?options.fn(this):options.inverse(this);
	
	    case "&&":
	        return (v1&&v2)?options.fn(this):options.inverse(this);
	
	    case "||":
	        return (v1||v2)?options.fn(this):options.inverse(this);
	
	    case "<":
	        return (v1<v2)?options.fn(this):options.inverse(this);
	
	    case "<=":
	        return (v1<=v2)?options.fn(this):options.inverse(this);
	
	    case ">":
	        return (v1>v2)?options.fn(this):options.inverse(this);
	
	    case ">=":
	     return (v1>=v2)?options.fn(this):options.inverse(this);
	
	    default:
	        return eval(""+v1+operator+v2)?options.fn(this):options.inverse(this);
	  }
});
/*下标加1*/
      handlebars.registerHelper("plusone",function(index){
         return index+1;
       });
/*切换成分*/       
     handlebars.registerHelper("interMoney",function(money){
       	  return (money/100).toFixed(2);
       });
/*性别转换成中文*/       
      handlebars.registerHelper("transfromGender",function(gender){
      	   if(gender==0)return '其他';
      	   if(gender==1)return '男';
      	   if(gender==2)return  '女'
      	 });
 /*日期转换成中文*/     	 
      handlebars.registerHelper("transfromTime",function(day,time){
      	var day_zhcn={sun:"周日",sat:"周六",fri:"周五",thu:"周四",wed:"周三",tue:"周二",mon:"周一"}
      	  if(time==1){
      	    	 return day_zhcn[day]+":"+"上午";
      	    }else if(time==2){
      	    	return day_zhcn[day]+":"+"下午";
      	    }else if(time==3){
      	    	return day_zhcn[day]+":"+"全天";
      	    }
      	
      });
 /*时间格式化*/     
   handlebars.registerHelper("format",function(fmt,time){
      var scope=new Date(time);
      console.log(scope);
      	var o = {
        "M+": scope.getMonth() + 1, //月份 
        "d+": scope.getDate(), //日 
        "h+": scope.getHours(), //小时 
        "m+": scope.getMinutes(), //分 
        "s+": scope.getSeconds(), //秒 
        "q+": Math.floor((scope.getMonth() + 3) / 3), //季度 
        "S": scope.getMilliseconds() //毫秒 
      };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (scope.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
      	
      	
      });
     
      
		
	
});