Ext.define('geometry.Vector', {
    extend: 'oop.InitProps',
    constructor: function (props) {
        this.applyProps(props, {
            angle: 0
        });
    }
});
