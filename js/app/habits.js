requirejs.config({
	shim: {
		"jquery": {
			exports: "$"
		},
		"bootstrap": {
			deps: ["jquery"]
		},
		"bootstrap-datepicker": {
			deps: ["bootstrap"]
		},
		"bootstrap-table": {
			deps: ["bootstrap"]
		},
		"d3": {
			exports: "d3"
		},
		"d3.layout.cloud": {
			deps: ["d3"]
		},
		"crypto-js-md5": {
			exports: "CryptoJS"
		},
		"historian": {
			deps: ["jquery"]
		},
		"material": {
			deps: ["bootstrap"]
		}
	},
	baseUrl: "core/js/lib",
	paths: {
		core: '../app',
		app: '../../../js/app'
	}
});

main.page = function() {
	requirejs(["core/database", "greg", "crypto-js-md5", 'app/config'], function(database, greg, CryptoJS, config) {
		
		$("#loading_modal_main").modal("show");
		
		main.database = database;
		
		domain = null;
				
		database.onSyncStart = function() {
			database.logEvent("url_sync_started", null);
		};
	
		database.onSyncEnd = function() {
			database.logEvent("url_sync_completed", null);
			
			$("#loading_modal_main").modal("hide");

			$("#panel_title").html("Web Historian: Explore Your Data");

			$("#navbar_explore").show();

			$("#explore_visits").click(function(eventObj) {
				eventObj.preventDefault();
				$("#panel_title").html("Web Historian: Explore Your Data");
				domain = null;
				$("#exploration_visits").show();
				$("#exploration_table").hide();

				var width = $("#exploration_body").width();
				var height = $("#exploration_body").height();

				var side = height;

				if (width < height) {
					side = width;
				}

				side -= 75;

				if (side < 600) {
					side = 600;
				}

				$("#explore_visits_visualization").height(side);
				$("#explore_visits_visualization").width(side);

				requirejs(["core/websites-visited", "core/database"], function(websites_visited, database) {
					database.earliestDate(function(result) {
						var menu = [{
							title: 'View in Data Table',
							action: function(d) {
								domain = d.__data__.className;
								$("#explore_table").click();
								$("#explore_data_table_tab_pages").click();
							},
							disabled: false 
						}, {
							title: 'Permanently Delete',
							action: function(d) {
								if (confirm('Do you want to PERMANENTLY remove ALL visits to URLs from ' + d.__data__.className + ' from your local browser history?')) {
									var toDelete = [d.__data__.className];
							
									database.clearDomains(toDelete, function() {
										database.logEvent("domains_deleted", { 'count': 1 });
										
										$("#explore_visits").click();
									});
								}
							}
						}];
					
						websites_visited.display("#explore_visits_visualization", menu, false, "#explore_visits_slider", "#explore_visits_type", "#explore_visits_search", new Date(result["visitTime"]));
						document.body.scrollTop = document.documentElement.scrollTop = 0;
					})
				});
				
				return false;
			});

			$("#web_visit_card").click(function(eventObj) {
				eventObj.preventDefault();
				
				$("#explore_visits").click();
			});

			$("#explore_table").click(function(eventObj) {
				eventObj.preventDefault();

				$("#exploration_visits").hide();
				$("#exploration_table").show();

				requirejs(["core/websites-data-table"], function(websites_table) {
					websites_table.display("#explore_data_table", "#explore_data_table_tab_pages", "#explore_data_table_tab_domains", "#explore_data_table_pills", true, domain);
					document.body.scrollTop = document.documentElement.scrollTop = 0;
				});
				
				return false;
			});

			$("#explore_visits").click();
		};
			
		database.onSyncProgress = function(length, index) {
			var stepSize = Math.ceil(length / 100);
			
			if ((index % stepSize) == 0) {
				var width = Math.ceil(100 * ((index + 1) / length));
				$(".sync_progress").width(width + "%");
			}
		};
	});
};

// Start the main app logic.
requirejs(["material", "bootstrap-datepicker", "bootstrap-table", "d3.layout.cloud"], function(bs, bsdp, bst, d3lc) {
	$("#exploration_mode").show();
	$("#navbar_explore").show();
	$("#exploration_visits").hide();
	$("#exploration_table").hide();

	$('[data-toggle="tooltip"]').tooltip()

	window.setTimeout(main.page, 250);
});
