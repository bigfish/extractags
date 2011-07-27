Ext.define('controller.Keyboard', {
    extend: 'oop.InitProps',
    statics: {
        keys: {
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            32: 'space',
            19: 'pause',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            65: 'a',
            68: 'd',
            83: 's',
            87: 'w'
        },

        getKey: function (e) {
            var evt = e || event;
            var key = this.keys[evt.keyCode];
            return key || '';
        }

    },
    context: window,
    keyUp: Ext.emptyFn,
    keyPress: Ext.emptyFn,
    constructor: function (props) {
        this.callParent([props]);
        document.onkeydown = Ext.Function.bind(this.onKeyPress, this);
        document.onkeyup = Ext.Function.bind(this.onKeyUp, this);
    },

    onKeyPress: function (e) {
        var key = this.self.getKey(e);
        this.keyPress.call(this.context, key);
    },

    onKeyUp: function (e) {
        var key = this.self.getKey(e);
        this.keyUp.call(this.context, key);
    }


});
