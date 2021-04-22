// Compiled using ts2gas 3.6.1 (TypeScript 3.8.3)
var exports = exports || {};
var module = module || { exports: exports };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { NCMB } from '../index';
//import { NCMBObject, NCMBInstallation } from './object';
class NCMBQuery {
    constructor(ncmb, name) {
        this.ncmb = ncmb;
        this.className = name;
        this.where = {};
        this.limit = 100;
        this.order = 'createDate';
        this.include = '';
        this.skip = 0;
    }
    equalTo(key, value) {
        return this.setOperand(key, value);
    }
    notEqualTo(key, value) {
        return this.setOperand(key, value, '$ne');
    }
    lessThan(key, value) {
        return this.setOperand(key, value, '$lt');
    }
    lessThanOrEqualTo(key, value) {
        return this.setOperand(key, value, '$lte');
    }
    greaterThan(key, value) {
        return this.setOperand(key, value, '$gt');
    }
    greaterThanOrEqualTo(key, value) {
        return this.setOperand(key, value, '$gte');
    }
    in(key, value) {
        return this.setOperand(key, value, '$in');
    }
    exclude(key, value) {
        return this.setOperand(key, value, '$nin');
    }
    exists(key, value) {
        return this.setOperand(key, value, '$exists');
    }
    regularExpressionTo(key, value) {
        return this.setOperand(key, value, '$regex');
    }
    inArray(key, value) {
        return this.setOperand(key, value, '$inArray');
    }
    ninArray(key, value) {
        return this.setOperand(key, value, '$ninArray');
    }
    allInArray(key, value) {
        return this.setOperand(key, value, '$all');
    }
    near(key, value) {
        return this.setOperand(key, value, '$nearSphere');
    }
    withinKilometers(key, value, distance) {
        this.setOperand(key, value, '$nearSphere');
        this.where[key]['$maxDistanceInKilometers'] = distance;
        return this;
    }
    withinMiles(key, value, distance) {
        this.setOperand(key, value, '$nearSphere');
        this.where[key]['$maxDistanceInMiles'] = distance;
        return this;
    }
    withinRadians(key, value, distance) {
        this.setOperand(key, value, '$nearSphere');
        this.where[key]['$maxDistanceInRadians'] = distance;
        return this;
    }
    withinSquare(key, southWest, northEast) {
        return this.setOperand(key, { '$box': [southWest, northEast] }, '$within');
    }
    setOperand(key, value, ope = '') {
        if (ope === '') {
            this.where[key] = this.changeValue(value);
        }
        else {
            if (!this.where[key])
                this.where[key] = {};
            this.where[key][ope] = this.changeValue(value);
        }
        return this;
    }
    changeValue(value) {
        if (value instanceof Date)
            return { __type: "Date", iso: value.toISOString() };
        return value;
    }
    fetch() {
        this.limit = 1;
        return this.fetchAll()[0];
    }
    fetchAll() {
        const req = this.ncmb.Request();
        const query = {
            where: this.where,
            limit: this.limit,
            order: this.order,
            include: this.include,
            skip: this.skip
        };
        const json = req.get(this.getPath(), query);
        return json.results.map(params => {
            let obj;
            switch (this.className) {
                case 'installations':
                    obj = new this.ncmb.Installation();
                    break;
                case 'push':
                    obj = new this.ncmb.Push();
                    break;
                default:
                    obj = this.ncmb.Object(this.className);
                    break;
            }
            obj.sets(params);
            return obj;
        });
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
        return url;
    }
}
exports.NCMBQuery = NCMBQuery;
function query_test() {
    const applicationKey = '70dfced7542e494861ec39ba7442115dfa9806312a444831ed9a7faac5087934';
    const clientKey = '4d0dea61349c1ae47106a06c80f11dfffe705e606709fa9563ac5cf80cf2edff';
    const ncmb = new NCMB(applicationKey, clientKey);
    let query = ncmb.Query('Test');
    const className = 'Test';
    const item = ncmb.Object(className);
    item.set('msg', 'Hello').set('number', 5).save();
    query = ncmb.Query(className);
    const ary = query.greaterThan('number', 4).equalTo('msg', 'Hello').fetchAll();
    console.log(ary.length);
}
