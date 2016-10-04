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
            showSystemMessages(data["messages"]);
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
    // escape html tags
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    hideButtons();
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
            showSystemMessages(data["messages"]);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

//Shows responses of Alquist
function showSystemMessages(messages) {
    var buttons = [];
    // absolute delay of showing the messages
    var cumulatedDelay = 0;
    for (var i = 0; i < messages.length; i++) {
        if (messages[i]['type'] == "text") {
            cumulatedDelay += messages[i]['delay'];
            showSystemMessageText(messages[i]['payload']['text'], cumulatedDelay);
        }
        else if (messages[i]['type'] == "button") {
            buttons.push({"text": messages[i]['payload']['label'], "next_state": messages[i]['payload']['next_state'],
                "type": messages[i]['payload']['type']});
        }
        else if (messages[i]['type'] == "iframe") {
            cumulatedDelay += messages[i]['delay'];
            showIframe(messages[i]['payload']['url'], messages[i]['payload']['width'], messages[i]['payload']['height'], messages[i]['payload']['scrolling'], messages[i]['payload']['align'], cumulatedDelay);
        }
    }
    setTimeout(function () {
        showButtons(buttons);
    }, cumulatedDelay);
}

// Show text message
function showSystemMessageText(text, delay) {
    var well = $('<table class="message"><tr><td><img src="img/Alquist.png" class="profile_picture"></td><td><div class="well well_system"><div class="clearfix"><b>Alquist:</b><span> ' + text + '</span></div></div></td></tr></table>');
    setTimeout(function () {
        $("#communication_area").append(well.fadeIn("medium"));
        //scroll to bottom of page
        setTimeout(function () {
            $("html, body").animate({scrollTop: $(document).height()}, scrollToBottomTime);
        }, 1);
    }, delay);
}

//Shows message of user
function showUserMessage(text) {
    // escape html tags
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    //Show it on page
    var well = $('<table class="message message_user"><tr><td><div class="well"><div class="clearfix"><b>User:</b><span> ' + text + '</span></div></div></td><td><img src="img/User.png" class="profile_picture"></td></tr></table>');
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
        if (buttons[i].type=="Main"){
            buttonElement.addClass("btn-primary");
            buttonElement.removeClass("btn-default");
        }
        $('#buttons').append(buttonElement);
        buttonElement.click(createButtonClickCallback(buttons[i].text, buttons[i].next_state));
    }
    // show button smoothly
    $('#buttons').show(showHideTime);
    //scroll to bottom of page
    $("html, body").animate({scrollTop: $(document).height()}, scrollToBottomTime);
}

function showIframe(url, width, height, scrolling, align, delay) {
    var well = $('<div class="well"><div class="clearfix"><table><tr><td><img src="img/Alquist.png" class="profile_picture"></td><td><b>Alquist:</b></td><td style="width: 100%; text-align: '+align+';"><iframe src=' + url + ' style="height: ' + height + 'px; width: ' + width + '%;" class="message_iframe" scrolling="' + scrolling + '"></iframe></td></tr></table></div></div>');
    setTimeout(function () {
        $("#communication_area").append(well.fadeIn("medium"));
        //scroll to bottom of page
        setTimeout(function () {
            $("html, body").animate({scrollTop: $(document).height()}, scrollToBottomTime);
        }, 1);
    }, delay);
}

// callback function for button click
function createButtonClickCallback(text, next_state) {
    return function () {
        state = next_state;
        sendInput("");
        showUserMessage(text);
        hideButtons();
    }
}

//hide buttons smoothly
function hideButtons() {
    $('#buttons').hide(showHideTime);
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