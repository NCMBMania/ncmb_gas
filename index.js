// Compiled using ts2gas 3.6.1 (TypeScript 3.8.3)
var exports = exports || {};
var module = module || { exports: exports };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { Config } from './libs/config';
//import { NCMBObject, NCMBInstallation, NCMBPush } from './libs/object';
//import { NCMBQuery } from './libs/query';
//import { NCMBRequest } from './libs/request';
//import { NCMBAcl } from './libs/acl';
//import { NCMBUser } from './libs/user';
//import { NCMBScript } from './libs/script';
class NCMB {
    constructor(applicationKey, clientKey, config = new Config()) {
        this.applicationKey = applicationKey;
        this.clientKey = clientKey;
        this.version = config.version;
        this.fqdn = config.fqdn;
        this.port = config.port;
        this.protocol = config.protocol;
        this.signatureMethod = config.signatureMethod;
        this.signatureVersion = config.signatureVersion;
        this.sessionToken = '';
        this.User = NCMBUser;
        this.User.ncmb = this;
        this.Installation = NCMBInstallation;
        this.Installation.ncmb = this;
        this.Push = NCMBPush;
        this.Push.ncmb = this;
    }
    Object(name) {
        return new NCMBObject(this, name);
    }
    Request() {
        return new NCMBRequest(this);
    }
    Query(name) {
        return new NCMBQuery(this, name);
    }
    Acl() {
        return new NCMBAcl;
    }
    Script() {
        return new NCMBScript(this);
    }
}
exports.NCMB = NCMB;
var init = (applicationKey, clientKey, config = new Config()) => {
    return new NCMB(applicationKey, clientKey, config);
};
exports.init = init;
function _test() {
    const ncmb = new NCMB('53ee32f8cc60c24703fecd6e121cabb710c71c46f288b5864a64845c558d1fff', '3bafaebfa7a4fa9470ed7edf0a7e3811228f61e5ae930929cd49dce421311bbf');
    const className = 'Test';
    const obj = ncmb.Object('Test');
    const fields = { a: 'b', c: 'd' };
    obj.sets(fields);
    obj.save();
    console.log(obj.get('objectId'));
    obj.set('memo', new Date());
    obj.save();
    console.log(obj.get('updateDate'));
}
