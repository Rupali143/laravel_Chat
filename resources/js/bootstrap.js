window._ = require('lodash');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     encrypted: true
// });

import { ChatManager, TokenProvider } from '@pusher/chatkit-client'


import Echo from "laravel-echo"
window.Pusher = require('pusher-js');
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'c6d22a406cb5c7c7a1db',
    cluster: 'ap2',
    encrypted: true
});


// var pusher = new Pusher('c6d22a406cb5c7c7a1db');
// var presenceChannel = pusher.subscribe('title');

const chatManager = new ChatManager({
    instanceLocator: 'v1:us1:b4b4df3b-2a8f-4764-aa4b-4f7bab22c0ff',
    userId: '1',
    tokenProvider: new TokenProvider({ url: '/' })
});
//
chatManager.connect()
    .then(currentUser => {
        console.log('Successful connection', currentUser)
    })
    .catch(err => {
        console.log('Error on connection', err)
    });
