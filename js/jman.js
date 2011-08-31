function jMan() {

}

jMan.init = function() { // TODO pridat argumenty
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

	jMan.testvar = "foobar";

	jMan.mdiv = $("#jman");

	jMan.mdiv.css(jmanCSS);
	//	jsmanDIV.draggable(); TODO nahodit jQuery UI?

	// konec generace DIV
	
	var t = this;
	$("body").keypress(function(e) {
		if (e.which == 109) { // TODO změnit klávesu na nastavitelnou?
			t.mdiv.fadeToggle(200); // TODO nedostanu se na global
		}
	});
	
	jMan.loadCSS();
}

jMan.loadCSS = function () {
	var t = this;
	jMan.cssFiles = new Array();
	jMan.cssData = "";
	
	$("link[rel=stylesheet]").each(function() {
		jMan.cssFiles.push($(this).attr("href")); // TODO přidat @importy
	});	
	for (var i in this.cssFiles) {
		jMan.tvar = 0;// pomocnej globalni counter
		$.get(jMan.cssFiles[i], function(data) {
			jMan.cssData += data;
			if (jMan.tvar == (jMan.cssFiles.length-1)) jMan.parseCSS(jMan.cssData);
			jMan.tvar++;
		})
	}
}

jMan.parseCSS = function(data) {

	jMan.cssData += $('style').text(); // pridani obsahu <style>
	
	console.log(jMan.cssData);
	
	var m, d = new Array(), ar = new Array();
	var rexp = /([^{}]+?){[^{}]*?([^;{}]+);\s*\/\*\*\s*(.*)?\s*\*\//;

	while(data.match(rexp) != null) {
		m = data.match(rexp);
		d.push(new Array($.trim(m[1]), $.trim(m[2]), $.trim(m[3])));
		data = data.replace(rexp, "");
	}
	
	for(var i in d) { // vygenerovat kostru jMan divu
		console.log(d[i]); // TODO smazat - nebo ne? nechat na debug?

		jMan.mdiv.append($("<div class='jmanPROP'></div>") // odstraněno -- id='jmpu" + i + "'
				 .append($("<a href='#'>" + d[i][0] + "</a>"))
				 .append($("<div class='jmanPROPtoggles'>test</div>")) // todo smazat test
		);
	} // for d

	jMan.mdivStyle();	
}

jMan.mdivStyle = function() {
	$("div#jman > div").each(function() { // jde nějak to "> div" udělat, když mám div#jman jako objekt?
	$(this).children(":first-child").click(function() {
			$(this).siblings().toggle();
		})			
	});

	$(".jmanPROP:nth-child(even)").css("background", "#eee"); // TODO presunout nekam
	$(".jmanPROP").css("padding", "4px"); // TODO presunout nekam
	
}