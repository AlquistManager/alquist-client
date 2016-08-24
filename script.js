var endpoint;
var state = 'init';
var context = {};
var session = "";

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
    //Erase input field
    $('#text').val("");
    //Show user's input immediately
    showUserMessage(text);
});

//Shows response of Alquist
function showSystemMessage(texts) {
    for (var i = 0; i < texts.length; i++) {
        var well = $('<div class="well"><img src="img/Alquist.png" class="profile_picture"><b>Alquist:</b> ' + texts[i] + '</div>');
        $("#communication_area").append(well.fadeIn("medium"));
    }
}

//Shows message of user
function showUserMessage(text) {
    //Show it on page
    var well = $('<div class="well"><img src="img/User.png" class="profile_picture"><b>User:</b> ' + text + '</div>');
    $("#communication_area").append(well);
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