Ext.define('canvasutils.Context2D', {
    //default config
    extend: 'geometry.Plane',
    constructor: function (props) {
        this.callParent(this.applyProps(props, {
            canvasId: 'canvas',
            bg: '#000000',
            strokeStyle: '#00FF00',
            fillStyle: '#FF0000',
            fullscreen: true
        }));
        this.canvas = document.getElementById(this.canvasId);

        this.ctx = this.canvas.getContext('2d');

        this.resize();
        this.reset();
    },
    /**
     * resize the context to be same as the canvas element
     * or if fullscreen , resize both canvas and context 
     * to size of document
     */
    resize: function () {
        if (this.fullscreen) {
            this.canvas_width = document.documentElement.clientWidth;
            this.canvas_height = document.documentElement.clientHeight;
        }
        this.width = this.canvas_width;
        this.height = this.canvas_height;
        this.canvas.setAttribute('width', this.canvas_width);
        this.canvas.setAttribute('height', this.canvas_height);
    },

    reset: function () {
        this.ctx.fillRect(0, 0, this.canvas_width, this.canvas_height);
        this.ctx.strokeStyle = '#00FF00';
        this.ctx.font = "24px Verdana,Arial,sans-serif";
    },

    applyStroke: function (col) {
        this.ctx.strokeStyle = col;
    },

    applyFill: function (col) {
        this.ctx.fillStyle = col;
    }

});
