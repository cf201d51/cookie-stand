'use strict';

var stores = [];

stores[0] = {
  location: '1st and Pike',
  minCustPerHour: 23,
  maxCustPerHour: 65,
  avePerSale: 6.3,
  simulatedDay: [],
  simulateDay: function () {
    for (var i = 6; i <= 20; i++) {
      this.simulatedDay.push({ hour: i, count: this.simulateHour() });
    }
  },
  simulateHour: function () {
    var custCount = Math.floor(Math.random() * ((this.maxCustPerHour - this.minCustPerHour) + 1)) + this.minCustPerHour;
    return Math.round(custCount * this.avePerSale);
  },
};

stores[1] = {
  location: 'SeaTac Airport',
  minCustPerHour: 3,
  maxCustPerHour: 24,
  avePerSale: 1.2,
  simulatedDay: [],
  simulateDay: function() {
    for (var i = 6; i <= 20; i++) {
      this.simulatedDay.push({
        hour: i,
        count: this.simulateHour()
      });
    }
  },
  simulateHour: function() {
    var custCount = Math.floor(Math.random() * ((this.maxCustPerHour - this.minCustPerHour) + 1)) + this.minCustPerHour;
    return Math.round(custCount * this.avePerSale);
  },
};

stores[2] = {
  location: 'Seattle Center',
  minCustPerHour: 11,
  maxCustPerHour: 38,
  avePerSale: 3.7,
  simulatedDay: [],
  simulateDay: function() {
    for (var i = 6; i <= 20; i++) {
      this.simulatedDay.push({
        hour: i,
        count: this.simulateHour()
      });
    }
  },
  simulateHour: function() {
    var custCount = Math.floor(Math.random() * ((this.maxCustPerHour - this.minCustPerHour) + 1)) + this.minCustPerHour;
    return Math.round(custCount * this.avePerSale);
  },
};

stores[3] = {
  location: 'Capitol Hill',
  minCustPerHour: 20,
  maxCustPerHour: 38,
  avePerSale: 2.3,
  simulatedDay: [],
  simulateDay: function() {
    for (var i = 6; i <= 20; i++) {
      this.simulatedDay.push({
        hour: i,
        count: this.simulateHour()
      });
    }
  },
  simulateHour: function() {
    var custCount = Math.floor(Math.random() * ((this.maxCustPerHour - this.minCustPerHour) + 1)) + this.minCustPerHour;
    return Math.round(custCount * this.avePerSale);
  },
};

stores[4] = {
  location: 'Alki',
  minCustPerHour: 2,
  maxCustPerHour: 16,
  avePerSale: 4.6,
  simulatedDay: [],
  simulateDay: function () {
    for (var i = 6; i <= 20; i++) {
      this.simulatedDay.push({
        hour: i,
        count: this.simulateHour()
      });
    }
  },
  simulateHour: function () {
    var custCount = Math.floor(Math.random() * ((this.maxCustPerHour - this.minCustPerHour) + 1)) + this.minCustPerHour;
    return Math.round(custCount * this.avePerSale);
  },
};

function simulateAll() {
  for (var i = 0; i < stores.length; i++) {
    stores[i].simulateDay();
  }
}

function hourStr(hour) {
  var result = ((hour +11) % 12) +1;
  if (hour >= 12) {
    result += 'pm';
  } else {
    result += 'am';
  }
  return result;
}

function renderStore(aStore) {
  console.log(aStore.location);
  var storeDiv = addElement(document.getElementById('output'), 'ul', aStore.location);

  for (var i = 0; i < aStore.simulatedDay.length; i++) {
    var hourObj = aStore.simulatedDay[i];
    addElement(storeDiv, 'li', `${hourStr(hourObj.hour)}: ${hourObj.count} cookies`);
    console.log(hourObj, `${hourStr(hourObj.hour)}: ${hourObj.count} cookies`);
  }
}

function renderAllStores() {
  for (var i = 0; i < stores.length; i++) {
    renderStore(stores[i]);
  }
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

simulateAll();
renderAllStores();



