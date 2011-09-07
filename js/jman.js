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
			if (jMan.tvar == (jMan.cssFiles.length-1)) jMan.parseCSS(jMan.cssData); // u posledního souboru můžu začít parsovat
			jMan.tvar++;
		})
	}
}

jMan.parseCSS = function(data) {

	data += $('style').text(); // pridani obsahu <style>
	
	var m, s, d = new Array(), ar = new Array();
//	var rexp = /([^{}]+?){[^{}]*?([^:;{}]+):\s*([^;{}]+);\s*\/\*\*\s*(.*)?\s*\*\//;
//	var rexp = /([^{}\/]+?)\s*{[^{}]*?\s*([^:;{}]+):\s*([^;{}]+);\s*\/\*\*\s*(.*?)?\s*\*\//g;
	var rexp = /([^\/\*{}]+){[^}]*}/g;
	var rexp2 = /[^:;{}]+:\s*[^;{}]+;\s*\/\*\*\s*(.*)?\s*\*\//g;
	
	m = data.match(rexp);
	
	for (i in m) {
		s = m[i].split("{")[0].trim();
		ar = m[i].match(rexp2);
		if (ar == null) continue;
		d.push(new Array(s, ar));
	}
	
	for(var i in d) { // vygenerovat kostru jMan divu
		jMan.mdiv.append($("<div class='jmanPROP'></div>") // odstraněno -- id='jmpu" + i + "'
				 .append($("<a href='#'>" + d[i][0] + "</a>"))
				 .append($("<div class='jmanPROPtoggles'></div>").css("font-size", "80%") // možná to CSS někam jinam
					.append(jMan.createToggle(d[i]))
					)
		);
	} // for d
	
//	$("div.jmanPROPtoggles").toggle(); TODO ODKOMENTOVAT URCITE

	jMan.mdivStyle();	
}

jMan.mdivStyle = function() { // možná hodit celý do parseCSS, stejně to nebere argumenty
	$("div#jman > div").each(function() { // jde nějak to "> div" udělat, když mám div#jman jako objekt?
	$(this).children(":first-child").click(function() {
			$(this).siblings().toggle();
		})			
	});

	$(".jmanPROP:nth-child(even)").css("background", "#eee"); // TODO presunout nekam
	$(".jmanPROP").css("padding", "3px 5px 1px 8px"); // TODO presunout nekam	
}

jMan.createToggle = function(d) { // vrati HTML, kterym se bude ovladat to CSS
	var sel = d[0]; // selektor
	var props = new Array(), h = new Array();
	var ret = "", c; // c as in current, at moc nepisu
	var m, m2; // matche na ukládání výsledků regexpů
	
	var hi, lo, step; // hodnoty na slider

	for (i in d[1]) { // projdu jednotlivý vlastnosti a rozkouskuju
//		console.log(d[1][i].match(rexp));
		h = d[1][i].match(/^\s*([^:]+):\s*([^;]+);\s*\/\*\*\s*(.+?)\s*\*\//);
		props.push(new Array(h[1], h[2], h[3])); // jmeno vlastnosti, hodnota a obsah komentáře
	}
	
	for (i in props) {
		c = props[i]
//		console.log(props[i]);
		ret += "<code>" + c[0] + ": " + c[1] + ";</code><br />";
//		console.log(c[2]);
		
		if (c[2].trim().length == 0) { // prázdný instrukce
			// těžko říct, zatim nevim TODO
			continue;
		}
		
		m2 = c[1].match(/^\s*([0-9\.]+)\s*(.+)?/); // rozparsovani hodnoty na číslo a jednotky, zatim nepocita s vic hodnotama
												   // m2[1] bude undefined, pokud nejsou jednotky
//		console.log(m2);
		
		m = c[2].match(/([\+-]{1,2})\s*([0-9\.]+);?\s*(.+)?/); // rozparsovani komentare /** */
															// treti bude undefined, kdyz nebude step nastavenej
//		console.log(m);
		
		if (m == null) {
			// nesedí to na +- pattern, tady možná bude prostor na jinou syntax ještě TODO
			continue;
		}
		
		// fakt tam je +- nebo + nebo -, můžeme pokračovat:

		step = (m[3] == undefined) ? 1 : parseFloat(m[3]); // krokujeme defaultně po jedničce, jinak podle uvedení v komentáři
											   // TODO co když je jednička moc velká?
		if (m[1] == "+-") {
			hi = parseFloat(m2[1]) + parseFloat(m[2]); // hodnota z CSS + vůle
			lo = parseFloat(m2[1]) - parseFloat(m[2]); // dtto
		}
		
		if (m[1] == "+") {
			hi = parseFloat(m2[1]) + parseFloat(m[2]);
			lo = parseFloat(m2[1]);
		}
		
		if (m[1] == "-") {
			hi = parseFloat(m2[1]);
			lo = parseFloat(m2[1]) - parseFloat(m[2]); // TODO problém s "nepřesností" floatů
		}
		
		ret += "<input type='range' min='" + lo + "' max='" + hi + "' step='" + step + "' /><br />"; // nejen range, mohly by se hodit i jiný posuvníky
		
	}
	
	return ret;
}