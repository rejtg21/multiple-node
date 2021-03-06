import $ from 'jquery';
import moment from 'moment';

import io from 'socket.io-client';
console.log('available ports', window.PORTS);
let port = window.PORTS[randomInteger(0, 1)];
let host = 'localhost';

let url = 'http://' + host + ':' + port;
const socket = io(url);

function randomInteger(from, to) {
    return Math.round(Math.random(from, to));
}
socket.on('connect', function() {
    console.log('successfully connected to socket server');
});

socket.on('messageReceive', function(data) {
    console.log('receive message', data);
    renderChat(data);
});

function renderChat(data) {
    return $('#messageContent').append(
        `<div class="row">
            <div class="card message-card m-1">
                <div class="card-body p-2">
                    <span>` + data.message + `</span>

                    <span class="float-right">` + data.time + `</span>
                </div>
            </div>
        </div>`
    );
}

function renderOwnChat(data) {

    return $('#messageContent').append(
        `<div class="row justify-content-end">
            <div class="card message-card bg-lightblue m-1">
                <div class="card-body p-2">
                    <span>` + data.message + `</span>
                    <span class="float-right mx-1"><small>` + data.time + `<i class="fa fa-check fa-fw" style="color:#66a80f"></i></small></span>
                </div>
            </div>
        </div>`
    );
}

function chat(chatInput) {
    let data = {
        message: chatInput.val(),
        time: moment().format('h:mm:ss A')
    };

    renderOwnChat(data);
    socket.emit('sendMessage', data);
}


$('#chatInput').on('keyup', function(event) {
    if (event.which != 13) return;
    // if enter is pressed
    event.preventDefault();

    let chatInput = $(this);
    chat(chatInput);

    chatInput.val('');
});

$('#sendBtn').on('click', function() {
    let chatInput = $('#chatInput');
    chat(chatInput);
    chatInput.val('');
});
