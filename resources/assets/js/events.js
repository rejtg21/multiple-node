import $ from 'jquery';
import moment from 'moment';

import io from 'socket.io-client';

const socket = io();

socket.on('connect', function() {
    console.log('successfully connected to socket server');
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

function renderOwnChat(value) {
    let data = {
        message: value,
        time: moment().format('h:mm:ss A')
    };

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

socket.on('message', function(data) {
    renderChat(data);
});

$('#chatInput').on('keyup', function(event) {
    if (event.which != 13) return;
    // if enter is pressed
    event.preventDefault();

    let chatInput = $(this);
    let val = chatInput.val();
    renderOwnChat(val);
    socket.emit('sendMessage', val);

    chatInput.val('');
});

$('#sendBtn').on('click', function() {
    let chatInput = $('#chatInput');
    let val = chatInput.val();
    renderOwnChat(chatInput.val());
    socket.emit('sendMessage', val);
    chatInput.val('');
});
