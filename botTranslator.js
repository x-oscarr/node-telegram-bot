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
    get(key, locale = this.defLocale, vars = null) {
        // Locale
        if(typeof locale === 'object' && locale.from) {
            locale = locale.from.language_code;
        }
        else locale = this.defLocale;
        let textOutput = this.transData[locale][key] ? this.transData[locale][key] : this.transData[this.defLocale][key];
        if(!textOutput) {
            return key;
        }
        // Variables in translation text
        if(vars && typeof vars === 'object') {
            for(let key in vars) {
                textOutput = textOutput.replace(key, vars[key]);
            }
        }

        return textOutput;
    }
}

module.exports = BotTranslator;