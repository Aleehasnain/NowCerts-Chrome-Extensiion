let extensionWindowId = null;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getCurrentTabUrl") {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      const activeUrl = tabs[0].url;
      sendResponse({ url: activeUrl });
    });
    return true; // Indicates that sendResponse will be called asynchronously
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getCurrentTabUrl") {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      const activeUrl = tabs[0].url;
      sendResponse(activeUrl);
    });
    return true; // Indicates that sendResponse will be called asynchronously
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "openExtension") {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeUrl = tabs[0].url;
      var dataToSend = {
        url: activeUrl,
        namefeild: message.data.namefeild,
        fieldtype: message.data.fieldtype,
      };
      chrome.storage.local.set({ myData: dataToSend });
      openExtensionPopup(dataToSend);
    });
    return true; // Indicates that sendResponse will be called asynchronously
  } else if (message.action === "apiSuccess") {
    // Close the extension popup window
    if (extensionWindowId !== null) {
      chrome.storage.local.remove(["myData"], function () {
        console.log("Keys removed from local storage.");
      });
      chrome.windows.remove(extensionWindowId);
      extensionWindowId = null;
    }
  } else if (message.action === "removeStorage") {
    chrome.storage.local.remove(["myData"], function () {
      console.log("Keys removed from local storage.");
    });
  }
});

function openExtensionPopup(message) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    var extensionUrl = chrome.extension.getURL("index.html");

    // Check if the extension popup is already open
    for (var i = 0; i < windows.length; i++) {
      var tabs = windows[i].tabs;
      for (var j = 0; j < tabs.length; j++) {
        if (tabs[j].url === extensionUrl) {
          chrome.windows.update(windows[i].id, { focused: true });
          extensionWindowId = windows[i].id; // Store the popup window ID
          return;
        }
      }
    }

    // Open the extension popup
    chrome.windows.create(
      {
        url: extensionUrl,
        type: "popup",
        width: 390, // Set the desired width of the popup
        height: 620, // Set height to screen height
        left: screen.availWidth - 390, // Position the popup at the right edge of the screen
        top: 0, // Position the popup at the top edge of the screen
      },
      function (window) {
        extensionWindowId = window.id; // Store the popup window ID
        chrome.runtime.sendMessage({ action: "openWindowData", data: message });
      }
    );

    // Add event listener to close the popup window when user clicks outside or minimizes it
    chrome.windows.onFocusChanged.addListener(function (windowId) {
      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        // User clicked outside the window
        if (extensionWindowId !== null) {
          chrome.storage.local.remove(["myData"], function () {
            console.log("Keys removed from local storage.");
          });
          chrome.windows.remove(extensionWindowId);
          extensionWindowId = null;
        }
      } else if (
        windowId !== chrome.windows.WINDOW_ID_NONE &&
        windowId !== extensionWindowId
      ) {
        // User switched to a different window (minimized the popup)
        if (extensionWindowId !== null) {
          chrome.storage.local.remove(["myData"], function () {
            console.log("Keys removed from local storage.");
          });
          chrome.windows.remove(extensionWindowId);
          extensionWindowId = null;
        }
      }
    });
  });
}
