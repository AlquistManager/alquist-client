var session_id;
var index_of_last_message = 0;
var endpoint;

//Function called right after the page is loaded
$(document).ready(function () {
    //Get endpoint from URL address
    endpoint = getEndpoint();
    //Call start method on Alquist to start new session
    start();
    //Get messages from Alquist immediately
    getMessages();
    //Set interval to get messages
    setInterval(getMessages, 3000);
});

//Start new session
function start() {
    $.ajax({
        url: endpoint + 'start',
        type: 'post',
        processData: false,
        success: function (data, textStatus, jQxhr) {
            //Save session id
            session_id = data["session_id"];
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            setTimeout(start(),3000);
        }
    });
}

//Get messages from dialogue manager
function getMessages() {
    //Check if we have session_id already
    if (session_id !== undefined) {
        $.ajax({
            url: endpoint + 'session',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({"session_id": session_id}),
            processData: false,
            success: function (data, textStatus, jQxhr) {
                //Shows messages from Alquist dialogue manager
                showSystemMessages(index_of_last_message, data["session_history"]);
                //Saves index of last message, to not show same message multiple times
                index_of_last_message = data["session_history"].length;
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    }
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
        contentType: 'application/json',
        data: JSON.stringify({"session_id": session_id, "text": text}),
        processData: false,
        success: function (data, textStatus, jQxhr) {
            console.log(textStatus);
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

//Shows messages of Alquist
function showSystemMessages(index_of_last_message, message_array) {
    //Go through all messages, which was not shown yet
    for (var i = index_of_last_message; i < message_array.length; i++) {
        //Take only messages from Alquist
        if (message_array[i][0] == "System") {
            //Show it on page
            var well = $('<div class="well"><b>Alquist:</b> ' + message_array[i][1] + '</div>');
            $("#communication_area").append(well.fadeIn("medium"));
        }
    }
}

//Shows messages of user
function showUserMessage(message) {
    //Show it on page
    var well = $('<div class="well"><b>User:</b> ' + message + '</div>');
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