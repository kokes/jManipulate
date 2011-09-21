jManipulate - simple, yet effective tool not only for web coding folks
===

jManipulate is a tiny a JavaScript tool that allows you to see CSS changes in real time, without editing the CSS files manually. After marking which properties you'd like to see change in a WYSIWYG fashion, jManipulate will create a bunch of sliders on your website for you to use. Installation is super simple, see below.

**See it in action [over here](http://dl.dropbox.com/u/5758323/jManipulate/first.html).**

How does it work?
---

You simply include the essential JavaScript file along the incredible **jQuery** library.
	<script src='/js/jquery-1.5.2.min.js'></script>
	<script src='/js/jman.js'></script>

At this stage it is necessary to initialize jManipulate, but I plan to create an autoload version as well.
	
	$(document).ready(function() {
		jMan.init();
	})

After that, you're all set, you can get to editing your CSS files. The syntax is pretty simple. Whenever you want to alter the value of a property, you create a comment (mind the two asterisks, similar to documentation comments) specifying how you'd like to change the value.

	div#element {
		margin: 10px; /** +-5 */
		padding: 2em; /** +3 */
		border-style: solid; /** dashed */
		border-color: black
		border-width: 3px; /** -2 */
		
		width: 250px; /** +-100; 10 */
		float: left; /** right */
	}

So far there are two possibilities:

- You can use either `+-`, `+`, or `-` to indicate the direction of the change, followed by the extent of the change (without units) and separated by a semicolon, optional *step* value can be specified (see `width` above).

- With non-numerical values, you can simply state an alternative value you're considering. A `radio` form element will be created for you to choose from the values you specified. Soon you'll be able to specify multiple values using syntax `/** first alternative/second/so forth */`.

Who should/can use this?
---

Different folks can use this differently. A couple scenarios come to mind:

- **Web coders** - when converting a PSD into HTML and CSS, one might be trapped in an "edit CSS, switch to a browser, reload, think, switch back to the editor" kind of pickle. With jManipulate, you can simplify this process by marking the properties that may be troublesome and where you're unsure about their "correct" value.

- **Project managers** - while you're checking the team's work, you may have some objections and want changes to be made. Instead of overlooking their shoulders, coders can use jManipulate and let you show them easily, what you had in mind.

- **Clients of web design studios** - have you ever called a project manager saying "We'd like the logo to be just a tad higher/lower and the page border to be a bit more visible."? Everyone has. It is often difficult to express yourself and if the studio does implement jManipulate, you can be in charge of the changes you'd like to make. No coding skills required.
It can even be used *on-site*, so that you can discuss the design changes while actually making them!

Compatibility
---

- **Webkit browsers (Safari, Chrome)** - no problems, works like a charm.
- **Mozilla Firefox** - doesn't support some HTML 5 form elements, so instead of sliders, you only get textfields. So it works, but not as comfortably as it could.
- **Opera** - TBA
- **Internet Explorer** - no clue so far, sorry, Mac fag here.

**Attention:** as jManipulate uses AJAX, it doesn't work in Firefox and Chrome using the `file://` protocol - or simply opening the HTML files in your browsers. In order to use it in these browsers, you need to either enable AJAX locally, or use jManipulate using `http`, that is e.g. `localhost` or a remote web server.

Known imperfections
---

- the code is fugly, it's true, I'm no JavaScript ninja, but doing the best I can, will welcome criticism
- *cannot use values with decimal points*
- no support for `@import` so far
- no support for multiple values within a property, say `margin: 4px 2px 2px 3px`
- not foolproof, won't work with some tricky values that might confuse my regexps
- all the comments in the `.js` file are in Czech, and there are a lot of them, too many, sorry

Future functions
---

- support for empty instructions, where you'd simply append `/** */` and the script will try to figure out how you'd like to change the value
- possibility to export the changes (in JSON or something like that) and send them to the coder
- autoload version
- settings to adjust the behavior of jManipulate -- key mapping, custom styling