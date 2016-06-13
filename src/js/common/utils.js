define([],function(){
	var utils={
		/*获取页面传值*/
		getparam:function(name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
           if(r!=null)return  r[2]; return null;
		},
		/*截取字符 包括中文*/
		cutString:function(str,len){
			var temp,
			icount=0,
			patrn=/[^\x00-\xff]/,
			strre="";
			var strlength=str.length;
			
		  for (var i=0;i<strlength;i++){
		  	 if(icount<len-1){
		  	 	temp=str.substr(i,1);
		  	 	if(patrn.exec(temp)==null){
		  	 		icount+=1;
		  	 	}else{
		  	 		icount+=2;
		  	 	}
		  	 	strre+=temp
		  	 }else{
		  	 	break;
		  	 }
		  }	
			return strre+"..."
        }
		
		
		
		
	}
	return utils;
});