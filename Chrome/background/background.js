'use strict';

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  window.open('popup/popup.html', 'extension_popup');
});

var wwapp = angular.module("wwapp", []);

wwapp.controller("BackgroudController", function ($scope, $password, $settings) {

  async function getData(url) {
    let passwords = url.startsWith('file://') ? await $password.get({take: 2}) : await $password.getItemsForDomain($password.getName(url));
    let settings = await $settings.get();

    return {
      passwords: passwords,
      settings: settings
    };
  }

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

      getData(sender.url).then((p) => {
        sendResponse(p);
      });

      return true;
    });
});

// chrome.runtime.onInstalled.addListener(function () {
//     console.log("The color is green.");
//     chrome.contextMenus.create({
//         id: 'credentialManager',
//         title: 'Credential manager',
//         type: 'normal',
//     });


// });