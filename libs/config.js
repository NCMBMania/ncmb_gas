// Compiled using ts2gas 3.6.1 (TypeScript 3.8.3)
var exports = exports || {};
var module = module || { exports: exports };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    constructor() {
        this.version = '2013-09-01';
        this.fqdn = 'mbaas.api.nifcloud.com';
        this.port = 443;
        this.protocol = 'https:';
        this.signatureMethod = 'HmacSHA256';
        this.signatureVersion = 2;
    }
}
exports.Config = Config;
