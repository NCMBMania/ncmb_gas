// Compiled using ts2gas 3.6.1 (TypeScript 3.8.3)
var exports = exports || {};
var module = module || { exports: exports };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { NCMBUser } from './user';
class NCMBAcl {
    constructor() {
        this.fields = {
            '*': {
                read: true,
                write: true
            }
        };
    }
    setPublicReadAccess(bol) {
        if (!this.fields['*'])
            this.fields['*'] = {};
        this.fields['*'].read = bol;
        return this;
    }
    setPublicWriteAccess(bol) {
        if (!this.fields['*'])
            this.fields['*'] = {};
        this.fields['*'].write = bol;
        return this;
    }
    setUserReadAccess(user, bol) {
        const objectId = user.get('objectId');
        if (!this.fields[objectId])
            this.fields[objectId] = {};
        this.fields[objectId].read = bol;
        return this;
    }
    setUserWriteAccess(user, bol) {
        const objectId = user.get('objectId');
        if (!this.fields[objectId])
            this.fields[objectId] = {};
        this.fields[objectId].write = bol;
        return this;
    }
    setRoleReadAccess(roleName, bol) {
        const role = `role:${roleName}`;
        if (!this.fields[role])
            this.fields[role] = {};
        this.fields[role].read = bol;
        return this;
    }
    setRoleWriteAccess(roleName, bol) {
        const role = `role:${roleName}`;
        if (!this.fields[role])
            this.fields[role] = {};
        this.fields[role].write = bol;
        return this;
    }
    toJSON() {
        const params = {};
        const fields = this.fields;
        for (let key in fields) {
            if (fields[key].write || fields[key].read) {
                params[key] = {};
            }
            if (fields[key].write)
                params[key].write = true;
            if (fields[key].read)
                params[key].read = true;
        }
        return params;
    }
}
exports.NCMBAcl = NCMBAcl;
