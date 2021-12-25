// Add mw.loader.load('https://backup.blog.xtexx.ml/storage/mediawiki_auto_minor.js');
// Please use backup domain only because the main domain could not response ContentType correctly.

if(document.querySelectorAll("#wpMinoredit").length != 0) {
  document.querySelectorAll("#wpMinoredit")[0].click()
}

window.autominor_oldConsoleLog = console.log;
console.log = function(text) {
  autominor_oldConsoleLog.apply(this, arguments);
  if(text == "Wikiplus加载完毕") {
    window.autominor_oldDisplayQuickEditInterface = Wikiplus.displayQuickEditInterface;
    Wikiplus.displayQuickEditInterface = function() {
      window.autominor_oldDisplayQuickEditInterface.apply(this, arguments);
      document.querySelectorAll('#Wikiplus-Quickedit-MinorEdit')[0].click()
    }
  }
}
