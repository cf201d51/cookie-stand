'use strict';

var stores = [
  { location: '1st and Pike', minCustPerHour: 23, maxCustPerHour: 65, avePerSale: 6.3 },
  { location: 'SeaTac Airport', minCustPerHour: 3, maxCustPerHour: 24, avePerSale: 1.2 },
  { location: 'Seattle Center', minCustPerHour: 11, maxCustPerHour: 38, avePerSale: 3.7 },
  { location: 'Capitol Hill', minCustPerHour: 20, maxCustPerHour: 38, avePerSale: 2.3 },
  { location: 'Alki', minCustPerHour: 2, maxCustPerHour: 16, avePerSale: 4.6 }
];

var firstHour = 6;
var lastHour = 20;

// The following array represents the percentage of maximum traffic that occurs during each of the hours from 6am to 8pm
// and can be used to scale the projected hourly customer traffic into more accurate values
var controlCurve = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];
var useControlCurve = false;

// Objects setup by initializeReports() to hold multiple report configurations
var cookieReport;
var customerReport;
var tosserReport;

/**
 * Creates an instance of the CSHour object (Cookie Shop Hour)
 *
 * @param {*} aHour
 * @param {*} aCustomerCount
 * @param {*} aCookieCount
 */
function CSHour(aHour, aCustomerCount, aCookieCount) {
  this.hour = aHour;
  this.customerCount = aCustomerCount;
  this.cookieCount = aCookieCount;
}

// CookieShop Object ---------------------------------------------

/**
 * Creates an instance of CookieShop and appends it to CookieShop.list
 *
 * @param {*} aLocation Location name
 * @param {*} aMinCustPerHour The minimum number of customers per hour
 * @param {*} aMaxCustPerHour The maximum number of customers per hour
 * @param {*} aAvePerSale The average number of cookies purchased per customer
 */
function CookieShop(aLocation, aMinCustPerHour, aMaxCustPerHour, aAvePerSale) {
  this.location = aLocation;
  this.minCustPerHour = aMinCustPerHour;
  this.maxCustPerHour = aMaxCustPerHour;
  this.avePerSale = aAvePerSale;
  this.simulatedDay = [];
  CookieShop.list.push(this);
}

// Array of CookieShop objects
CookieShop.list = [];

CookieShop.simulateAll = function () {
  for (var i = 0; i < CookieShop.list.length; i++) {
    CookieShop.list[i].simulateDay();
  }
};

CookieShop.prototype.simulateHour = function (aHour) {
  if (useControlCurve) {
    var customerCount = Math.round(this.maxCustPerHour * controlCurve[aHour - firstHour]);
  } else {
    var customerCount = Math.floor(Math.random() * ((this.maxCustPerHour - this.minCustPerHour) + 1)) + this.minCustPerHour;
  }
  var cookieCount = Math.round(customerCount * this.avePerSale);
  return new CSHour(aHour, customerCount, cookieCount);
};

CookieShop.prototype.simulateDay = function () {
  this.simulatedDay = [];
  for (var i = firstHour; i <= lastHour; i++) {
    this.simulatedDay[i] = this.simulateHour(i);
  }
};

// Summary Objects --------------------------------------------------------------
// Pass one of these constructor functions to the Report constructor to determine
// how summaries are calculated for columns and rows of the report

function SummarizeMax() {
  this.max = NaN;
}

/**
 * Include value to be summarized
 *
 * @param {*} aValue
 */
SummarizeMax.prototype.includeValue = function(aValue) {
  if (isNaN(this.max)) {
    this.max = aValue;
  } else {
    this.max = Math.max(this.max, aValue);
  }
};

SummarizeMax.prototype.summary = function() {
  return this.max;
};

function SummarizeSum() {
  this.sum = 0;
}

/**
 * Include value to be summarized
 *
 * @param {*} aValue
 */
SummarizeSum.prototype.includeValue = function(aValue) {
  this.sum += aValue;
};

