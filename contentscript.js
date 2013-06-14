/*
 * Twitthelp - Twitter helper extension - v 1.0
 * Copyright (c) 2013 - Arpad Szucs (WhiteX)
 * contentscript.js - Loads only on Twitter follower pages
 */

/* Real things Start here */

chrome.runtime.onConnect.addListener(function(popupPort) {
  if (popupPort.name == "controlPopup") {
    popupPort.onMessage.addListener(function(msg) {
      if (msg.whichButtonWasClicked == "select-button") {
        console.log('select btn was clicked - contentscript');
        popupPort.postMessage({wantToInsertScript: "yes"});
        //injectScript(selectUsers);
        selectUsers();
        console.log('Script was injected');
      } else if (msg.whichButtonWasClicked == "click-button") {
        //injectScript(clickSelectedUsers);
        clickSelectedUsers();
        console.log('click btn was clicked - contentscript');
      }
    });
  }
});

/* Injecting JavaScript code in the DOM
 * Source: http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script
 */

// Code injector
function injectScript(func) {
  var actualCode = '(' + func + ')();';
  var script = document.createElement('script');
  script.textContent = actualCode;
  (document.head||document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
};

// User selector script
function selectUsers() {

  // select every follower
  var keyWords = RegExp (['/(web designer|web design)|(artist|graphic)|(designer|design|illustrator)|'
                          ,'(web developer|frontend|development|programmer)|(usability|ui|ux)'
                          ,'(photograpy|photographer)|(2d|3d modelling|3d)|'
                          ,'(html5|html)|(css3|css)|(php|javascript|jquery)|(seo|socialmedia)'
                          ,'(drupal)|(wordpress)|(joomla)/'].join(''), "igm");

  function higlighter (match, p1, p2, p3, offset, string) {
    switch(match) {

    case p1:
      hlColor = '#7EDBFF';
      break;

    case p2:
      hlColor = '#FFC67E';
      break;

    case p3:
      hlColor = '#7EFFA2';
      break;

    default:
      hlColor = '#7EDBFF';
    }
      return  '<span style="background: ' + hlColor + '">'+ match + '</span>';
  };

  $('.stream-item .content .bio')
    //.filter(":contains('designer')")
    .filter(function() {
        if (!$(this).hasClass('twitthelp-processed')) {
          this.innerHTML = this.innerHTML.replace(keyWords, higlighter);
          $(this).addClass('twitthelp-processed');
        };
         return keyWords.test(this.innerText);
    })
    .parent().parent().find(".not-following .follow-button")
    .css("box-shadow","0 0 0 3px rgb(0, 184, 255)")
    .addClass('twitthelp-processed');
};

//Click on selected users
function clickSelectedUsers() {
  console.log('jQuery version from content script: ' + $().jquery);
  var statsPort = chrome.runtime.connect({name: "stats"});

  $(".not-following .follow-button.twitthelp-processed").each(function(index){

    var $this = $(this),
        delaySec = randomSec();

    console.log('Time between clicks : ' + delaySec);

    $('body').animate({
      scrollTop: $(this).offset().top - 100
    }, delaySec, function(){
      //animation complete

      $this
        .click()
        .delay(500)
        .css("box-shadow","0 0 0 3px rgb(255,153,0)"); //experiment with click functionality
    statsPort.postMessage({nrOfClicks: index+1});
    });

    console.log('Click was triggered ' + (index+1) + ' times so far.');

  });

  function randomSec() {
    return Math.floor(Math.random() * 500 + 1000);
  };

};
