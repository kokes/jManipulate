function jMan() {

}

jMan.init = function() { // TODO add arguments?
	// generating divs
	
	$("body").append($("<div id='jman'></div>"));

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

	jMan.mdiv = $("#jman");

	jMan.mdiv.css(jmanCSS);

	// ending generating of divs
	
	var t = this;
	$(document).keypress(function(e) {
		if (e.which == 109) { // 109 is m; TODO - let the user choose this
			t.mdiv.fadeToggle(200); // TODO nedostanu se na global
		}
		
		if (e.which == 116) { // 116 is t; TODO - let the user choose this
			$(t.mdiv).find("div div").toggle(200); // TODO only closes, didn't investigate
		}
	});
	
	jMan.loadCSS();
}

jMan.loadCSS = function () {
	var t = this;
	jMan.cssFiles = new Array();
	jMan.cssData = "";
	
	$("link[rel=stylesheet]").each(function() {
		jMan.cssFiles.push($(this).attr("href")); // TODO add @imports
	});
	for (var i in this.cssFiles) {
		jMan.tvar = 0; // global counter
		$.get(jMan.cssFiles[i], function(data) {
			jMan.cssData += data;
			if (jMan.tvar == (jMan.cssFiles.length-1)) jMan.parseCSS(jMan.cssData);
			jMan.tvar++;
		})
	}
	
	if (jMan.cssFiles.length == 0) { // no external CSS files present
		jMan.parseCSS();
	}
}

jMan.parseCSS = function(data) {

	data += $('style').text(); // add contents of <style>
	
	var m, s, d = new Array(), ar = new Array();
//	var rexp = /([^{}]+?){[^{}]*?([^:;{}]+):\s*([^;{}]+);\s*\/\*\*\s*(.*)?\s*\*\*?\//;
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
		jMan.mdiv.append($("<div class='jmanPROP'></div>")
				 .append($("<a href='#'>" + d[i][0] + "</a>").css("display", "block"))
				 .append($("<div class='jmanPROPtoggles'></div>").css("font-size", "80%")
					.append(jMan.createToggle(d[i]))
					)
		);
	} // for d
	
//	$("div.jmanPROPtoggles").toggle(); // collapses all settings; useful when adjusting a lot of properties; TODO - make it a setting

	jMan.mdivStyle();
	jMan.makingItWork(); // it's early in the morning, not very creative
}

jMan.mdivStyle = function() { // maybe move over to parseCSS, not taking any input anyway
	$("div#jman > div").each(function() { // TODO replace with t.mdiv
	$(this).children(":first-child").click(function() {
			$(this).siblings().toggle(200);
		})			
	});

	$(".jmanPROP:nth-child(even)").css("background", "#eee"); // TODO move somewhere
	$(".jmanPROP").css("padding", "3px 5px 1px 8px"); // TODO move somewhere
}

jMan.createToggle = function(d) { // returns HTML that controls our CSS code
	var sel = d[0]; // selector
	var slider;
	var props = new Array(), h = new Array();
	var ret = "", c; // c as in current
	var m, m2; // regexp matches
	var rname; // radio name
	var rid; // id for labels
	var radio;
	
	var hi, lo, step, val; // values for our sliders

	for (i in d[1]) { // looping through comments and parsing
//		console.log(d[1][i].match(rexp));
		h = d[1][i].match(/^\s*([^:]+):\s*([^;]+);\s*\/\*\*\s*(.+?)\s*\*\//);
		props.push(new Array(h[1], h[2], h[3])); // property name, value, comment contents
	}
	
	for (i in props) {
		c = props[i]
//		console.log(props[i]);
		ret += "<div><code><span>" + c[0] + "</span>: <span>" + c[1] + "</span>;</code><br />";

		
		if (c[2].trim().length == 0) { // no instructions
			// TODO Anything to do here? Probably not
			continue;
		}
		
		m = c[2].match(/([\+-]{1,2})\s*([0-9\.]+);?\s*(.+)?/); // Parsing the comment, neglecting the possibility of ++, --, or -+
															   // third part will be undefined if left empty
//		console.log(m);
		
		if (m == null) {
			// no +-/+/- syntax, so investigating further

			rname = "jManradio" + parseInt(Math.random()*10000); // this is just plain stupid, all of this
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

			var poss = c[2].split(/\//); // are there more values separated by /?
			
			for (j in poss) {
				rid = "jManradio" + parseInt(Math.random()*10000);
				radio = $("<input>").attr({
					type: "radio",
					name: rname,
					id: rid,
					rel: sel + ":::" + c[0]
				});
				radio = $("<div></div>").append(radio.clone()).remove().html();
				radio += "<label for='" + rid + "'>" + poss[j] + "</label><br />";
				ret += radio;
			}

			// TODO - what if colors are being adjusted? Make a special UI element for it
			
			continue;
		}
		
		// +- is there, continue:
		
		m2 = c[1].match(/^\s*([0-9\.]+)\s*(.+)?/); // parsing value and units
												   // m2[2] is undefined if no units used
		m2[2] = (m2[2] == undefined) ? "" : m2[2];

		step = (m[3] == undefined) ? 1 : parseFloat(m[3]); // default step is 1; TODO - what if 1 is too big (e.g. opacity)
		if (m[1] == "+-") {
			hi = parseFloat(m2[1]) + parseFloat(m[2]);
			lo = parseFloat(m2[1]) - parseFloat(m[2]);
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
		
		hi = Math.round(100*hi)/100; // float does not return precise values, rounding; TODO - make it more elegant
		lo = Math.round(100*lo)/100;
		step = Math.round(100*step)/100;
		
		
//		slider = "<input type='range' min='" + lo + "' max='" + hi + "' step='" + step + "' /><br />";
		slider = $("<input>").attr({
					type : "range",
					min: lo,
					max: hi,
					step: step,
					rel: sel + ":::" + c[0] + ":::" + m2[2] // e.g. body:::padding:::em
				});		
		slider = $("<div></div>").append(slider.clone()).remove().html(); // Object -> string in HTML
		slider = slider.substr(0,slider.length-1) + ' value="' + val + '" />';

		ret += slider; 
		
		ret += "</div>";		
	}
	
	return ret;
}

jMan.makingItWork = function() {
	var selprop = new Array(); // selector and property
	
	$(jMan.mdiv).find("input[type=range]").css("width", "250px");
	$(jMan.mdiv).find("label").css("padding-left", "10px");
	
	// piece with <code> and <input>
	$(jMan.mdiv).find("div div div input[type=range]").each(function() {

		$(this).change(function() {
			selprop = $(this).attr("rel").split(":::"); // 0 => selector, 1 => property, 2 => units
			selprop[2] = $(this).val() + selprop[2];
			$(selprop[0]).css(selprop[1], selprop[2]);
			console.log(selprop);
			
			$(this).siblings("code").children("span:last-child").text(selprop[2]);
			
		});
	});
	
	$(jMan.mdiv).find("div div div input[type=radio]").each(function() {
		$(this).change(function() {
			selprop = $(this).attr("rel").split(":::"); // 0 => selector, 1 => property
			$(selprop[0]).css(selprop[1], $(this).next().text()); // TODO rewrite to animate the change
		})
	});	
	
}
