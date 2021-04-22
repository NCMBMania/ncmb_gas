// Compiled using ts2gas 3.6.1 (TypeScript 3.8.3)
var exports = exports || {};
var module = module || { exports: exports };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { NCMB } from '../index';
class NCMBScript {
    constructor(ncmb) {
        this.ncmb = ncmb;
        this.headers = {};
        this.body = {};
        this.queries = {};
    }
    set(params) {
        for (let key in params) {
            this.headers[key] = params[key];
        }
        return this;
    }
    data(params) {
        for (let key in params) {
            this.body[key] = params[key];
        }
        return this;
    }
    query(params) {
        for (let key in params) {
            this.queries[key] = params[key];
        }
        return this;
    }
    exec(method, filename) {
        const req = this.ncmb.Request();
        const json = req.exec(method, `/2015-09-01/script/${filename}`, this.body, this.queries, {
            fqdn: `script.mbaas.api.nifcloud.com`
        });
        return json;
    }
}
exports.NCMBScript = NCMBScript;
function test_script() {
    const applicationKey = '70dfced7542e494861ec39ba7442115dfa9806312a444831ed9a7faac5087934';
    const clientKey = '4d0dea61349c1ae47106a06c80f11dfffe705e606709fa9563ac5cf80cf2edff';
    const ncmb = new NCMB(applicationKey, clientKey);
    const json = ncmb.Script()
        .data({
        name: 'Atsushi',
        to: 'atsushi@moongift.jp'
    })
        .exec('POST', 'sendmail.js');
    Logger.log(json);
}
