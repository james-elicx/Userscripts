// ==UserScript==
// @name         HF: Convo Tag Notification Sound
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Plays the convo notification sound when you are tagged.
// @author       James
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20Convo%20Tag%20Notification%20Sound.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20Convo%20Tag%20Notification%20Sound.user.js
// @iconURL      https://github.com/moodiest/Userscripts/raw/master/icon.jpg
// @match        https://hackforums.net/convo.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    Convo.socket.on('convo_receivemessage', function(data) {
        var userURL = `https://hackforums.net/member.php?action=profile&uid=${socket_uid}`;
        if (data.message.includes(userURL)) {
            new Convo.initSound(convo_sound_src).play();
        }
    });
})();