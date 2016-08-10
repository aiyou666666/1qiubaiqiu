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
				error: function(error) {
					console.log(error);
				}
			});

		},
		validate: function(data) {
		}
	});

	return new model();
});