// ==UserScript==
// @name         HF: Favorite Sub-Forums Tab
// @description  Add a favorite sub-forums tab and section to the home page.
// @version      0.0.1
// @author       James
// @iconURL      https://github.com/moodiest/Userscripts/raw/master/icon.jpg
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20Favorite%20Sub-Forums%20Tab.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20Favorite%20Sub-Forums%20Tab.user.js
// @match        https://hackforums.net/index.php
// @match        https://hackforums.net/
// @match        https://hackforums.net/forumdisplay.php?fid=*
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

var Favorites = {
    init: function () {
        if (document.URL.contains(`forumdisplay.php`)) {
            Favorites.addFavBtn();
        }
        else if (document.URL == `https://hackforums.net/index.php` || document.URL == `https://hackforums.net/` || document.URL == `https://hackforums.net/#`) {
            Favorites.addFavSection();
        }
    },

    addFavSection: function () {
        let tabHTML = `<li><a href="#" rel="tabmenu_24601" rev="" class="">Favorites</a></li>`;
        let tabElement = document.querySelector(`ul#menutabs`);
        $(tabElement).prepend(tabHTML);

        let sectionStartHTML = `<div id="tabmenu_24601" style="display: none;">
<table border="0" cellspacing="0" cellpadding="5" class="tborder">
<thead>
<tr>
<td class="thead" colspan="5">
<!-- <div class="expcolimage"><i id="cat_7_img" class="expander expcolimage-fa" title="[-]"></i></div> -->
<div><strong><a href="javascript:void(0)">Favorites</a></strong></div>
</td>
</tr>
</thead>
<tbody style="" id="cat_7_e">
<tr>
<td class="tcat mobile-remove" colspan="2"><span class="smalltext"><strong>Forum</strong></span></td>
<td class="tcat mobile-remove tcenter" width="85" style="white-space: nowrap;"><span class="smalltext"><strong>Threads</strong></span></td>
<td class="tcat mobile-remove tcenter" width="85" style="white-space: nowrap;"><span class="smalltext"><strong>Posts</strong></span></td>
<td class="tcat mobile-remove tcenter" width="350"><span class="smalltext"><strong>Last Post</strong></span></td>
</tr>`;
        let sectionMiddleHTML = ``;

        let favSFs = GM_SuperValue.get(`favSubForums`, {});

        let trElements = document.querySelectorAll(`tbody > tr`);
        trElements.forEach(function (item) {
            try {
                let href = item.querySelector(`td:nth-child(2) > div.td-foat-left.mobile-link > strong > a`).href;
                let fid = href.split(`forumdisplay.php?fid=`)[1];
                if (fid in favSFs) {
                    sectionMiddleHTML += `<tr>${item.innerHTML}</tr>`;
                }
            } catch (e) {
                return;
            }
        });

        let sectionEndHTML = `</tbody></table><br></div>`;

        let sectionHTML = `${sectionStartHTML}${sectionMiddleHTML}${sectionEndHTML}`;
        let sectionElement = document.querySelector(`#content > div > div.forum-content`);
        $(sectionElement).prepend(sectionHTML);

        if(typeof ddtabcontent !== 'undefined') {
            var myflowers=new ddtabcontent("menutabs");
            myflowers.setpersist(true);
            myflowers.init();
        };
    },

    addFavBtn: function () {
        let fid = document.URL.split(`forumdisplay.php?fid=`)[1];

        let favSFs = GM_SuperValue.get(`favSubForums`, {});
        let isFav = (fid in favSFs);
        let favText = Favorites.getFavText(isFav);

        let favBtnHTML = `<a href="javascript:void(0);" id="addFavBtn-${fid}" title="${favText} favorites" rel="nofollow"><i class="fa-heart quick-love-heart far fa-lg"></i></a>&nbsp;&nbsp;|&nbsp;&nbsp;`;

        let navElement = document.querySelector("table.tborder.clear > tbody > tr > td.thead > div.float_right > span.smalltext > strong");
        $(navElement).prepend(favBtnHTML);

        $(`#addFavBtn-${fid}`).on('click', function (event) {
            if (confirm(`${favText} your favorites?`)) {
                Favorites.addFav(fid);
            }
        });
    },

    addFav: function (fid) {
        let favSFs = GM_SuperValue.get(`favSubForums`, {});
        let isFav = (fid in favSFs);

        if (isFav) {
            delete favSFs[fid];
        } else {
            favSFs[fid] = document.querySelector(`tbody > tr > td.thead > div > h1`).textContent;
        }

        GM_SuperValue.set(`favSubForums`, favSFs);

        //console.log(`${Favorites.getFavText(isFav)} favorites - ${document.querySelector(`tbody > tr > td.thead > div > h1`).textContent}`);
    },

    getFavText: function (isFav) {
        if (isFav) {
            return "Remove from";
        } else {
            return "Add to";
        }
    }

}

Favorites.init();