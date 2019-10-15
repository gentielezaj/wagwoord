'use strict';

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  window.open('popup/popup.html', 'extension_popup');
});

var wwapp = angular.module("wwapp", []);

wwapp.controller("BackgroudController", function ($scope, $password, $settings, $blacklist) {

  async function getData(url) {
    let passwords = url.startsWith('file://') ? await $password.get({
      take: 2
    }) : await $password.getItemsForDomain($password.getName(url));
    let settings = await $settings.get();
    let blacklist = await $blacklist.getForDomain(url);

    return {
      passwords: passwords,
      settings: settings,
      blacklist: blacklist
    };
  }

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

      getData(sender.url).then((p) => {
        sendResponse(p);
      });

      return true;
    });

  async function update() {
    await $password.update();
    await $blacklist.update();
    setTimeout(() => update(), 60000);
  }

  update().then();
});

// chrome.runtime.onInstalled.addListener(function () {
//     console.log("The color is green.");
//     chrome.contextMenus.create({
//         id: 'credentialManager',
//         title: 'Credential manager',
//         type: 'normal',
//     });


// });