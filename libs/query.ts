import { NCMB } from '../index';
import { NCMBObject, NCMBInstallation } from './object';
import { NCMBGeoPoint } from './geopoint';

class NCMBQuery {
  className: string;
  ncmb: NCMB;
  _where: {[s: string]: any};
  _limit: number;
  _order: string;
  _include: string;
  _skip: number;
  
  constructor(ncmb: NCMB, name: string) {
    this.ncmb = ncmb;
    this.className = name;
    this._where = {};
    this._limit = 100;
    this._order = null;
    this._include = '';
    this._skip = 0;
  }

  limit(num: number): NCMBQuery {
    this._limit = num;
    return this;
  }

  include(str: string): NCMBQuery {
    this._include = str;
    return this;
  }
       
  equalTo(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value);
  }

  notEqualTo(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value, '$ne');
  }
  
  lessThan(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value, '$lt');
  }
  
  lessThanOrEqualTo(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value, '$lte');
  }

  greaterThan(key: string, value: number): NCMBQuery {
    return this.setOperand(key, value, '$gt');
  }

  greaterThanOrEqualTo(key: string, value: number): NCMBQuery {
    return this.setOperand(key, value, '$gte');
  }
  
  in(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value, '$in');
  }
  
  exclude(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value, '$nin');
  }
  
  exists(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value, '$exists');
  }
  
  regularExpressionTo(key: string, value: string): NCMBQuery {
    return this.setOperand(key, value, '$regex');
  }
  
  inArray(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value, '$inArray');
  }
  
  ninArray(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value, '$ninArray');
  }
  
  allInArray(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value, '$all');
  }
  
  near(key: string, value: any): NCMBQuery {
    return this.setOperand(key, value, '$nearSphere');
  }
  
  withinKilometers(key: string, value: any, distance: number): NCMBQuery {
    this.setOperand(key, value, '$nearSphere');
    this._where[key]['$maxDistanceInKilometers'] = distance;
    return this;
  }
  
  withinMiles(key: string, value: any, distance: number): NCMBQuery {
    this.setOperand(key, value, '$nearSphere');
    this._where[key]['$maxDistanceInMiles'] = distance;
    return this;
  }
  
  withinRadians(key: string, value: NCMBGeoPoint, distance: number): NCMBQuery {
    this.setOperand(key, value, '$nearSphere');
    this._where[key]['$maxDistanceInRadians'] = distance;
    return this;
  }
  
  withinSquare(key: string, southWest: NCMBGeoPoint, northEast: NCMBGeoPoint): NCMBQuery {
    return this.setOperand(key, {'$box': [southWest, northEast]}, '$within');
  }

  setOperand(key: string, value: any, ope:string = ''): NCMBQuery {
    if (ope === '') {
      this._where[key] = this.changeValue(value);
    } else {
      if (!this._where[key]) this._where[key] = {};
      this._where[key][ope] = this.changeValue(value);
    }
    return this;
  }
  
  changeValue(value: any): any {
    if(value instanceof Date)
      return {__type: "Date", iso: value.toISOString()};
    if (value instanceof NCMBGeoPoint)
      return value.toJSON();
    return value;
  }
  
  fetch(): NCMBObject {
    this._limit = 1;
    return this.fetchAll()[0];
  }
  
  fetchAll(): NCMBObject[] | NCMBInstallation[] {
    const req = this.ncmb.Request();
    const query = {
      where: this._where,
      limit: this._limit,
      order: this._order,
      include: this._include,
      skip: this._skip
    };
    interface Results {
      results: object[];
    }
    const json: Results = req.get(this.getPath(), query) as Results;
    return json.results.map(params => {
      let obj:any;
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

  specialPath(): boolean{
    return ["roles", "users", "files", "installations", "push"].indexOf(this.className) > -1;
  }
  
  getPath(): string{
    let url = `/${this.ncmb.version}/`;
    if (this.specialPath()) {
      url = `${url}${this.className}`;
    } else {
      url = `${url}classes/${this.className}`;
    }
    return url;
  }
}

export { NCMBQuery };

function _query_test() {
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

function _query_geo_test() {
  const applicationKey = '70dfced7542e494861ec39ba7442115dfa9806312a444831ed9a7faac5087934';
  const clientKey = '4d0dea61349c1ae47106a06c80f11dfffe705e606709fa9563ac5cf80cf2edff';
  const ncmb = new NCMB(applicationKey, clientKey);
  const query = ncmb.Query('Test');
  const ary = query
    .withinKilometers('geo', ncmb.GeoPoint(35.6585805, 139.7454329), 5)
    .fetchAll();
  console.log(ary);
}
