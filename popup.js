/*
 * Twitthelp - Twitter helper extension - v 1.0
 * Copyright (c) 2013 - Arpad Szucs (WhiteX)
 * popup.js - Handles the interaction with the popup
 * Library that helps to manage the communication between the Chrome.PageAction Popup and Background Page
 * @class popupController
 */

$( document ).ready(function() {

  console.log('jQuery version from popup script: ' + $().jquery);

  //Triggering actions
  $('.select-button').on('click', function() {
    //activating the click button
    $('.click-button').removeAttr('disabled');
    clickHandler('select');
  });
  $('.click-button').on('click', function() {
    clickHandler('click');
  });


  //ui controller
  function clickHandler (button) {
    statsHandler();
    chrome.tabs.getSelected(null, function(tab) {
      var popupPort = chrome.tabs.connect(tab.id, {name: "controlPopup"});
      if (button == 'select') {
        $('.click-button').delay(1000).click();
        console.log('no miva');
        popupPort.postMessage({whichButtonWasClicked: "select-button"});
      } else if (button == 'click') {
        popupPort.postMessage({whichButtonWasClicked: "click-button"});
      }
      popupPort.onMessage.addListener(function(msg) {
        if (msg.wantToInsertScript == "yes") {
        }
      });
    });
  };

  //stats
  function statsHandler () {
    var clicks = 0,
        $counter = $('.counter span');

    chrome.runtime.onConnect.addListener(function(statsPort) {
      //statsPort.postMessage({whichButtonWasClicked: "select-button"});
      statsPort.onMessage.addListener(function(msg) {
        clicks = msg.nrOfClicks;
        console.log(clicks);
        $counter.text(clicks);
      });
    });
  };

});
