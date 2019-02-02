'use strict';

module.exports.registerSW = registerSW;
module.exports.unregisterSW = unregisterSW;

module.exports.listenSW = (sw, ...args) => {
    sw && sw.addEventListener(...args);
};

async function registerSW(prefix) {
    if (!navigator.serviceWorker)
        return;
    
    const isHTTPS = location.protocol === 'https:';
    const isLocalhost = location.hostname === 'localhost';
    
    if (!isHTTPS && !isLocalhost)
        return;
    
    return navigator.serviceWorker.register(`${prefix}/sw.js`);
}
async function unregisterSW(prefix) {
    const reg = await registerSW(prefix);
    reg && reg.unregister(prefix);
}

