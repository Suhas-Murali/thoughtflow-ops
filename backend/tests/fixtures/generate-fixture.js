const xlsx = require('xlsx');
const path = require('path');

const data = [
  { Execution_ID: 1, Test_ID: 'TEST_001', Test_Name: 'Sample Test One', Error_Log: 'java.lang.NullPointerException: test error', Owner: 'Test Owner' },
  { Execution_ID: 2, Test_ID: 'TEST_002', Test_Name: 'Sample Test Two', Error_Log: 'AssertionError: expected 200 got 500', Owner: 'Test Owner' },
];

const worksheet = xlsx.utils.json_to_sheet(data);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
xlsx.writeFile(workbook, path.join(__dirname, 'tiny-test-file.xlsx'));

console.log('Fixture created.');