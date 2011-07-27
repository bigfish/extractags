Ext.define("eventbus.EventBus", {

    statics: {
        events: {},

        defineEvent: function (eventName) {
            //events is a hash of eventNames => array of subscribers for that event
            this.events[eventName] = [];
        },

        publish: function (eventName, payload) {
            if (this.events.hasOwnProperty(eventName)) {
                //call this event's subscribers' callback fns
                for (var i = 0; i < this.events[eventName].length; i++) {
                    var eventMap = this.events[eventName][i];
                    eventMap.callback.call(eventMap.subscriber, payload);
                }
            } //else... signal some error?
        },

        subscribe: function (eventName, callBack, subscriber) {
            if (this.events.hasOwnProperty(eventName)) {
                //TODO: dont add same subscriber and event combo twice ?
                this.events[eventName].push({
                    subscriber: subscriber,
                    callback: callBack
                });
            } //else... signal some error?
        }

    }
});
