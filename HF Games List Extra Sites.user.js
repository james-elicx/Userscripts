// ==UserScript==
// @name         HF Games List Extra Sites
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add extra sites to the games list
// @author       James
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20Games%20List%20Extra%20Sites.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20Games%20List%20Extra%20Sites.user.js
// @match        https://*.hackforums.net/*
// @grant        none
// ==/UserScript==
//
// ------- CHANGE LOG --------
// Added Lynx's raffle site.
// ----- SUPPORTED SITES -----
// Lynx's Raffle Site - sociopath.cc/gamble
// ---------------------------


(function() {
    'use strict';

    let panelLinks = document.querySelector(".panel_links");
    let gameList = panelLinks.querySelectorAll(".button-dropdown")[2];
    let gameListContent = gameList.querySelectorAll(".dropdown-menu")[0];

    // Lynx's Raffle Site
    $(gameListContent).append("<li style=\"display: block; padding: 8px 0px;\"><a href=\"https://sociopath.cc/gamble/\" class=\"usercp\" title=\"Lynx's Raffle\"><i class=\"fa fa-ticket fa-lg\" aria-hidden=\"true\"></i><span style=\"font-size: 15px; color: #efefef;\">Lynx's Raffle</span></a></li>");

})();