/*global interactive */
/**
 * DraggableLayer
 * supports dragging of items with Draggable mixin
 * on touch screens and desktop
 * provides the following callbacks  
 *
 *  _dragStart(o)
 *  _drag(o)
 *  _dragEnd(o)
 *
 *  provides an object with, x, y, v = Vector (Point) from 
 *  original point to current point
 *
 */
Ext.define('interactive.DraggableLayer', {

    extend: 'interactive.ClickableLayer',
    mixins: ['interactive.Draggable'],
    constructor: function (props) {
        this.callParent([props]);
        var layer = this;
        this.dragging = false;

        function normalizeTouchEvent(event) {
            var singleTouchEvent;
            //normalize multitouch
            //there should only be a single changedTouch - which fired the event
            if (event.changedTouches) {
                singleTouchEvent = event.changedTouches[0];
                singleTouchEvent.type = event.type;
            }
            return singleTouchEvent || event;
        }
        //normalize touch events to mouse events
        this.canvas.addEventListener('touchstart', function (event) {
            layer._mousedown(normalizeTouchEvent(event));
        }, false);

        this.canvas.addEventListener('touchmove', function (event) {
            event.preventDefault();
            layer._mousemove(normalizeTouchEvent(event));
        }, false);

        this.canvas.addEventListener('touchend', function (event) {
            layer._mouseup(normalizeTouchEvent(event));
        }, false);

        this.canvas.addEventListener('mousedown', Ext.Function.bind(this._mousedown, this), false);
    },

    _mousedown: function (event) {
        if (event.type === "touchstart") {
            this.canvas.removeEventListener('mousedown', Ext.Function.bind(this._mousedown, this), false);
        }
        if (event.type === "mousedown") {
            this.dragging = true;
            this.canvas.addEventListener('mousemove', Ext.Function.bind(this._mousemove, this), false);
            this.canvas.addEventListener('mouseup', Ext.Function.bind(this._mouseup, this), false);
        }
        this._startdrag(event);
    },

    _mousemove: function (event) {
        //touch events move always trigger drag
        if (event.type === "touchmove") {
            this._drag(event);
            //check if dragging === true for mousemove events as they fire on hover also
        } else if (event.type === "mousemove" && this.dragging) {
            this._drag(event);
        }
    },

    _mouseup: function (event) {
        if (event.type === "touchend") {
            this._enddrag(event);
        } else if (event.type === "mouseup" && this.dragging) {
            this._enddrag(event);
            this.dragging = false;
            this.canvas.removeEventListener('mousemove', Ext.Function.bind(this._mousemove, this), false);
            this.canvas.removeEventListener('mouseup', Ext.Function.bind(this._mouseup, this), false);
        }
    },

    _startdrag: function (event) {
        this.handleEvent('startdrag', event);
    },

    _drag: function (event) {
        this.handleEvent('drag', event);
    },

    _enddrag: function (event) {
        this.handleEvent('enddrag', event);
    },

    handleEvent: function (evtName, event) {
        //this.callParent([evtName, event]);   //get coords realtive to the canvas
        var x = event.clientX - this.canvas.offsetLeft;
        var y = event.clientY - this.canvas.offsetTop;
        //detect if any shapes contain the event position
        this.items.forEach(function (shape) {
            if (shape.active && shape[evtName]) {
                if (shape.containsPoint(x, y)) {
                    //fire event
                    shape[evtName](x - shape.x, y - shape.y, event.identifier || 'single');
                }
            }
        });
        //also fire drag event on self
        if (this[evtName]) {
            this[evtName](x - this.x, y - this.y);
        }
    }

});
