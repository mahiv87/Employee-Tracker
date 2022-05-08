const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const table = cTable.getTable([
    {
        col1: 'foo',
        col2: 'bar'
    }
]);

console.log(table);

console.table([
    {
        col1: 'bar',
        col2: 'foo'
    }
]);