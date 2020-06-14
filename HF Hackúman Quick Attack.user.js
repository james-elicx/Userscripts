// ==UserScript==
// @name         HF Hackúman Quick Attack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Attack a hackúman without having to go through the popup menu.
// @author       James
// @include      https://hackforums.net/hackuman.php*
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20Hack%C3%BAman%20Quick%20Attack.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20Hack%C3%BAman%20Quick%20Attack.user.js
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
//
// ------- CHANGE LOG -------
// Initial release.
// ---------------------------

var main = function () {
    $(function () {
        let myHUM = GM_SuperValue.get('myHUM', 0);
        log(`My Hackúman ID: ${myHUM}`);

        if (window.location.href.indexOf("battle") > -1) {
            battlePage(myHUM);
        }
        else if (!(window.location.href.indexOf("battle") > -1) && !(window.location.href.indexOf("crew") > -1) && !(window.location.href.indexOf("shop") > -1) && !(window.location.href.indexOf("activity") > -1)) {
            mainPage();
        }
    });
};

function log(message) {
    console.log('[Hackúman Plus] ' + message);
}

function mainPage () {
    let allHUM = document.querySelectorAll("div.hum-mon-container");

    allHUM.forEach(function(singleHUM) {
        if ($(singleHUM).find("hum-options-container") && !(singleHUM.getAttribute("data-hid") == 0)) {
            let optionsContainer = singleHUM.querySelector(".hum-options-container");
            let thisHUM = singleHUM.getAttribute("data-hid");
            let setAttackerDiv = `<div class="hum-options-choice humPlusUS-set-attacker-${thisHUM}" style="height: 50px; display: flex; cursor: pointer;"><i class="fa fa-cog fa-lg" aria-hidden="true" style="flex: 0 0 50px; text-align: left; color: #e2e2e2; position: relative; top: 11px; left: 13px;"></i><span style="color: #d6d6d6;font-weight: 500;text-shadow: 0px 1px 1px #00000075;font-size: 16px;flex: 1 0 20px;padding-top: 7px;"><div>Set as Main Attacker</div><div style="font-size: 12px; font-weight: initial; color: gray;">Set as main attacker in userscript.</div></span></div>`;

            $(optionsContainer).append(setAttackerDiv);

            setAttackerDiv = document.querySelector(`div.humPlusUS-set-attacker-${thisHUM}`);
            if (setAttackerDiv) {
                setAttackerDiv.addEventListener ("click", function(){setAttackerClicked(thisHUM)}, false);
            }
        }
    });
}

function setAttackerClicked (thisHUM, zEvent) {
    GM_SuperValue.set('myHUM', thisHUM);
    log(`New Hackúman ID: ${GM_SuperValue.get('myHUM', 0)}`);
}

function battlePage (myHUM) {
    if (myHUM == 0) {
        alert("To use the HF Hackúman Plus userscript, please set your default attacking Hackúman by clicking the option in your Hackúman's options panel.");
    }
    else {
        let allHUM = document.querySelectorAll("div.hum-mon-container");

        allHUM.forEach(function(singleHUM) {
            let btnRow = singleHUM.querySelector("div > div > div > div > .pro-adv-3d-button").parentNode;
            let thisHUM = singleHUM.getAttribute("data-hid");

            $(btnRow).prepend(`<div class="pro-adv-3d-button hum-mon-button" style="width: 15px; user-select: none;" unselectable="on" onselectstart="return false;" onmousedown="return false;" id="attack_hum_${thisHUM}" onclick="HUM.humAttackHackuman(${thisHUM}, ${myHUM}, 0);"><div><span class="hum-mon-button-text">A</span></div></div>`);
            $(btnRow).append(`<div class="pro-adv-3d-button hum-mon-button" style="width: 15px; user-select: none;" unselectable="on" onselectstart="return false;" onmousedown="return false;" id="attack_hum_${thisHUM}" onclick="HUM.humAttackHackuman(${thisHUM}, ${myHUM}, 1);"><div><span class="hum-mon-button-text">S</span></div></div>`);
        });
    }
}

main();