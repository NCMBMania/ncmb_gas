// Compiled using ts2gas 3.6.1 (TypeScript 3.8.3)
var exports = exports || {};
var module = module || { exports: exports };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { NCMB } from '../index';
//import { NCMBQuery } from './query';
class NCMBObject {
    constructor(ncmb, className) {
        this.ncmb = ncmb;
        this.className = className;
        this.fields = {};
    }
    sets(obj) {
        for (let key in obj) {
            this.set(key, obj[key]);
        }
        return this;
    }
    set(key, value) {
        if (['createDate', 'updateDate'].indexOf(key) > -1) {
            this.fields[key] = new Date(value);
        }
        else {
            this.fields[key] = value;
        }
        return this;
    }
    get(key) {
        return this.fields[key];
    }
    save() {
        const req = this.ncmb.Request();
        const method = this.get('objectId') ? 'put' : 'post';
        const json = req[method](this.getPath(), this.saveFields());
        this.sets(json);
        return true;
    }
    saveFields() {
        const results = {};
        for (const k in this.fields) {
            if (['objectId', 'createDate', 'updateDate'].indexOf(k) > -1) {
                continue;
            }
            const value = this.fields[k];
            switch (Object.prototype.toString.call(value).slice(8, -1)) {
                case 'Date':
                    results[k] = {
                        __type: 'Date',
                        iso: value.toISOString()
                    };
                    break;
                default:
                    results[k] = typeof value.toJSON === 'function' ? value.toJSON() : value;
            }
        }
        console.log(results);
        return results;
    }
    destroy() {
        const req = this.ncmb.Request();
        return req.delete(this.getPath());
    }
    specialPath() {
        return ["roles", "users", "files", "installations", "push"].indexOf(this.className) > -1;
    }
    getPath() {
        let url = `/${this.ncmb.version}/`;
        if (this.specialPath()) {
            url = `${url}${this.className}`;
        }
        else {
            url = `${url}classes/${this.className}`;
        }
        const objectId = this.get('objectId');
        return objectId ? `${url}/${objectId}` : url;
    }
}
exports.NCMBObject = NCMBObject;
class NCMBInstallation extends NCMBObject {
    constructor() {
        super(NCMBInstallation.ncmb, 'installations');
    }
    static query() {
        return this.ncmb.Query('installations');
    }
}
exports.NCMBInstallation = NCMBInstallation;
class NCMBPush extends NCMBObject {
    constructor() {
        super(NCMBPush.ncmb, 'push');
    }
    static query() {
        return this.ncmb.Query('push');
    }
}
exports.NCMBPush = NCMBPush;
function _installation_test() {
    const applicationKey = '70dfced7542e494861ec39ba7442115dfa9806312a444831ed9a7faac5087934';
    const clientKey = '4d0dea61349c1ae47106a06c80f11dfffe705e606709fa9563ac5cf80cf2edff';
    const ncmb = new NCMB(applicationKey, clientKey);
    const query = ncmb.Installation.query();
    const installations = query.fetchAll();
    console.log(installations[0]);
    const installation = new ncmb.Installation;
    installation
        .set('deviceToken', 'aaa')
        .set('deviceType', 'ios')
        .set('applicationName', 'aaa')
        .save();
}
function _push_test() {
    const applicationKey = '70dfced7542e494861ec39ba7442115dfa9806312a444831ed9a7faac5087934';
    const clientKey = '4d0dea61349c1ae47106a06c80f11dfffe705e606709fa9563ac5cf80cf2edff';
    const ncmb = new NCMB(applicationKey, clientKey);
    const query = ncmb.Push.query();
    const pushes = query.fetchAll();
    console.log(pushes[0]);
    const push = new ncmb.Push();
    push
        .set("immediateDeliveryFlag", true)
        .set("message", "Hello, World!")
        .set("target", ["ios", "android"])
        .save();
}
function object_test() {
    const ncmb = new NCMB('53ee32f8cc60c24703fecd6e121cabb710c71c46f288b5864a64845c558d1fff', '3bafaebfa7a4fa9470ed7edf0a7e3811228f61e5ae930929cd49dce421311bbf');
    const className = 'Test';
    const acl = ncmb.Acl();
    acl
        .setPublicReadAccess(true)
        .setPublicWriteAccess(false)
        .setRoleWriteAccess('admin', true);
    const item = ncmb.Object(className);
    item
        .set('acl', acl)
        .set('msg', 'Hello')
        .set('number', 5).save();
}
