var endpoint;
var state = 'init';
var context = {};
var session = "";
var showHideTime = 500;
var scrollToBottomTime = 500;

//Function called right after the page is loaded
$(document).ready(function () {
    //Get endpoint from URL address
    endpoint = getEndpoint();

    //Request response of init node
    init();

    //DELETE BELOW, TEST CODE
    $("#showButtons").click(function () {
        showButtons([{'text': 'Text A', 'input': 'Input A'}, {'text': 'Text b', 'input': 'Input b'}, {
            'text': 'Text c',
            'input': 'Input C'
        }]);
    });

    $("#hideButtons").click(function () {
        hideButtons();
    });

    $("#showInput").click(function () {
        showInput();
    });

    $("#hideInput").click(function () {
        hideInput();
    });
    //DELETE ABOVE, TEST CODE
});

//Call init state
function init() {
    $.ajax({
        url: endpoint,
        type: 'post',
        processData: false,
        data: JSON.stringify({"text": '', "state": state, "context": context, "session": session}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (data, textStatus, jQxhr) {
            // save state, context and session
            state = data["state"];
            context = data["context"];
            session = data["session"];
            //show Alquist's response
            showSystemMessage(data["text"]);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            //If Alquist doesn't response, wait and try it again
            setTimeout(init(), 3000);
        }
    });
}

//Click on submit button
$(document).on("submit", "#form", function (e) {
    //Prevent reload of page after submitting of form
    e.preventDefault();
    var text = $('#text').val();
    //send input to Alquist
    sendInput(text);
    //Erase input field
    $('#text').val("");
    //Show user's input immediately
    showUserMessage(text);
});

//send message to Alquist by REST
function sendInput(text) {
    $.ajax({
        url: endpoint,
        dataType: 'json',
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({"text": text, "state": state, "context": context, "session": session}),
        processData: false,

        success: function (data, textStatus, jQxhr) {
            // save state, context and session
            state = data["state"];
            context = data["context"];
            session = data["session"];
            //show Alquist's response
            showSystemMessage(data["text"]);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

//Shows response of Alquist
function showSystemMessage(texts) {
    for (var i = 0; i < texts.length; i++) {
        var well = $('<div class="well"><div class="clearfix"><table><tr><td><img src="img/Alquist.png" class="profile_picture"></td><td><b>Alquist:</b><span> ' + texts[i] + '</span></td></tr></table></div></div>');
        //TODO ADD DELAY TIME
        setTimeout(function () {
            $("#communication_area").append(well.fadeIn("medium"))
        }, 0);
        //scroll to bottom of page
        $("html, body").animate({scrollTop: $(document).height()}, scrollToBottomTime);
    }
}

//Shows message of user
function showUserMessage(text) {
    //Show it on page
    var well = $('<div class="well"><div class="clearfix"><table><tr><td><img src="img/User.png" class="profile_picture"></td><td><b>User:</b><span> ' + text + '</span></td></tr></table></div></div>');
    $("#communication_area").append(well);
    //scroll to bottom of page
    $("html, body").animate({scrollTop: $(document).height()}, scrollToBottomTime);
}

// Gets parameter by name
function getParameterByName(name, url) {
    var arr = url.split('#');
    var match = RegExp('[?&]' + name + '=([^&]*)')
        .exec(arr[0]);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

//Get endpoint of Alquist from URL parameters
function getEndpoint() {
    //Get endpoint from URL
    var endpoint = getParameterByName("e", window.location.href);
    //Use default, if no endpoint is present
    if (endpoint == null) {
        endpoint = "http://localhost:5000/";
    }
    return endpoint;
}

//show buttons
function showButtons(buttons) {
    //clear old buttons
    $('#buttons').empty();
    //create button
    for (var i = 0; i < buttons.length; i++) {
        var buttonElement = $('<button type="button" class="btn btn-default button">' + buttons[i].text + '</button>');
        $('#buttons').append(buttonElement);
        buttonElement.click(createButtonClickCallback(buttons[i].input));
    }
    // show button smoothly
    $('#buttons').show(showHideTime);
    //scroll to bottom of page
    $("html, body").animate({scrollTop: $(document).height()}, scrollToBottomTime);
}

// callback function for button click
function createButtonClickCallback(text) {
    return function () {
        sendInput(text);
        showUserMessage(text);
        hideButtons();
    }
}

//hide buttons smoothly
function hideButtons() {
    $('#buttons').hide(showHideTime, function () {
        $('#buttons').empty();
    });
}

//show input form
function showInput() {
    $('#form').show(showHideTime);
    //scroll to bottom of page
    $("html, body").animate({scrollTop: $(document).height()}, scrollToBottomTime);
}

//hide input form
function hideInput() {
    $('#form').hide(showHideTime);
}