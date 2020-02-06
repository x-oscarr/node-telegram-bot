const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

const uk = require('./translations/uk');
const ru = require('./translations/ru');
const en = require('./translations/en');

class BotTranslator {
    constructor() {
        this.defLocale = 'uk';
        this.transData = { uk, ru, en }
    }
    get(key, locale = this.defLocale) {
        return this.transData[locale][key]
    }
}

module.exports = BotTranslator;