// fetch(
//   "https://api.nowcerts.com/api/InsuredDetailList()?$filter=(changeDate ge 2022-07-20T00:00:00Z and changeDate le 2022-08-29T23:59:00Z) and active eq true and eMail ne null &$count=true",
//   { mode: "cors" }

// )
//   .then(function (response) {
//     // The API call was successful!
//     if (response.ok) {
//       return response.json();
//     } else {
//       return Promise.reject(response);
//     }
//   })
//   .then(function (data) {
//     // This is the JSON from our response
//     fillforms(data);
//   })
//   .catch(function (err) {
//     // There was an error
//     console.warn("Something went wrong.", err);
//   });

// fillField(document.querySelector('input[name="firstName"]'), "Rashid");
// fillField(document.querySelector('input[name="lastName"]'), "Ali");
// fillField(document.querySelector('input[name="Username"]'), "rashid327");
// fillField(document.querySelector('input[name="Passwd"]'), "#EDee@ZXSS");
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl00$__Number$TextBox1"]'
//   ),
//   "LN23223"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl00$__Number$TextBox1"]'
//   ),
//   "LN23223"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl01$__EffectiveDate$ceDate$dateInput"]'
//   ),
//   "04/19/2023"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl02$__ExpirationDate$ceDate$dateInput"]'
//   ),
//   "04/19/2024"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl03$__BindDate$ceDate$dateInput"]'
//   ),
//   "04/26/2023"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl04$__BinderId$TextBox1"]'
//   ),
//   "1245"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl05$__BusinessType$ddlEnum"]'
//   ),
//   "Renewal"
// );

// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl08$__PolicyURL$TextBox1"]'
//   ),
//   "http://policy.com"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl16$__SelectedAgents$rptAgents$ctl00$usrAgent$ddlContactPersons"]'
//   ),
//   "agent 2038"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl19$__LinesOfBusinessAndFees$usrEndorsementsAndCommissions$ddlBillingType"]'
//   ),
//   "Direct Bill 100%"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl19$__LinesOfBusinessAndFees$usrEndorsementsAndCommissions$usrCustomEndorsementTemplates$ddlEndorsementTemplate"]'
//   ),
//   "Taxes"
// );

// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl22$__ProductName$TextBox1"]'
//   ),
//   "CA Policy"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl24$__ApprovedForCommissions_Date$ceDate$dateInput"]'
//   ),
//   "04/19/2023"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl23$__ApprovedForCommissions$CheckBox1"]'
//   ),
//   "checked"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$SelectorInsuredState$ddlInsureds"]'
//   ),
//   "ATS LINK LLC"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$SelectorInsuredState$usrState$ddlStates"]'
//   ),
//   "California"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$SelectorInsuredState$userSelectorAgencyLocations$ddlLocations"]'
//   ),
//   "[Default]"
// );
// fillField(
//   document.querySelector(
//     'input[name="ctl00$ContentPlaceHolder1$FormView1$SelectorInsuredState$ddlRenewalQuotes"]'
//   ),
//   "Renewal"
// );
// fillField(document.querySelector('input[name="ctl00$ContentPlaceHolder1$FormView1$ctl01$ctl04$__BinderId$TextBox1"]'), '1245');

function fillField(selector, value) {
  var field = selector();
  fillField(field, value);
}

function fillField(field, value) {
  if (field) {
    field.value = value;
  }
}

inputs = document.getElementsByTagName("input");
var array = [];
for (index = 0; index < inputs.length; ++index) {
  var e = inputs[index];
  array.push(e);
}
const myObject = {};

array.forEach((e) => {
  if (e.name || e.id) {
    if (e.name.includes("__")) {
      var val = e.name.split("__")[1];
      if (val) {
        if (val.includes("$")) {
          var final = val.split("$")[0];
          if (final) {
            var arr = [];
            arr.push(final);
            arr = [...new Set(arr)];
            for (const value of arr) {
              myObject[value] = e.name;
            }
          }
        }
      }
    } else {
      var arr = [];
      arr.push(e.name);
      arr = [...new Set(arr)];
      for (const value of arr) {
        myObject[value] = e.name;
      }
    }
  }
});
