// ==UserScript==
// @name         HF Convo Auto-Full Screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically full screen the convo room.
// @author       James
// @include      https://hackforums.net/convo.php*
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/
// @grant        none
// ==/UserScript==
//
// ------- CHANGE LOG -------
// Initial release.
// ---------------------------

(function() {
    'use strict';

    Convo.processFullscreenToggle();
})();