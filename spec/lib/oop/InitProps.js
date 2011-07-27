/**
 * Use this as a base class to enable passing value objects 
 * to constructor functions of subclasses to initialize
 * object properties. A second object is used for default values
 */
Ext.define('oop.InitProps', {

    constructor: function (props) {
        if (props) {
            Ext.apply(this, props);
        }
    },
    //utility function to apply defaults to props
    //returns an array as this is only used as argument to callParent()
    applyProps: function (props, defaults) {
        return [Ext.applyIf(props, defaults || {})];
    }


});
