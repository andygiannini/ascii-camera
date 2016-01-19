var speechText = (function() {
    var _text = 'You are what you say';
    var _position = 0;
    var _maxTextSize = 400;

    var setText = function(text) {
        var filteredText = _filterText(text);
        var charArray = _text.split('');
        for (var index = 0; index < filteredText.length; index++) {
            charArray[_position] = filteredText.charAt(index);
            _position = (_position + 1) % _maxTextSize;
        }
        _text = charArray.join('');
    }

    var getText = function(index) {
        return _text[index % _text.length];
    }

    var _filterText = function(text) {
        return text.toUpperCase().replace(/[^A-Z]*/g, '');
    }

    _text = _filterText(_text);
    while (_text.length <= _maxTextSize) {
        _text += _text;
    }
    _text = _text.substring(0, _maxTextSize - 1); 

    return {
        get: getText,
        set: setText
    };
})();
