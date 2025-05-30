var matchingObjects = null;
var matchingKey2 = null;
// Retrieve all input field names
var inputFields = document.querySelectorAll("input");
var inputFieldNames = Array.from(inputFields).map((input) => input.name);

// Retrieve all select field names
var selectFields = document.querySelectorAll("select");
var selectFieldNames = Array.from(selectFields).map((select) => select.name);

for (var key1 in data.fieldMappings) {
  const key1Value = data.fieldMappings[key1].split(".");
  if (key1Value.length > 1) {
    let matchingKey2 = null;
    if (key1Value[0] === "driver") {
      matchingObjects = data.selectedDriver;
    } else if (key1Value[0] === "vehicle") {
      matchingObjects = data.selectedVehicle;
    } else if (key1Value[0] === "insured") {
      matchingObjects = data.selectedInsured;
    } else if (key1Value[0] === "policy") {
      matchingObjects = data.selectedPolicy;
    }
    for (var key2 in matchingObjects) {
      const key2LowerCase = key2.toLowerCase();
      const key1Value1LowerCase = key1Value[1].toLowerCase();
      if (
        key2LowerCase === key1Value1LowerCase ||
        key2LowerCase.includes(key1Value1LowerCase) ||
        key2LowerCase.includes(key1Value1LowerCase.replace(/[_-]/g, ""))
      ) {
        matchingKey2 = key2; // Match found, store the key2
        break; // Exit the loop as soon as a match is found
      }
    }

    if (matchingKey2) {
      if (key1Value[2] === "input") {
        var updateValue = matchingObjects[matchingKey2];
        if (key1Value[1].includes("date")) {
          const dateTime = new Date(updateValue ? updateValue : null);
          dateTime.setMinutes(
            dateTime.getMinutes() + dateTime.getTimezoneOffset()
          );
          const year = dateTime.getFullYear();
          const month = dateTime.getMonth() + 1; // Month is zero-based, so we add 1
          const day = dateTime.getDate();
          updateValue = `${month}/${day}/${year}`;
        }
        if (key1Value[0] === "vehicle" || key1Value[0] === "driver") {
          inputFieldNames.forEach((fieldName) => {
            const getCurrentFeildName = fieldName.replace(/\d+/g, "");
            const getStoredFeildName = key1.replace(/\d+/g, "");
            if (getCurrentFeildName === getStoredFeildName) {
              key1 = fieldName;
            }
          });
        }
        const inputField = document.querySelector(`input[name="${key1}"]`);
        const inputField1 = document.querySelector(`input[id="${key1}"]`);
        if (inputField) {
          fillField(inputField, updateValue);
        } else if (inputField1) {

          fillField(inputField1, updateValue);

        } else {
          // Map field without a name or id
          mapFieldsWithoutNameOrId(key1);
        }
      } else if (key1Value[2] === "select") {
        if (key1Value[0] === "vehicle" || key1Value[0] === "driver") {
          selectFieldNames.forEach((fieldName) => {
            const getCurrentFeildName = fieldName.replace(/\d+/g, "");
            const getStoredFeildName = key1.replace(/\d+/g, "");
            if (getCurrentFeildName === getStoredFeildName) {
              key1 = fieldName;
            }
          });
        }
        const selectField = document.querySelector(`select[name="${key1}"]`);
        if (selectField) {
          fillSelect(selectField, matchingObjects[matchingKey2]);
        } else {
          console.log(`No select field found with name "${key1}"`);
        }
      }
    }
  }
}

// Function to map fields without a name or id
function mapFieldsWithoutNameOrId(parentNameAndId) {
  const parentElement = document.getElementById(parentNameAndId); // Replace "parentElementId" with the actual ID of the parent element
  if (parentElement) {
    const inputElements = parentElement.querySelectorAll("input[type='text']"); // Find all input child elements within the parent element
    for (let i = 0; i < inputElements.length; i++) {
      const inputElement = inputElements[i];
      inputElement.value = matchingObjects[matchingKey2];
      break; // Exit the loop after filling the desired input field
    }
  }
}


function fillField(field, value) {
  // debugger
  if (field) {
    // check the website in react base 
    if (Array.from(document.querySelectorAll('[id]')).some(e => e._reactRootContainer !== undefined)) {
      field.setAttribute("value", value);
      // As pointed out, we need to pass `{ bubbles: true }` to the options,
      // as React listens on the document element and not the individual input elements
      // field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
      field.dispatchEvent(new Event("blur", { bubbles: true }));
      field.removeAttribute("placeholder");
    }
    else {
      field.value = value;
      // field.setAttribute("value", value);
      try {
        //As pointed out, we need to pass `{ bubbles: true }` to the options, as React listens on the document element and not the individual input elements
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.dispatchEvent(new Event("blur", { bubbles: true }));
      } catch (error) {
        console.log("The Error is ===>", error);
      }
    }
  }
}
function fillSelect(select, value) {
  if (select) {
    for (var i = 0; i < select.options.length; i++) {
      if (
        select.options[i].text === value ||
        select.options[i].value === value
      ) {
        select.options[i].selected = true;
        break;
      }
    }
  }
}
