<div class="head">{{title}}</div>
<div class="main">
	<div id="index">	
      <ul>
      {{#each list}}	
	    <li><span>{{@index}}</span> {{this}}</li>
	  {{/each}}	  
     </ul>
    </div>
</div>
<div class="footer flex-box">
   <div class="flex-item js-bottom"><a href="#index" class="rightBorder">今日一糗</a></div>
   <div class="flex-item js-bottom"><a href="#publish">发表糗事 </a></div>
</div>