# cookie-stand (CF 201 Week 2 Project)

## Code Plan

### CookieShop Object

- Constructor function for a generic CookieShop
  - Function arguments
    - `minCustPerHour` - The minimum number of customers per hour
    - `maxCustPerHour` - The maximum number of customers per hour
    - `avePerCust` - The average number of cookies purchased per customer
  - Properties
    - `minCustPerHour` - The minimum number of customers per hour
    - `maxCustPerHour` - The maximum number of customers per hour
    - `avePerCust` - The average number of cookies purchased per customer
- Refactor the following as prototype methods of the CookieShop object
  - `simulateHour()` - Random min thru max based on properties
  - `simulateDay()` - Loop thru hours and calculate number of cookies per hour, and create hour objects and push them into the simultedDay array property for each hour.  (See Hour object below.)
  - `calculateTotal()` - Iterate through cookieCountsForHours array and return the total for the location

### Hour Object

- Constructor function for CSHour objects
  - Function arguments
    - `hour` - Number - The 0-24 number of the hour
    - `customerCount` - Number - The number of customers served in the hour
    - `cookieCount` - Number - The number of cookies served in the hour

### Create Summary Objects (to keep the `renderReportTable()` function DRY with respect to the stretch goals)

- Create summary objects to control how rows and/or columns are summarized
- The `renderReportTable()` function expects the summary object to have the following methods
  - A constructor function - This is passed to the `renderReportTable()` function and is used to create a new instance for each row or column.
  - `IncludeValue(value)` - Called while rendering the table by the `renderReportRow()` or `renderReportFooter()` functions
  - `summary()` - The implementation of the summary function to be used by the report row and/or column.

### Report Object

- Implement a report object with the following constructor and prototype methods
  - A constructor that takes the following paremeters
    - `cellValueFunction` - A reference to a function that returns a value for a report cell given the following parameters
      - locationIndex
      - hourIndex
    - `rowSummaryConstructor` - A reference to the constructor function for a row summary object described in the above section
    - `colSummaryConstructor` - A reference to the constructor function for a column summary object described in the above section
  - `renderReportTable()` method which does the following
    - Find the HTML element to accept the table
    - Create the `<table>` element
    - `renderReportHeader()` method with the following steps to create the table header
      - Create the `<thead>` element
      - Create the `<tr>` element
      - Create the `<th>` header cell elements and insert them into the header `<tr>`
      - Insert (appendChild) the header `<tr>` into the `<thead>`
    - Insert the `<thead>` element into the previously created `<table>` element
    - `renderReportBody()` method with the following steps to create the table body
      - Create the `<tbody>` element
      - For each location do the following
        - Call the method `renderReportRow()` which does the following
          - Create the `<tr>` element to accept the row of results for the location
          - Create and insert into the `<tr>` element, a `<td>` for the location name
          - Loop thru hours calling the given `cellValueFunction(locationIndex, hourIndex)` and `rowSummary.includeValue()` functions and create the `<td>` elements for each hour for the location of the row and append them to the `<tr>`
          - Create the `<td>` with the location summary calculated with the given `rowSummary.summary()` function and append to the `<tr>`
        - Insert the completed `<tr>` for the location into the `<tbody>` element
    - Insert the `<tbody>` element into the previously created `<table>` element
    - `renderReportFooter()` method implementing the following steps to create the table footer
      - Create the `<tfoot>` element
      - Create the `<tr>` element
      - Loop thru hours and for each do the following
        - Within a nested loop, iterate thru all locations for the hour and call the given `cellValueFunction(locationIndex, hourIndex)` and `rowSummary.includeValue()` functions to accumulate totals.
        - Create the `<td>` elements for each hour with values from `colSummary.summary()` and append them to the `<tr>`
      - Append the `<tr>` to the `<tfoot>` element
    - Append the `<tfoot>` element to the `<table>` element
    - Clear any previous contents of the HTML element, identified above, to accept the table
    - Finally append the `<table>` element to the containing HTML element.

## The Below is interesting, but don't do it this way

### KeyValueSummary Object (to make the stretch goals DRY)

- Implement a `KeyValueSummary` object with methods for accumulating and reporting summaries (min, max, mean, count, and sum) by key where key can represent a predefined grouping such as hour of the day, day of the week, or location.
  - Methods of the `KeyValueSummary` object
    - constructor function calls the `reset()` function
    - `reset()` - resets by clearing the key/value arrays
    - `addValueToKey(key, value)`
    - `min(key)` -
    - `max(key)` -
    - `mean(key)` -
    - `count(key)` -
    - `sum(key)` -
  - Properties of the `KeyValueSummary` object
    - `minByKey` array
    - `maxByKey` array
    - `countByKey` array
    - `sumByKey` array

