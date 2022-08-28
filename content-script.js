function init() {
  const menuBarXPath = '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[1]/div[1]/div/div/div/div'

  let menuBar = document.evaluate(menuBarXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null,).singleNodeValue;

  let menuBarExists = setInterval(function () {
    if(menuBar) {
      clearInterval(menuBarExists);
      createToggleElement(menuBar);
    }
    menuBar = document.evaluate(menuBarXPath,document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null,).singleNodeValue;
  }, 100)

  let timeline = document.querySelector("[aria-label='Share Tweet']");
  let timelineExists = setInterval(function () {
    if(timeline) {
      clearInterval(timelineExists);
      console.log("Timeline exists!");
      hideThreads();
      setupMutationObserver();
    }
    timeline = document.querySelector("[aria-label='Share Tweet']");
  })

  function setupMutationObserver() {
    const targetNode = document.querySelector("[aria-label='Home timeline']");
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
      hideThreads();
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }
}
init();

// Execute this code when the toggle is clicked
function clickToggle() {
  hideStatus = document.querySelector('#toggle-input').checked;
  chrome.storage.sync.set({ hideStatus });
  hideThreads();
}

// Append the toggle button to the menu on twitter.com
function createToggleElement(menu) {

  let divElement = document.createElement('div');
  divElement.className = 'toggle-container';

  let labelElement = document.createElement('label');
  labelElement.className = 'switch';

  let textElement = document.createElement('p');
  textElement.innerHTML = 'Hide Threads';

  const colorSwatchXPath = '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[1]/div[1]/div/div/div/div/div[1]/div[1]/h2/span';
  let colorSwatchElement = document.evaluate(colorSwatchXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null,).singleNodeValue;
  let fontColor = window.getComputedStyle(colorSwatchElement , null).getPropertyValue('color')
  textElement.style.color = fontColor;
  
  let inputElement = document.createElement('input');
  inputElement.checked = false;
  inputElement.type = 'checkbox';
  inputElement.id = 'toggle-input'

  chrome.storage.sync.get("hideStatus", ({ hideStatus }) => {
    inputElement.checked = hideStatus;
  });

  let spanElement = document.createElement('span');
  spanElement.classList = 'slider round';
  
  divElement.appendChild(textElement);
  labelElement.appendChild(inputElement);
  labelElement.appendChild(spanElement);
  inputElement.addEventListener('click', clickToggle);
  divElement.appendChild(labelElement)
  menu.insertBefore(divElement, menu.children[1])
}

function hideThreads() {
  var xpath = "//span[text()='Show this thread']";
  const threadElements = document.evaluate(xpath, document,  null, XPathResult.ANY_TYPE, null);

  let currentThread = threadElements.iterateNext();
  let arrayOfThreads = [];

  while (currentThread) {
    arrayOfThreads.push(currentThread)
    currentThread = threadElements.iterateNext();
  }

  arrayOfThreads.forEach((thread) => {
    while(thread.parentNode && thread.parentNode.nodeName.toLowerCase() != 'article') {
      thread = thread.parentNode
    }

    chrome.storage.sync.get("hideStatus", ({ hideStatus }) => {
      if(hideStatus) {
        thread.style.display = 'none';
      }
      else {
        thread.style.display = 'block';
      }
    });
  })
}