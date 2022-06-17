// ==UserScript==
// @name         Daily Check-In Notice
// @version      0.1
// @description  Display an alert on the menu bar if you are yet to visit the daily check-in thread.
// @author       Lions League
// @include      https://hackforums.net*
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20Daily%20Check-In%20Reminder.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20Daily%20Check-In%20Reminder.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hackforums.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const lastMs = localStorage.getItem('hf-checkin-done');

    if (!lastMs || (lastMs && lastMs.length > 0 && new Date(parseInt(lastMs)) < new Date().setUTCHours(7, 10, 0, 0) && new Date().setUTCHours(7, 10, 0, 0) < new Date())) {
        const menu = document.querySelector('#panel > div.panel-nav-lower > div.wrapper > ul.menu.panel_links');

        const menuItem = document.createElement('li');
        menuItem.id = 'checkin-checker';
        menuItem.style.color = '#ff5757';
        menuItem.innerText = 'Remember to Check-In (x)';

        menu.append(menuItem);

        document.getElementById('checkin-checker').addEventListener('click', () => {
            document.getElementById('checkin-checker').remove();
            localStorage.setItem('hf-checkin-done', new Date().valueOf());
        })
    }

    if (document.URL.includes('showthread.php')) {
        const title = document.querySelector('#content > div > article > table > tbody > tr > td > div > h1').innerText;

        const match = new RegExp(/(\w+) (\d\d?)\w+, (\d+) Check-In Thread/, 'gi').exec(title);

        if (match) {
                const today = new Date().setUTCHours(7, 10, 0, 0) < new Date();
                const todayDate = new Date().getUTCDate();
                const yesterdayDate = new Date(new Date().setUTCDate(todayDate - 1));
                const dayMatch = today ? parseInt(match[2]) === todayDate : parseInt(match[2]) === yesterdayDate;

                if (dayMatch) {
                    localStorage.setItem('hf-checkin-done', new Date().valueOf());

                    const menuItem = document.getElementById('checkin-checker');
                    if (menuItem) menuItem.remove();
                }
            }
    }
})();
