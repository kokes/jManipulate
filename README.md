jManipulate - simple, yet effective tool not only for web coding folks
===

jManipulate is a tiny a JavaScript tool that allows you to see CSS changes in real time, without editing the CSS files manually. After marking which properties you'd like to see change in a WYSIWYG fashion, jManipulate will create a bunch of sliders on your website for you to use. Installation is super simple, see below.

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

- **Web coders** - when converting a PSD into HTML and CSS, one might be trapped in an "edit CSS, switch to a browser, reload, think, switch back to the editor" kind of pickle. With jManipulate, you can 

Compatibility
---

Known imperfections
---

Future functions