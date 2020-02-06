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


module.exports = {
    readDir,
    readFile
};