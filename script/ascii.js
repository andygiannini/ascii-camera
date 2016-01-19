// Author: Andrei Gheorghe (http://github.com/idevelop)

var ascii = (function() {
	function asciiFromCanvas(canvas, options) {
		// Original code by Jacob Seidelin (http://www.nihilogic.dk/labs/jsascii/)
		// Heavily modified by Andrei Gheorghe (http://github.com/idevelop)

		//var characters = (" .,:;i1tfLCG08@").split("");
		var classes = ("abcdefghijklmno").split("");

		var context = canvas.getContext("2d");
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		
		var asciiCharacters = "";

		// calculate contrast factor
		// http://www.dfstudios.co.uk/articles/image-processing-algorithms-part-5/
		var contrastFactor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));

		// Keep track of brightness spans
		var previousClass = '';

        var position = 0;
		var imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
		for (var y = 0; y < canvasHeight; y += 2) { // every other row because letters are not square
			for (var x = 0; x < canvasWidth; x++) {
				// get each pixel's brightness and output corresponding brightness class
				var offset = (y * canvasWidth + x) * 4;

				var color = getColorAtOffset(imageData.data, offset);
	
				// increase the contrast of the image so that the ASCII representation looks better
				// http://www.dfstudios.co.uk/articles/image-processing-algorithms-part-5/
				var contrastedColor = {
					red: bound(Math.floor((color.red - 128) * contrastFactor) + 128, [0, 255]),
					green: bound(Math.floor((color.green - 128) * contrastFactor) + 128, [0, 255]),
					blue: bound(Math.floor((color.blue - 128) * contrastFactor) + 128, [0, 255]),
					alpha: color.alpha
				};

				// calculate pixel brightness
				// http://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
				var brightness = (0.299 * contrastedColor.red + 0.587 * contrastedColor.green + 0.114 * contrastedColor.blue) / 255;

				var brightnessClass = classes[(classes.length - 1) - Math.round(brightness * (classes.length - 1))];

                // If our current brightness isn't the same as the last one, make a new span
                if (previousClass !== brightnessClass) {
                    // If this isn't the first character, close the previous span
                    if (previousClass !== '') {
                        asciiCharacters += '</span>';
                    }
                    asciiCharacters += '<span class="' + brightnessClass + '">';
                }

				asciiCharacters += speechText.get(position++);

				previousClass = brightnessClass;
			}

			asciiCharacters += "\n";
		}

        asciiCharacters += '</span>';

		options.callback(asciiCharacters);
	}

	function getColorAtOffset(data, offset) {
		return {
			red: data[offset],
			green: data[offset + 1],
			blue: data[offset + 2],
			alpha: data[offset + 3]
		};
	}

	function bound(value, interval) {
		return Math.max(interval[0], Math.min(interval[1], value));
	}

	return {
		fromCanvas: function(canvas, options) {
			options = options || {};
			options.contrast = (typeof options.contrast === "undefined" ? 128 : options.contrast);
			options.callback = options.callback || doNothing;

			return asciiFromCanvas(canvas, options);
		}
	};
})();
