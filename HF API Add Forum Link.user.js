// ==UserScript==
// @name         HF API Add Forum Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a forum link to the API subforum on the API pages in the user control panel.
// @author       James
// @include      https://hackforums.net/usercp.php?action=api*
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20API%20Add%20Forum%20Link.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20API%20Add%20Forum%20Link.user.js
// @grant        none
// ==/UserScript==
//
// ------- CHANGE LOG -------
// Initial release.
// ---------------------------

(function() {
    'use strict';

    let menuButtons = document.querySelector(".oc-item .float_right");

    $(menuButtons).prepend("<a href=\"forumdisplay.php?fid=375\" class=\"button\" title=\"Go to the API forum.\" style=\"margin-right:4px;\"><i class=\"fas fa-edit\"></i><span style=\"margin-left: 8px; font-weight: 500;\">API Forum</span></a>");

})();