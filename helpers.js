const fs = require('fs');

function readDir(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, items) => {
            if (err) {
                return reject(err);
            }
            return resolve(items);
        });
    });
}

function readFile(file, options) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, options, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

function toSnakeCase(data) {
    if(typeof data === "string") {
        return stringToSnakeCase(data);
    }

    if(typeof data === "object") {
        let newObject = {};
        for (let item in data) {
            let newItem = stringToSnakeCase(item);
            newObject[newItem] = data[item];
        }
        return newObject;
    }

    function stringToSnakeCase(string) {
        return string.replace(/([A-Z])/g, ($1) => {
            if(string.indexOf($1) === 0) return $1.toLowerCase();
            return `_${$1}`.toLowerCase()
        });
    }

    return data;
}

module.exports = {
    readDir,
    readFile,
    toSnakeCase
};