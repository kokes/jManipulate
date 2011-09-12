function jMan() {

}

jMan.init = function() { // TODO pridat argumenty
	// generace DIV
	
	$("body").append($("<div id='jman'></div>")); // TODO nastavit id jako promennou

	var jmanCSS = {
		"width" : "300px",
		"border" : "2px solid #ccc",
		"background" : "white",
		"position" : "fixed",
		"top" : "5%",
		"right" : "2%",
		"max-height" : "90%",
		"overflow": "auto"
	}

	jMan.testvar = "foobar";

	jMan.mdiv = $("#jman");

	jMan.mdiv.css(jmanCSS);
	//	jsmanDIV.draggable(); TODO nahodit jQuery UI?

	// konec generace DIV
	
	var t = this;
	$(document).keypress(function(e) {
		if (e.which == 109) { // TODO změnit klávesu na nastavitelnou?
			t.mdiv.fadeToggle(200); // TODO nedostanu se na global
		}
		
		if (e.which == 116) { // TODO změnit klávesu na nastavitelnou?
			$(t.mdiv).find("div div").toggle(100); // TODO nedostanu se na global
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
				 .append($("<a href='#'>" + d[i][0] + "</a>").css("display", "block"))
				 .append($("<div class='jmanPROPtoggles'></div>").css("font-size", "80%") // možná to CSS někam jinam
					.append(jMan.createToggle(d[i]))
					)
		);
	} // for d
	
//	$("div.jmanPROPtoggles").toggle(); TODO ODKOMENTOVAT URCITE

	jMan.mdivStyle();
	jMan.makingItWork(); // je 9 ráno, nejsem moc kreativní co do názvu metod
}

jMan.mdivStyle = function() { // možná hodit celý do parseCSS, stejně to nebere argumenty
	$("div#jman > div").each(function() { // jde nějak to "> div" udělat, když mám div#jman jako objekt?
	$(this).children(":first-child").click(function() {
			$(this).siblings().toggle(200);
		})			
	});

	$(".jmanPROP:nth-child(even)").css("background", "#eee"); // TODO presunout nekam
	$(".jmanPROP").css("padding", "3px 5px 1px 8px"); // TODO presunout nekam	
}

jMan.createToggle = function(d) { // vrati HTML, kterym se bude ovladat to CSS
	var sel = d[0]; // selektor
	var slider; // TODO, tady asi bude HTML toho slideru, pro snadnejsi manipulaci
	var props = new Array(), h = new Array();
	var ret = "", c; // c as in current, at moc nepisu
	var m, m2; // matche na ukládání výsledků regexpů
	var rname; // radio name
	var rid; // id pro label
	var radio; // neco jako slider, jen pro radios
	
	var hi, lo, step, val; // hodnoty na slider

	for (i in d[1]) { // projdu jednotlivý vlastnosti a rozkouskuju
//		console.log(d[1][i].match(rexp));
		h = d[1][i].match(/^\s*([^:]+):\s*([^;]+);\s*\/\*\*\s*(.+?)\s*\*\//);
		props.push(new Array(h[1], h[2], h[3])); // jmeno vlastnosti, hodnota a obsah komentáře
	}
	
	for (i in props) {
		c = props[i]
//		console.log(props[i]);
		ret += "<div><code><span>" + c[0] + "</span>: <span>" + c[1] + "</span>;</code><br />"; // spany na vyparsování těch hodnot

		
		if (c[2].trim().length == 0) { // prázdný instrukce
			// těžko říct, zatim nevim TODO
			continue;
		}
		
		m = c[2].match(/([\+-]{1,2})\s*([0-9\.]+);?\s*(.+)?/); // rozparsovani komentare /** */
															// treti bude undefined, kdyz nebude step nastavenej
//		console.log(m);
		
		if (m == null) {
			// nesedí to na +- pattern, tady možná bude prostor na jinou syntax ještě TODO
			// zatim jedina syntax - alternativní možnosti - radio input

			rname = "jManradio" + parseInt(Math.random()*10000);
			rid = "jManradio" + parseInt(Math.random()*10000);
			
			radio = $("<input>").attr({
				type: "radio",
				name: rname,
				id: rid,
				rel: sel + ":::" + c[0]
			});
			radio = $("<div></div>").append(radio.clone()).remove().html();
			radio = radio.substring(0, radio.length-1) + " checked />";
			radio += "<label for='" + rid + "'>" + c[1] + "</label><br />";
			ret += radio;
			
			rid = "jManradio" + parseInt(Math.random()*10000);
			radio = $("<input>").attr({ // TODO tohle cely prepsat na trochu kompaktnejsi verzi a aby to umelo vic enum
				type: "radio",
				name: rname,
				id: rid,
				rel: sel + ":::" + c[0]
			});
			radio = $("<div></div>").append(radio.clone()).remove().html();
			radio += "<label for='" + rid + "'>" + c[2] + "</label>";
			ret += radio;
			
			continue;
		}
		
		// fakt tam je +- nebo + nebo -, můžeme pokračovat:
		
		m2 = c[1].match(/^\s*([0-9\.]+)\s*(.+)?/); // rozparsovani hodnoty na číslo a jednotky, zatim nepocita s vic hodnotama
												   // m2[2] bude undefined, pokud nejsou jednotky
		m2[2] = (m2[2] == undefined) ? "" : m2[2];

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
			lo = parseFloat(m2[1]) - parseFloat(m[2]);
		}
		
		val = parseFloat(m2[1]);
		
		hi = Math.round(100*hi)/100; // vse zaokrouhlit na dve desetinna, float "blbne"
		lo = Math.round(100*lo)/100;
		step = Math.round(100*step)/100;
		
		
//		slider = "<input type='range' min='" + lo + "' max='" + hi + "' step='" + step + "' /><br />"; // nejen range, mohly by se hodit i jiný posuvníky
		slider = $("<input>").attr({
					type : "range",
					min: lo,
					max: hi,
					step: step,
					rel: sel + ":::" + c[0] + ":::" + m2[2] // body:::padding:::em
				});		
		slider = $("<div></div>").append(slider.clone()).remove().html(); // docela vychytaná věc :-) převede Object na html string
		slider = slider.substr(0,slider.length-1) + ' value="' + val + '" />'; // TODO bohužel JS nějak neumí nastavit value inputu, ale nějak to možná půjde

		ret += slider; 
		
		ret += "</div>";		
	}
	
	return ret;
}

jMan.makingItWork = function() {
	var selprop = new Array(); // selektro a property v change()
	
	$(jMan.mdiv).find("input[type=range]").css("width", "250px");
	$(jMan.mdiv).find("label").css("padding-left", "10px");
	
	// blok s <code> a <input>
	// možná tohle všechno pořešim už při generování toho HTML
	$(jMan.mdiv).find("div div div input[type=range]").each(function() {

		$(this).change(function() {
			selprop = $(this).attr("rel").split(":::"); // 0 => selektor, 1 => property, 2 => jednotky
			selprop[2] = $(this).val() + selprop[2];
			$(selprop[0]).css(selprop[1], selprop[2]);
			console.log(selprop);
			
			$(this).siblings("code").children("span:last-child").text(selprop[2]);
			
		});
	});
	
	$(jMan.mdiv).find("div div div input[type=radio]").each(function() {
		$(this).change(function() {
			selprop = $(this).attr("rel").split(":::"); // 0 => selektor, 1 => property
			$(selprop[0]).css(selprop[1], $(this).next().text());
		})
	});

	
	
}