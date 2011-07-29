/*global interactive geometry*/
Ext.define('controller.TouchPad', {
    extend: 'ui.Component',
    requires: ['interactive.Drag', 'geometry.Point'],
    mixins: ['interactive.Draggable'],
    constructor: function (props) {
        this.callParent(this.applyProps(props, {
            strokeStyle: "",
            width: 200,
            height: 200,
            drags: {},
            //hash of identifier => Drag objects,
            multiTouch: true,
            singleTouchId: "",
            touching: false,
            touches: 0
        }));
        var self = this;
        //add listeners for dragging events provided by Draggable
        //create, update, or delete Drag objects in the drags hash
        //call the touch() callback added by onTouch() if it exists
        this.onStartDrag(function (x, y, id) {
            //do not create more than one drag object if multitouch disabled
            if (!self.multitouch) {
                if (self.touching) {
                    return;
                } else {
                    self.singleTouchId = id;
                }
            }
            self.drags[id] = new interactive.Drag({
                start: new geometry.Point({
                    x: x,
                    y: y
                }),
                end: new geometry.Point({
                    x: x,
                    y: y
                })
            });
            self.touches += 1;
            self.touching = true;
            if (self.touch) {
                self.touch("start", x, y, id, self.drags[id]);
            }
        });

        this.onDrag(function (x, y, id) {
            //ignore drags from additional touches if multitouch is disabled
            if (!self.multitouch && self.singleTouchId !== id) {
                return;
            }
            self.drags[id].dragTo(x, y);
            if (self.touch) {
                self.touch("drag", x, y, id, self.drags[id]);
            }
        });

        this.onEndDrag(function (x, y, id) {
            delete self.drags[id];

            if (!self.multitouch) {
                self.singleTouchId = "";
                self.touching = false;
            } else {
                self.touches -= 1;
                if (self.touches === 0) {
                    self.touching = false;
                }
            }

            if (self.touch) {
                self.touch("end", x, y, id);
            }
        });
    },
    //enable setting the touch() callback
    //-- can also be done in config
    onTouch: function (fn, ctx) {
        if (fn) {
            this.touch = Ext.Function.bind(fn, ctx);
        }
    }

});
