// ==UserScript==
// @name         HF API Add Links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add links to the API control panel in the subforum and a subforum link in the api control panel.
// @author       James
// @include      https://hackforums.net/usercp.php?action=api*
// @include      https://hackforums.net/forumdisplay.php?fid=375
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20API%20Add%20Links.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20API%20Add%20Links.user.js
// @grant        none
// ==/UserScript==
//
// ------- CHANGE LOG -------
// Initial release.
// ---------------------------

(function() {
    'use strict';

	if (window.location.href.indexOf("usercp.php") > -1) {
	   let menuButtons = document.querySelector(".oc-item .float_right");
	   $(menuButtons).prepend("<a href=\"forumdisplay.php?fid=375\" class=\"button\" title=\"Go to the API forum.\" style=\"margin-right:4px;\"><i class=\"fas fa-edit\"></i><span style=\"margin-left: 8px; font-weight: 500;\">API Forum</span></a>");
	}

	if (window.location.href.indexOf("forumdisplay.php") > -1) {
		let menuButtons = document.querySelector(".wrapper .float_right");
		$(menuButtons).prepend("<a href=\"usercp.php?action=api\" class=\"button\" title=\"Applications you have authorized to access the API on your behalf.\"><i class=\"fas fa-key fa-lg\"></i><span style=\"margin-left: 8px; font-weight: 500;\">Authorized Apps</span></a> <a href=\"usercp.php?action=apideveloper\" class=\"button\" title=\"View your API developer clients and keys here.\"><i class=\"fas fa-code fa-lg\"></i><span style=\"margin-left: 8px; font-weight: 500;\">Developer</span></a> <a href=\"usercp.php?action=apinew\" class=\"button\" title=\"Are you a developer making a new app? Start here.\"><i class=\"fas fa-plus-circle fa-lg\"></i><span style=\"margin-left: 8px; font-weight: 500;\">New App</span></a></div>");
	}

})();