let hideStatus = true;

chrome.runtime.onInstalled.addListener(() => {
  console.log('Default - ', `hideStatus: ${hideStatus}`);
});