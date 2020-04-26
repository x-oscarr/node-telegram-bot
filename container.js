const STRATEGY_SINGLETON = 'singleton';
const STRATEGY_PROTOTYPE = 'prototype';

class Container {
    constructor() {
        this.configured = {};
        this.registered = {};
    }

    get(id) {
        if(this.configured[id]) {
            return this.configured[id]
        }
        else if(!this.registered[id]) {
            throw new Error(`Service ${id} is not registered`);
        }
        const {callback, strategy} = this.registered[id];
        const result = callback(this);

        if(strategy === STRATEGY_SINGLETON) {
            this.configured[id] = result;
        }
        return result;
    }

    register(id, callback, strategy = STRATEGY_SINGLETON) {
        if(this.registered[id]) {
            throw new Error(`Service ${id} is exist`);
        }
        else if(typeof callback !== 'function') {
            throw new Error('Callback is not a function')
        }
        this.registered[id] = {
            callback,
            strategy
        };
    }

    getOnRegexp(regex) {
        let services = [];
        for (let key in this.registered) {
            if (regex.test(key)) {
                const service = this.get(key);
                services.push(service);
            }
        }
        return services;
    }
}

module.exports = {
    STRATEGY_SINGLETON,
    STRATEGY_PROTOTYPE,
    Container: Container
};