SummarizeSum.prototype.summary = function() {
  return this.sum;
};

// Cell Value Functions -------------------------------------------
// Pass one of these functions to the Report constructor to determine
// what is reported by location and hour

function getCookieCountByLocationAndHour(aLocationIndex, aHourIndex) {
  var shop = CookieShop.list[aLocationIndex];
  if (shop) {
    var hour = shop.simulatedDay[aHourIndex];
    if (hour) {
      return hour.cookieCount;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function getCustomerCountByLocationAndHour(aLocationIndex, aHourIndex) {
  var shop = CookieShop.list[aLocationIndex];
  if (shop) {
    var hour = shop.simulatedDay[aHourIndex];
    if (hour) {
      return hour.customerCount;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function getTosserCountByLocationAndHour(aLocationIndex, aHourIndex) {
  var shop = CookieShop.list[aLocationIndex];
  if (shop) {
    var hour = shop.simulatedDay[aHourIndex];
    if (hour) {
      return Math.max(2, Math.ceil(hour.customerCount / 20));
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

// Report Object ------------------------------------------------

/**
 * Create an instance of the Report object
 *
 * @param {*} aTitle
 * @param {*} aCellValueFunction
 * @param {*} aRowSummaryConstructor
 * @param {*} aRowSummaryLabel
 * @param {*} aColSummaryConstructor
 * @param {*} aColSummaryLabel
 */
function Report(aTitle, aCellValueFunction, aRowSummaryConstructor, aRowSummaryLabel, aColSummaryConstructor, aColSummaryLabel) {
  this.title = aTitle;
  this.cellValueFunction = aCellValueFunction;
  this.RowSummaryConstructor = aRowSummaryConstructor;
  this.rowSummaryLabel = aRowSummaryLabel;
  this.ColSummaryConstructor = aColSummaryConstructor;
  this.colSummaryLabel = aColSummaryLabel;
}

Report.prototype.renderReportHeader = function() {
  var newHeader = addElement(undefined, 'thead');

  // Upper left is blank
  var newRow = addElement(newHeader, 'tr');
  addElement(newRow, 'th');

  // List the hours
  for (var i = firstHour; i <= lastHour; i++) {
    addElement(newRow, 'th', hourStr(i));
  }

  // Daily Location Summary
  addElement(newRow, 'th', this.rowSummaryLabel);
  return newHeader;
};

Report.prototype.renderReportBody = function () {
  var newBody = addElement(undefined, 'tbody');
  for (var i = 0; i < CookieShop.list.length; i++) {
    var newRow = this.renderReportRow(i);
    newBody.appendChild(newRow);
  }
  return newBody;
};

Report.prototype.renderReportRow = function (aLocationIndex) {
  var newRow = addElement(undefined, 'tr');
  addElement(newRow, 'td', CookieShop.list[aLocationIndex].location);

  var value = 0;
  var rowSummary = new this.RowSummaryConstructor();
  for (var i = firstHour; i <= lastHour; i++) {
    value = this.cellValueFunction(aLocationIndex, i);
    rowSummary.includeValue(value);
    addElement(newRow, 'td', value);
  }

  addElement(newRow, 'td', rowSummary.summary());
  return newRow;
};

Report.prototype.renderReportFooter = function () {
  var newFooter = addElement(undefined, 'tFoot');
  var newRow = addElement(newFooter, 'tr');

  addElement(newRow, 'td', this.colSummaryLabel);

  var value = 0;
  var rowSummary = new this.RowSummaryConstructor();
  for (var hourIndex = firstHour; hourIndex <= lastHour; hourIndex++) {

    var colSummary = new this.ColSummaryConstructor();
    for (var locIndex = 0; locIndex < CookieShop.list.length; locIndex++) {
      value = this.cellValueFunction(locIndex, hourIndex);
      colSummary.includeValue(value);
    }

    value = colSummary.summary();
    rowSummary.includeValue(value);
    addElement(newRow, 'td', value);
  }

  addElement(newRow, 'td', rowSummary.summary());
  return newFooter;
};

Report.prototype.renderReportTable = function () {
  var newTable = addElement(undefined, 'table');
  newTable.appendChild(this.renderReportHeader());
  newTable.appendChild(this.renderReportBody());
  newTable.appendChild(this.renderReportFooter());
  return newTable;
};

Report.prototype.renderReport = function() {
  var newReport = addElement(undefined, 'div', undefined, 'report');
  addElement(newReport, 'h3', this.title);
  newReport.appendChild(this.renderReportTable());
  return newReport;
};

function renderAllReportsToPage() {

  // Find the element to receive the output
  var reportContainer = document.getElementById('report_container');

  // Clear it
  // the below is faster than main.innerHTML = '';
  // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
  while (reportContainer.firstChild) {
    reportContainer.removeChild(reportContainer.firstChild);
  }

  addElement(reportContainer, 'h2', 'Without Control Curve');
  useControlCurve = false;
  CookieShop.simulateAll();

  reportContainer.appendChild(cookieReport.renderReport());
  reportContainer.appendChild(customerReport.renderReport());
  reportContainer.appendChild(tosserReport.renderReport());

  addElement(reportContainer, 'h2', 'With Control Curve');
  useControlCurve = true;
  CookieShop.simulateAll();

  reportContainer.appendChild(cookieReport.renderReport());
  reportContainer.appendChild(customerReport.renderReport());
  reportContainer.appendChild(tosserReport.renderReport());
}

// Helper functions ---------------------------------------------

/**
 * Generate a string with the given hour in 12 hour am/pm format
 *
 * @param {*} hour
 * @returns
 */
function hourStr(hour) {
  var result = ((hour + 11) % 12) + 1;
  if (hour >= 12) {
    result += 'pm';
  } else {
    result += 'am';
  }
  return result;
}

/**
 * This is a helper function to add an element with given tag name, optional text, and class names to the given parent
 *
 * @param {*} parent Optional parent element
 * @param {*} tagName tag name of the new element
 * @param {*} text Optional text content
 * @param {*} className Optional class name
 * @returns The newly created element
 */
function addElement(parent, tagName, text, className) {
  var newElement = document.createElement(tagName);
  if (text) {
    newElement.textContent = text;
  }
  if (className) {
    newElement.className = className;
  }
  if (parent) {
    parent.appendChild(newElement);
  }
  return newElement;
}

// Initialization Functions ---------------------------------------

function initializeStores() {
  for (var i = 0; i < stores.length; i++) {
    var s = stores[i];
    console.log(s);
    new CookieShop(s.location, s.minCustPerHour, s.maxCustPerHour, s.avePerSale);
  }
}

function initializeReports() {
  cookieReport = new Report('Daily Cookie Count', getCookieCountByLocationAndHour, SummarizeSum, 'Daily Location Total', SummarizeSum, 'Total');
  customerReport = new Report('Daily Customer Count', getCustomerCountByLocationAndHour, SummarizeSum, 'Daily Location Total', SummarizeSum, 'Total');
  tosserReport = new Report('Daily Cookie Tosser Report', getTosserCountByLocationAndHour, SummarizeMax, 'Daily Location Max', SummarizeMax, 'Max Tossers');
}

function onAddStorFormSubmit(event) {
  event.preventDefault();
  console.log('Submit!');

  renderAllReportsToPage();
}

function onSimModeChange(event) {
  var target = event.target;
  console.log(target);
  console.log(target.mode.value);
}

function initializeAddStoreForm() {
  var from = document.getElementById('add_store_form');
  from.addEventListener('submit', onAddStorFormSubmit);
}

function initializeSimModeForm() {
  var from = document.getElementById('simulation_mode');
  from.addEventListener('onchange', onSimModeChange);

}

function init() {
  initializeStores();
  initializeReports();
  initializeAddStoreForm();
  initializeSimModeForm();
}


function run() {
  init();
  renderAllReportsToPage();
}

run();
