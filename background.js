/*
 * Twitthelp - Twitter helper extension - v 1.0
 * Copyright (c) 2013 - Arpad Szucs (WhiteX)
 * background.js - extension initializer - always loads
 */

var twitterURL = /twitter\.com\/.*follow(ing|ers)/igm;

function checkURL (tabId, change, tab) {
  var regExMatch = twitterURL.test(tab.url);
  //console.log('Regex match: ' + regExMatch + '\nRegex match without variable: ' + twitterURL.test(tab.url));
  //console.log('Tab URL: ' + tab.url + '\nTab ID: ' + tab.id + '\n');
  if (regExMatch) {
    chrome.pageAction.show(tab.id);
    console.log('Page action is visible');
  }
};

// Check for valid URL on change
chrome.tabs.onUpdated.addListener(checkURL);
