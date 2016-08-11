/*
 * created by AIyou 2016/8/10 
 * */
define(["backbone"], function(backbone) {
	var model = backbone.Model.extend({
		url: 'src/data/index.json',
		data: null,
		initialize: function() {
			this.getdata();
		},
		getdata: function() {
			this.fetch({
				success:function(model,val){
					console.log(val);
					
				},
				error: function(error) {
					console.log("数据出错");
				}
			});

		},
		validate: function(data) {
		}
	});

	return new model();
});