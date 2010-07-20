/**
 * @author lesgreen
 */
dojo.provide("gp.gpDojoPortfolio");

dojo.require("dijit._Widget");
dojo.require("dojo.fx.easing");


dojo.declare("gp.gpDojoPortfolio", [ dijit._Widget ], {
	widgetsInTemplate: true,
	portfolio_items: '.gpPortfolioItem',
	title_class: 'gpPortfolio-Title',
	anim_duration: 1000,
	anim_easing: 'elasticOut',
	show_side_nav: true,
	interval: '',
	
	buildRendering: function() {
		this.inherited(arguments);
		var cls, li, sp, op;
		var self = this;
		var cId = this.domNode.id;
		
		var h = dojo.query('#'+cId+ ' h1');
		if (h.length != 0) {
			var newH = dojo.create("h1", {
				class: this.title_class,
				innerHTML: h[0].innerHTML
			}, this.domNode);
			dojo.destroy(h[0]);
			var ul = dojo.create("ul", {
				class: "gpPortfolio-Top-Nav"
			}, newH);
		}
		dojo.create("div", {
			id: cId+"-gpPortfolio-Side-Nav-Left",
			class: "gpPortfolio-Side-Nav"
		}, this.domNode);
		
		dojo.create("div", {
			id: cId+"-gpPortfolio-PrevBtn",
			class: "gpPortfolio-PrevBtn"
		}, cId+"-gpPortfolio-Side-Nav-Left");
		
		dojo.create("div", {
			id: cId+"-gpPortfolio-SlideCntnr",
			class: "gpPortfolio-SlideCntnr"
		}, this.domNode);
		
		dojo.create("div", {
			id: cId+"-gpPortfolio-Slider",
			class: "gpPortfolio-Slider"
		}, cId+"-gpPortfolio-SlideCntnr");
		
		dojo.create("div", {
			id: cId+"-gpPortfolio-Side-Nav-Right",
			class: "gpPortfolio-Side-Nav"
		}, this.domNode);
		
		dojo.create("div", {
			id: cId+"-gpPortfolio-NextBtn",
			class: "gpPortfolio-NextBtn"
		}, cId+"-gpPortfolio-Side-Nav-Right");
		
		
		dojo.forEach(dojo.query('#'+cId+ ' > ' +this.portfolio_items), function(itms, i) {
			dojo.attr(itms, 'id', 'gpPortTempId');
			dojo.create("div", {
				id: cId+"-gpPortfolio-DisplayCntnr"+i,
				class: "gpPortfolio-DisplayCntnr"
			}, cId+"-gpPortfolio-Slider");
			li = dojo.create("li", null, ul);
			// dot navigation
			op = (i == 0) ? 1 : 0;
			sp = dojo.create("span", {
				style: {opacity: op}
			}, li);
						
			dojo.forEach(dojo.query('#gpPortTempId' + ' ul > li'), function(itm, j) {
				cls = (j == 0) ? "gpPortfolio-LeftItem" : "gpPortfolio-RightItem";
				dojo.create("div", {
					class: cls,
					innerHTML: itm.innerHTML
				}, cId+"-gpPortfolio-DisplayCntnr"+i);
			});
			dojo.destroy(itms);
		});
		h = null, newH = null, ul = null, li = null, sp = null;
    },
		
	postCreate: function() {
		var self = this;
		var cId = this.domNode.id;
		var displayWidth, currentIndex = 0, selectedIndex = 0;
		var selectedNav;
		var totalItems = 0;
				
		var d = dojo.position(cId+"-gpPortfolio-DisplayCntnr0", true);
		displayWidth = d.w;		
		
				
		if (this.show_side_nav) {
			dojo.query('#'+cId + " .gpPortfolio-Side-Nav").style({
		        "display": "block"
	        });
			var n = dojo.byId(cId+"-gpPortfolio-NextBtn");
			dojo.connect(n, "onclick", moveNext);
			var p = dojo.byId(cId+"-gpPortfolio-PrevBtn");
			dojo.connect(p, "onclick", movePrev);
		}
		
		var qr = dojo.query('#'+cId + " h1 ul.gpPortfolio-Top-Nav li span").forEach(function(node, i){
			totalItems = i;
			if (i == 0) {
				selectedNav = node;
			}
			dojo.connect(node, "onclick", function(e) {
				selectedIndex = i;
				showPortfolio();
			});
		});
		
		if (this.interval) {
			setInterval(intervalMove, this.interval);
		}
		
		function showPortfolio() {
			setTopNav();
			doMove();
		};
		
		function setTopNav() {
			var sp = dojo.query('#'+cId + " h1 ul.gpPortfolio-Top-Nav li span")[selectedIndex];
			dojo.style(sp, "opacity", 1);
			dojo.style(selectedNav, "opacity", 0);
			selectedNav = sp;
		};

		function moveNext() {
			if (selectedIndex < totalItems) {
				selectedIndex++;
				showPortfolio();
			}
		};
		
		function movePrev() {
			if (selectedIndex > 0) {
				selectedIndex--;
				showPortfolio();
			}
		};
		
		function doMove() {
			//var fin = (selectedIndex > currentIndex) ? -(selectedIndex*displayWidth) : selectedIndex*displayWidth;
			var fin = -(selectedIndex*displayWidth);
			var sInfo = dojo.position(cId+"-gpPortfolio-Slider", true);
			dojo.animateProperty({
				node:cId+"-gpPortfolio-Slider",
				duration: self.anim_duration,
				easing: dojo.fx.easing[self.anim_easing],
				properties: {
				      left: {
					  	start: sInfo.x,
						end: fin	
					  }
				}
			}).play();
			currentIndex = selectedIndex;
		};
		
		function intervalMove() {
			selectedIndex = (selectedIndex < totalItems) ? selectedIndex + 1 : 0;
			showPortfolio();
		};
	}	
});