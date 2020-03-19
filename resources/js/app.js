/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

Vue.component('chat-messages', require('./components/ChatMessages.vue').default);

Vue.component('chat-form', require('./components/ChatForm.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */



const app = new Vue({
    el: '#app',

    data: {
        messages: []
    },

    created() {
        let _this = this;

        Echo.private('chat')
            .listenForWhisper('typing', (e) => {
                this.user = e.user;
                this.typing = e.typing;

                // remove is typing indicator after 0.9s
                setTimeout(function() {
                    _this.typing = false
                }, 900);
            });
        this.listenForChanges();
        this.fetchMessages();

        Echo.private('chat')
            .listen('MessageSent', (e) => {
                this.messages.push({
                    message: e.message.message,
                    user: e.user
                });
            });
    },


    methods: {
        fetchMessages() {
            axios.get('/messages').then(response => {
                this.messages = response.data;
            });
        },

        addMessage(message) {
            this.messages.push(message);
            axios.post('/messages', message).then(response =>{
                // console.log(response.data);
            });
        },

        listenForChanges() {
            Echo.channel('title')
                .listen('MessagePublished', messages => {
                    if (! ('Notification' in window)) {
                        alert('Web Notification is not supported');
                        return;
                    }

                    Notification.requestPermission( permission => { console.log(messages);
                        let notification = new Notification(messages.user + " " +'has sent message!!', {
                           // body: messages.user,
                            body: messages.message, // content for the alert
                        });

                        // link to page on clicking the notification
                        notification.onclick = () => {
                            window.open(window.location.href);
                        };
                    });
                })
        },
        isTyping() {
            let channel = Echo.private('chat');

            setTimeout(function() {
                channel.whisper('typing', {
                    user: Laravel.user,
                    typing: true
                });
            }, 3000);
        },
    }
});

