//(function() {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onerror = function(event) {
        console.log(event);
    }

    recognition.onend = function(e) {
        recognition.start();
    }

    recognition.onresult = function(event) {
        var string = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            string += event.results[i][0].transcript;
        }
        speechText.set(string);
        console.log(string);
    }

    recognition.start();
//})();
