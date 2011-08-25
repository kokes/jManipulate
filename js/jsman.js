$(document).ready(function() {
	
	// generace DIV
	$("body").append($("<div id='jsman'></div>")); // TODO nastavit id jako promennou
	
	var jsmanCSS = {
		"width" : "400px",
		"border" : "2px solid #ccc",
		"background" : "white",
		"position" : "absolute",
		"top" : "30px",
		"right" : "30px",
	}
	
	var jsmanDIV = $("#jsman");
	
	jsmanDIV.css(jsmanCSS);
//	jsmanDIV.draggable(); TODO nahodit jQuery UI?
	
	// konec generace DIV
	
	$("body").keypress(function(e){
		if (e.which == 109) {
			// time for some keypress love
			jsmanDIV.fadeToggle(200);
			
		}
	}); // konec bindu na "m"
	
	$.get("style.css", function(data) {
		
//		console.log(document.styleSheets);

		var m, d = new Array(), ar = new Array();
		var rexp = /([^{}]+?){[^{}]*?([^;{}]+);\s*\/\*\*\s*(.*)?\s*\*\//;

		while(data.match(rexp) != null) {
			m = data.match(rexp);
			d.push(new Array($.trim(m[1]), $.trim(m[2]), $.trim(m[3])));
			data = data.replace(rexp, "");
		}
		
		var curd; // aktualni div, do kteryho nasypu data
		
		for(i=0;i<d.length;i++) { // vygenerovat kostru jsman divu
			console.log(d[i]); // TODO smazat - nebo ne? nechat na debug?

			jsmanDIV.append($("<div class='jsmanPROP' id='jsmpu" + i + "'></div>")
				.append($("<a href='#'>" + d[i][0] + "</a>"))
				.append($("<div class='jsmanPROPtoggles'>test</div>")) // todo smazat test
			);
		} // for d

		$("div#jsman > div").each(function() {
			$(this).children(":first-child").click(function() {
				$(this).siblings().toggle();
			})			
		});
		
//		for(i=0;i<d.length;i++) { // vygenerovat kostru jsman divu
//			$("div#jsman " )
//		}
		
		$(".jsmanPROP:nth-child(even)").css("background", "#eee"); // TODO presunout nekam
		$(".jsmanPROP").css("padding", "4px"); // TODO presunout nekam
		
		
	}); // .get(style)
	

	
//	var r2 = $('#priklad1b');

//	r2.change(function() {
//		div.css("width", r2.attr('value') + "px");
//	});
	
	
}); // doc.ready