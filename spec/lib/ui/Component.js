/**
 * Components are similar in functionality to Sprites
 * but they are also Clickable and inherit from Square
 */
Ext.define('ui.Component', {
    extend: 'drawable.DrawableSquare',
    mixins: ['collision.Collision', 'interactive.Clickable'],
    constructor: function (props) {
        this.callParent(this.applyProps(props, {
            active: true,
            clickable: true
        }));
    }
});
