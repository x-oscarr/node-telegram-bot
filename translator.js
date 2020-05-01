const fs = require('fs');
const path = require('path');

class Translator {
    constructor() {
        this.defLocale = process.env.DEFAULT_LOCALE;
        this.transData = {};
        for (let item of process.env.LOCALES.split(',')) {
            this.transData[item.trim()] = require(`./translations/${item.trim()}`);
        }
    }
    get(key, locale = this.defLocale, vars = null) {
        // Locale
        if(typeof locale === 'object' && locale.from) {
            locale = locale.from.language_code;
        }
        locale = locale ? locale : this.defLocale;
        // Key
        let textOutput;
        if(this.transData[locale][key]) {
            textOutput = this.transData[locale][key];
        }
        else if(this.transData[this.defLocale][key]){
            textOutput = this.transData[this.defLocale][key];
        }
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

module.exports = Translator;
