// Global
// which list will be used to lookup words.
// standard diceware wordlist by default.
var currentList = "diceware";

// Use a cryptographically strong random number generator
// to get the die roll results. Returns an array of
// objects of length numWords (default 1). Each object in
// the array represents a word and its index and is the result of
// numRollsPerWord die rolls (default 5).
function getWords(numWords, numRollsPerWord) {
    'use strict';

    var i,
        j,
        words = [],
        rollResults,
        rollResultsJoined,
        randomBytes;

    if (!numWords) { numWords = 1; }
    if (!numRollsPerWord) { numRollsPerWord = 5; }

    for (i = 0; i < numWords; i += 1) {
        rollResults = [];
        randomBytes = new Uint32Array(numRollsPerWord);
        window.crypto.getRandomValues(randomBytes);

        for (j = 0; j < randomBytes.length; j += 1) {
            // Convert random Byte into 6 sided die roll
            rollResults.push((randomBytes[j] % 6) + 1);
        }

        rollResultsJoined = rollResults.join('');
        words.push(getWordFromWordNum(rollResultsJoined)[0]);
    }

    return words;
}

// Lookup a word by its wordNum and return
// an Array with a single word object suitable for displayWords.
function getWordFromWordNum(wordNum) {
    if (wordNum.length === 5) {
        var word;
        switch (currentList) {
            case "alternative":
                word = alternative[wordNum];
                break;
            case "catalan":
                word = catalan[wordNum];
                break;
            case "dutch":
                word = dutch[wordNum];
                break;
            case "esperanto":
                word = esperanto[wordNum];
                break;
            case "german":
                word = german[wordNum];
                break;
            case "japanese":
                word = japanese[wordNum];
                break;
            case "polish":
                word = polish[wordNum];
                break;
            case "swedish":
                word = swedish[wordNum];
                break;
            default:
                word = diceware[wordNum];
                break;
        }

        return [{"word": word, "wordNum": wordNum}];
    } else if (wordNum.length === 2) {
        return [{"word": special[wordNum], "wordNum": wordNum}];
    }
}

// Takes an array of word objects and display them on the page.
function displayWords(words) {
    'use strict';

    // add the word to the global array of words
    $.each(words, function( index, obj ) {
        wordList.push(obj.word);
    });

    // add the word to the main display
    $.each(words, function( index, obj ) {
        $('#diceWords').append('<li>' + obj.word + '<span class="text-muted">' + obj.wordNum + '</span></li>');
    });

    // Display the ZXCVBN results
    var wordListJoinedSpace = wordList.join(' ');
    var wordListJoinedDash = wordList.join('-');
    var wordListJoinedNoGap = wordList.join('');

    var zxcvbnResult = zxcvbn(wordListJoinedSpace);
    $("#diceWordsCopyableSpace").text(wordListJoinedSpace);
    $("#diceWordsCopyableDash").text(wordListJoinedDash);
    $("#diceWordsCopyableNoGap").text(wordListJoinedNoGap);

    $("#diceWordsCopyableContainer").slideDown();
    $("#zxcvbnResults").html("estimates this passphrase contains " + zxcvbnResult.entropy + " bits of entropy with a crack time measured in " + zxcvbnResult.crack_time_display + " (" + zxcvbnResult.crack_time + " seconds)");
    $("#zxcvbnResultsContainer").slideDown();

}

function resetUI() {
    wordList = [];
    $('#listTitleHeader span').text(currentList);
    $('#diceWords').html('');
    $("#diceWordsCopyable").text('');
    $("#diceWordsCopyableContainer").hide();
    $("#zxcvbnResults").html("");
    $("#zxcvbnResultsContainer").hide();
}

$(document).ready(function () {
    'use strict';

    // an array of objects representing the current random word list.
    var wordList = [];

    // clear and reset everything on load.
    resetUI();

    $('.listSelectionLink').on('click', function (e) {
        currentList = $(this).data("list");
        // the active class gets applied to the parent <li> which
        // gets highlited if that was the last selected link.
        $('.listSelectionLink').parent().removeClass('active');
        $(this).parent().addClass('active');
        resetUI();
    });

    $('#buttonAddFourWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(4, 5));
    });

    $('#buttonAddFiveWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(5, 5));
    });

    $('#buttonAddSixWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(6, 5));
    });

    $('#buttonAddSevenWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(7, 5));
    });

    $('#buttonAddEightWords').on('click', function (e) {
        e.preventDefault();
        resetUI();
        displayWords(getWords(8, 5));
    });

    // single word button
    // does not reset UI. Adds onto existing wordList
    $('#buttonAddWord').on('click', function (e) {
        e.preventDefault();
        displayWords(getWords(1, 5));
    });

    // single symbol button
    // does not reset UI. Adds onto existing wordList
    $('#buttonAddSymbol').on('click', function (e) {
        e.preventDefault();
        // two die roll
        displayWords(getWords(1, 2));
    });

    // add a word from the output from analog die rolls e.g. 14352
    // can be either a five die roll for a full word, or a two die
    // roll for a symbol.
    // does not reset UI. Adds onto existing wordList
    $('#addFiveDieRollWordForm').on('submit', function (e) {
        var addFiveDieRollWord;
        e.preventDefault();
        addFiveDieRollWord = $('#addFiveDieRollWord').val();
        if ((addFiveDieRollWord.match(/^[1-6]{2}$/) || addFiveDieRollWord.match(/^[1-6]{5}$/)) && (addFiveDieRollWord.length === 2 || addFiveDieRollWord.length === 5)) {
            displayWords(getWordFromWordNum(addFiveDieRollWord));
        }
        $('#addFiveDieRollWord').val('');
    });

});
