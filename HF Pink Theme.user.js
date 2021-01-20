// ==UserScript==
// @name         HF: Pink Theme
// @description  Pink theme for Hack Forums.
// @version      0.0.2
// @author       James
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20Pink%20Theme.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20Pink%20Theme.user.js
// @iconURL      https://github.com/moodiest/Userscripts/raw/master/icon.jpg
// @run-at       document-start
// @include      https://hackforums.net*
// @grant        none
// ==/UserScript==

var Pink = {
    init: function () {
        Pink.addCSS();
        Pink.addLogo();
    },

    addCSS: function () {
        let styleElement = `<style>
body {
    background: #0e0e0e url(https://raw.githubusercontent.com/moodiest/Userscripts/master/HF%20Pink%20Theme/mosaic.png) fixed !important;
}

#container {
    background: rgb(11 5 11 / 70%) !important;
}

.thead, .shadetabs li a.selected, .pagination .pagination_current, .quickthread_button, .nav_con_active {
    background: #bd4aa7 !important;
}

.logo-hide-button {
    color: #bd4aa7 !important;
}
</style>`;
        (document.head || document.documentElement).insertAdjacentHTML('beforeend', styleElement);
    },

    addLogo: function () {
        new MutationObserver(function(mutations) {
            if (document.getElementsByTagName('img')[0]) {
                let logo = document.querySelector('#logo > div.wrapper > a > img');
                if (logo) {
                    logo.src = `https://raw.githubusercontent.com/moodiest/Userscripts/master/HF%20Pink%20Theme/logo.png`;
                    this.disconnect();
                }
            }
        }).observe(document, {childList: true, subtree: true});
    }
}

Pink.init();