// ==UserScript==
// @name         Search Google Maps Back (Aggiornato)
// @namespace    http://tampermonkey.net/
// @version      2025.07.30.3
// @description  Riporta il pulsante "Maps" nella ricerca Google e rende cliccabili le mappe nei risultati
// @author       Patch by ChatGPT
// @match        https://www.google.com/search*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let addedButton = false;
    let patchedMiniMap = false;

    function addBigMapButton() {
        if (addedButton) return;

        const bigMapContainer = document.querySelector('.EeWPwe');
        if (!bigMapContainer) return;

        const searchQuery = new URLSearchParams(window.location.search).get('q');
        const mapsLink = `https://www.google.com/maps?q=${searchQuery}`;

        const link = document.createElement('a');
        link.href = mapsLink;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Open in Maps';
        link.style.padding = '10px 16px';
        link.style.display = 'inline-block';
        link.style.background = '#1a73e8';
        link.style.color = 'white';
        link.style.borderRadius = '4px';
        link.style.fontWeight = 'bold';
        link.style.textDecoration = 'none';
        link.style.marginTop = '10px';

        bigMapContainer.appendChild(link);
        addedButton = true;
        console.log('✅ Added "Open in Maps" manually to .EeWPwe');
    }

    function addMapsButton() {
        if (addedButton) return;

        const searchQuery = new URLSearchParams(window.location.search).get('q');
        const mapsLink = `https://www.google.com/maps?q=${searchQuery}`;

        const tabListContainer = document.querySelector('.GG4mbd .beZ0tf');
        if (!tabListContainer) return;

        const alreadyPresent = Array.from(tabListContainer.querySelectorAll('a')).some(a => a.href.includes('google.com/maps'));
        if (alreadyPresent) return;

        const listItem = document.createElement('div');
        listItem.setAttribute('role', 'listitem');

        const mapsTab = document.createElement('a');
        mapsTab.className = 'C6AK7c';
        mapsTab.href = mapsLink;
        mapsTab.target = '_blank';

        const div = document.createElement('div');
        div.className = 'mXwfNd';
        const span = document.createElement('span');
        span.className = 'R1QWuf';
        span.textContent = 'Maps';

        div.appendChild(span);
        mapsTab.appendChild(div);
        listItem.appendChild(mapsTab);

        const firstItem = tabListContainer.querySelector('div[role="listitem"]');
        if (firstItem) {
            tabListContainer.insertBefore(listItem, firstItem.nextSibling);
        } else {
            tabListContainer.appendChild(listItem);
        }

        console.log('✅ Maps tab added correctly inside tab list');
        addedButton = true;
    }

    function patchMiniMap() {
        if (patchedMiniMap) return;

        const mapContainer = document.querySelector('div[jsname="AJpLtd"], div.yXg2De');
        if (!mapContainer) return;

        const searchQuery = new URLSearchParams(window.location.search).get('q');
        const mapsLink = `https://www.google.com/maps?q=${searchQuery}`;

        // Già patchata?
        if (mapContainer.querySelector('a[data-gmaps-patched]')) return;

        const overlay = document.createElement('a');
        overlay.href = mapsLink;
        overlay.target = '_blank';
        overlay.rel = 'noopener';
        overlay.setAttribute('data-gmaps-patched', '1');

        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '10';

        mapContainer.style.position = 'relative';
        mapContainer.appendChild(overlay);

        patchedMiniMap = true;
        console.log('✅ Mini map overlay link applied');
    }

    const observer = new MutationObserver(() => {
        addMapsButton();
        addBigMapButton();
        patchMiniMap();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
