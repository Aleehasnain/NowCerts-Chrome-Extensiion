
var clickedInputElement = null;
var button = null;
var fieldType = null;
var fieldsMappings = null;
let currentTabUrl;
let value = true;
document.addEventListener("click", function (event) {
  const myValue = localStorage.getItem('myKey');

if (myValue !== null) {
  // Use the value in your JavaScript code
  console.log('Value from localStorage:', myValue);
} else {
  console.log('Value not found in localStorage');
}
  if (
    (event.target.tagName.toLowerCase() === "input" &&
      (event.target.type === "text" ||
        event.target.type === "date" ||
        event.target.type === "search" ||
        event.target.type === "textarea")) ||
    (event.target.tagName.toLowerCase() === "select" &&
      event.target.type === "select-one")
  ) {
    // Store the clicked input element
    clickedInputElement = event.target;
    // Remove the previous button if it exists
    if (button) {
      document.body.removeChild(button);
      button = null;
    }
    chrome.runtime.sendMessage(
      { action: "getCurrentTabUrl" },
      function (response) {
        currentTabUrl = new URL(response.url); // Assign the URL to the global variable

        // Call a function and pass the URL as an argument for further use
        myFunction(currentTabUrl.hostname);
      }
    );
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.enabled) {
        console.log(message.enabled)
        value = true;
        // showButtonAt("", "", true)
      } else {
        console.log(message.enabled)
        // showButtonAt("", "", false)
        value = false;
         button = null;
      }
    });

    // Function that uses the URL
    function myFunction(url) {
      // Perform actions with the URL
      if (url) {
        encodeData()
          .then((response) => {
            if (
              response.whitelisted_domains &&
              response.whitelisted_domains.length
            ) {
              for (
                let index = 0;
                index < response.whitelisted_domains.length;
                index++
                ) {
                  const element = response.whitelisted_domains[index];
                  const match =url.toLowerCase() == element.domain.toLowerCase()
                  console.log('Matched');
                  if (match) {
                    if(value) {
                      console.log('valtrue');
                    // createButton(event.clientX, event.clientY)
                      showButtonAt(event.clientX, event.clientY, true);
                    } else {
                      console.log('valfalse');
                      showButtonAt(event.clientX, event.clientY, false);
                    }
                  console.log('Logged')
                  // Show the button at the clicked position
                 //chrome.storage.local.get('autofill', (result) => {
                  // if(element){
                  //   console.log(elemet);
                  //     console.log(result);
                  //  }
                   
                //  }
                 // )
                }
              }
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  } else {
    // If the click is outside the input field, remove the button
    if (button) {
      document.body.removeChild(button);
      button = null;
    }
  }
});
function encodeData() {
  const url =
    "https://dev.api.20miles.us/api/nowcerts_extension/nc_ext_whitelisted_domains";

  const requestOptions = {
    method: "GET",
  };

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Process the response data if needed
        return response.json(); // or response.text() for plain text response
      })
      .then((responseData) => {
        resolve(responseData);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
function showButtonAt(x, y,val) {
  var popupButton = document.getElementById("popupButton");

  if (val === true) {
    console.log("true" + val)
    if (!popupButton) {
      showNewButtonAt(x, y)
    }
  } else {
    console.log("false" + val)
    if (popupButton) {
      document.body.removeChild(popupButton);
    }
  }
   
}
// Function to show the button at the clicked position
function showNewButtonAt(x, y) {
  var scrolledX = window.scrollX || window.pageXOffset;
  var scrolledY = window.scrollY || window.pageYOffset;
  if (
    clickedInputElement.tagName.toLowerCase() === "select" &&
    clickedInputElement.type === "select-one"
  ) {
    scrolledY = scrolledY - 40;
  }
  var popupButton = document.getElementById("popupButton");
  
  if (popupButton) {
    // If the button already exists, remove it
    document.body.removeChild(popupButton);
  }
  var targetField;
  targetField = findNameOrId(clickedInputElement);
  chrome.storage.local.get("fieldsMappings", (result) => {
    var fieldsMappings = result.fieldsMappings;
    var button;
    // Create and style the button element
    button = document.createElement("button");
    button.id = "popupButton";
    button.style.position = "absolute";
    button.style.left = x + scrolledX + "px";
    button.style.top = y + scrolledY + "px";
    button.style.width = "40px";
    button.style.height = "40px";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "#888";
    button.style.border = "none";
    button.style.outline = "none";
    button.style.color = "#fff";
    button.style.fontSize = "8px";
    button.style.fontWeight = "bold";
    button.style.display = "flex";
    button.style.justifyContent = "center";
    button.style.alignItems = "center";
    button.style.setProperty("z-index", "2147483647", "important");
    button.textContent = "NC Autofill";

    if (fieldsMappings && fieldsMappings.hasOwnProperty(targetField)) {
      if (fieldsMappings[targetField] === "") {
        button.style.boxShadow = "inset 0 0 0 2px red";
        console.log("The value is null for the target field:", targetField);
      } else {
        console.log(fieldsMappings, "fieldsMappings");
        console.log(targetField, "targetField");
        button.style.boxShadow = "inset 0 0 0 2px green";
        console.log(
          "The value exists for the target field:",
          fieldsMappings[targetField]
        );
      }
    } else {
      button.style.boxShadow = "inset 0 0 0 2px red";
      console.log("The target field does not exist:", targetField);
    }

    // Append the button to the document body
    document.body.appendChild(button);

    // Add a click event listener to the button
    button.addEventListener("click", function () {
      // Remove the button
      document.body.removeChild(button);
      button = null;

      if (
        clickedInputElement.tagName.toLowerCase() === "input" &&
        (clickedInputElement.type === "text" ||
          clickedInputElement.type === "date" ||
          clickedInputElement.type === "search" ||
          clickedInputElement.type === "textarea")
      ) {
        fieldType = "input";
      } else if (
        clickedInputElement.tagName.toLowerCase() === "select" &&
        clickedInputElement.type === "select-one"
      ) {
        fieldType = "select";
      }
      if (targetField && fieldType) {
        var config = {
          namefeild: targetField,
          fieldtype: fieldType,
        };
        chrome.runtime.sendMessage({ action: "openExtension", data: config });
      } else {
        console.log("No suitable name or id found for the input field.");
      }
    });
  });
}

function getDataFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("fieldsMappings", (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.fieldsMappings);
      }
    });
  });
}

// Function to find the name or id from the input field or its parent elements
function findNameOrId(element) {
  let currentElement = element;
  const inputFields = document.querySelectorAll('input[name="city"]');
  console.log("Fetching Same name Input Field");
  console.log(inputFields);
  inputFields.forEach((input) => {
    const parentElement = input.closest("[id]");
    if (parentElement) {
      const parentId = parentElement.id;
      console.log("Parent element ID:", parentId);
    }
    console.log(input); // Example: Output the value of each input field
  });

  while (currentElement) {
    // Check if the current element has the name or id attribute
    if (currentElement.hasAttribute("name")) {
      return currentElement.getAttribute("name");
    }

    if (currentElement.hasAttribute("id")) {
      return currentElement.getAttribute("id");
    }

    // Move up the DOM tree
    currentElement = currentElement.parentElement;
  }

  // Return null if no suitable name or id attribute is found
  return null;
}


