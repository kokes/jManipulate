function jMan() {
	// generace DIV
	$("body").append($("<div id='jman'></div>")); // TODO nastavit id jako promennou
	
	var jmanCSS = {
		"width" : "400px",
		"border" : "2px solid #ccc",
		"background" : "white",
		"position" : "absolute",
		"top" : "30px",
		"right" : "30px",
	}
	
	this.mdiv = $("#jman");
	
	this.mdiv.css(jmanCSS);
//	jsmanDIV.draggable(); TODO nahodit jQuery UI?
	
	// konec generace DIV
	
	// exekuce příprav
	this.toggleSetup();
	this.loadCSS();
}

jMan.prototype.toggleSetup = function() {
	var t = this;
	$("body").keypress(function(e) {
		if (e.which == 109) { // TODO změnit klávesu na nastavitelnou?
			t.mdiv.fadeToggle(200); // TODO nedostanu se na global
		}
	});
}

jMan.prototype.loadCSS = function () {
	var t = this;
	this.cssFiles = new Array();
	this.csc = "";
	
	$("link[rel=stylesheet]").each(function() {
		t.cssFiles.push($(this).attr("href")); // TODO přidat @importy
	});	

	for (var i in this.cssFiles) {
		$.get(this.cssFiles[i], function(data) {
			t.parseCSS(data);
		})
	}
	
}

jMan.prototype.parseCSS = function(data) {
	
	var m, d = new Array(), ar = new Array();
	var rexp = /([^{}]+?){[^{}]*?([^;{}]+);\s*\/\*\*\s*(.*)?\s*\*\//;

	while(data.match(rexp) != null) {
		m = data.match(rexp);
		d.push(new Array($.trim(m[1]), $.trim(m[2]), $.trim(m[3])));
		data = data.replace(rexp, "");
	}
	
	for(var i in d) { // vygenerovat kostru jMan divu
		console.log(d[i]); // TODO smazat - nebo ne? nechat na debug?

		this.mdiv.append($("<div class='jmanPROP'></div>") // odstraněno -- id='jmpu" + i + "'
				 .append($("<a href='#'>" + d[i][0] + "</a>"))
				 .append($("<div class='jmanPROPtoggles'>test</div>")) // todo smazat test
		);
	} // for d

	
	
}

jMan.prototype.mdivStyle = function() { // TODO nevola se, protoze nevim, jak pockat, az budou data
	$("div#jman > div").each(function() {
	$(this).children(":first-child").click(function() {
			$(this).siblings().toggle();
		})			
	});

	$(".jmanPROP:nth-child(even)").css("background", "#eee"); // TODO presunout nekam
	$(".jmanPROP").css("padding", "4px"); // TODO presunout nekam
	
}