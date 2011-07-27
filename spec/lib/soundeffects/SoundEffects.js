/*global soundManager */

Ext.define('soundeffects.SoundEffects', {
    statics: {
        sounds: {},
        //soundFiles = hash of soundName ==> path to mp3 file
        defineSounds: function (soundFiles) {
            var sfx = this;
            this.sounds = Ext.apply(this.sounds, soundFiles);
            window.soundManager.onready(function () {
                sfx.loadSounds();
            });
        },

        loadSounds: function () {
            for (var sound in this.sounds) {
                if (this.sounds.hasOwnProperty(sound)) {
                    window.soundManager.createSound({
                        id: sound,
                        url: this.sounds[sound]
                    });
                }
            }
        },

        play: function (sound, options) {
            if (this.sounds[sound]) {
                if (options) {
                    window.soundManager.play(sound, options);
                } else {
                    window.soundManager.play(sound);
                }
            }
        }

    }

});
