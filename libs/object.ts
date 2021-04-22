import { NCMB } from '../index';
import { NCMBQuery } from './query';

class NCMBObject {
  ncmb: NCMB;
  className: string;
  fields: { [s: string]: any };
  
  constructor(ncmb: NCMB, className: string) {
    this.ncmb = ncmb;
    this.className = className;
    this.fields = {};
  }
  
  sets(obj: {[s: string]: string}): NCMBObject{
    for (let key in obj) {
      this.set(key, obj[key]);
    }
    return this;
  }
  
  set(key: string, value: any): NCMBObject{
    if (['createDate', 'updateDate'].indexOf(key) > -1) {
      this.fields[key] = new Date(value);
    } else if (value && value.__type === 'Date' && value.iso) {
      this.fields[key] = new Date(value.iso);
    } else if (value && value.__type === 'Object' && value.className) {
      const o = this.ncmb.Object(value.className);
      o.sets(value);
      this.fields[key] = o;
    } else {
      this.fields[key] = value;
    }
    return this;
  }
  
  get(key: string): any {
    return this.fields[key];
  }

  setIncrement(key: string, amount: number | null = 1): NCMBObject {
    if (!this.fields.objectId) {
      if(typeof this.fields[key] === "number"){
          this.fields[key] += amount;
          return this;
      }
      this.fields[key] = amount;
      return this;
    }
    if(this.fields[key] && this.fields[key].__op === 'Increment'){
      this.fields[key].amount += amount;
      return this;
    }
    this.fields[key] = {
      __op: 'Increment',
      amount: amount
    };
    
    return this;
  }

  add(key: string, objects: any): NCMBObject {
    if(!objects){
      throw new Error('objects are required');
    }
    const ary = Array.isArray(objects) ? objects : [objects];
    if (this.fields.objectId) {
      if (this.fields[key] && this.fields[key].__op === 'Add'){
        if (!this.fields[key].objects) {
          this.fields[key].objects = [];
        }
        for (let obj of ary) {
          this.fields[key].objects.push(obj);
        }
        return this;
      }
      this.fields[key] = {
        __op: 'Add',
        objects: ary
      };
      return this;
    }
    if (this.fields[key] && !this.fields[key].__op) {
      for(let obj in ary) {
        this.fields[key].push(obj);
      }
      return this;
    }
    this.fields[key] = ary;
    return this;
  }

  addUnique(key: string, objects: any): NCMBObject {
    if(!objects){
      throw new Error("Objects are required.");
    }
    const ary = Array.isArray(objects) ? objects : [objects];
    if (!this.fields[key] || this.fields[key].__op !== 'AddUnique') {
      this.fields[key] = {
        __op: 'AddUnique',
        objects:[]
      };
    }
    const sets = new Set(this.fields[key].objects);
    for(let obj of ary){
      if (sets.has(obj)) {
        throw new Error(`Input objects are duplicated. ${JSON.stringify(obj)}`);
      }
      this.fields[key].objects.push(obj);
      sets.add(obj);
    }
    return this;    
  }

  remove(key: string, objects: any): NCMBObject {
    if(!objects){
      throw new Error('Objects are required.');
    }
    const ary = Array.isArray(objects) ? objects : [objects];
    if(this.fields[key] && this.fields[key].__op === 'Remove'){
      for(let obj of ary){
        this.fields[key].objects.push(obj);
      }
      return this;
    }
    this.fields[key] = {
      __op: 'Remove',
      objects: ary
    };
    return this;
  }

  save(): boolean {
    const req = this.ncmb.Request();
    const method = this.get('objectId') ? 'put' : 'post';
    const json: {} = req[method](this.getPath(), this.saveFields());
    this.sets(json);
    return true;
  }

  fetch(): boolean {
    const req = this.ncmb.Request();
    if(!this.get('objectId')){
      throw new Error('Object id is required.');
    }
    const json: {} = req.get(this.getPath());
    this.sets(json);
    return true;
  }
  
  saveFields(): {[s: string]: any} {
    const results: {[s: string]: any} = {};
    for (const k in this.fields) {
      if (['objectId', 'createDate', 'updateDate'].indexOf(k) > -1) {
        continue;
      }
      const value = this.fields[k];
      switch (Object.prototype.toString.call(value).slice(8, -1)) {
      case 'Date':
        results[k] = {
          __type: 'Date',
          iso: (value as Date).toISOString()
        }
        break;
      default:
        if (value) {
          results[k] = typeof value.toJSON === 'function' ? value.toJSON() : value;
        } else {
          results[k] = value;
        }
      }
    }
    return results;
  }
  
  toJSON(): object {
    return {
      __type: 'Pointer',
      className: this.className,
      objectId: this.get('objectId')
    }
  }

  destroy(): boolean {
    const req = this.ncmb.Request();
    return req.delete(this.getPath());
  }
  
  specialPath(): boolean{
    return ["roles", "users", "files", "installations", "push"].indexOf(this.className) > -1;
  }
  
  getPath(): string {
    let url = `/${this.ncmb.version}/`;
    if (this.specialPath()) {
      url = `${url}${this.className}`;
    } else {
      url = `${url}classes/${this.className}`;
    }
    const objectId = this.get('objectId');
    return objectId ? `${url}/${objectId}` : url;
  }
}

class NCMBInstallation extends NCMBObject {
  static ncmb: NCMB;
  constructor() {
    super(NCMBInstallation.ncmb, 'installations');
  }

  static query(): NCMBQuery {
    return this.ncmb.Query('installations');
  }
}

class NCMBPush extends NCMBObject {
  static ncmb: NCMB;
  constructor() {
    super(NCMBPush.ncmb, 'push');
  }

  static query(): NCMBQuery {
    return this.ncmb.Query('push');
  }
}

class NCMBFile extends NCMBObject {
  static ncmb: NCMB;
  constructor(ncmb) {
    super(NCMBFile.ncmb, 'files');
  }

  static upload(fileName: string, fileData: object | string, acl: NCMBAcl = null, mimeType: string = 'application/octet-stream') {
    if (typeof fileData !== 'object') {
      fileData = Utilities.newBlob(fileData, mimeType, fileName);
    } else {
      fileData = fileData.getBlob();
    }
    const req = this.ncmb.Request();
    const json: {} = req.exec('POST', this.filePath(fileName), {}, {}, {
      file: { fileName, fileData, acl }
    })
    const file = new this.ncmb.File;
    file.sets(json);
    return file;
  }

  static download(fileName: string) {
    const req = this.ncmb.Request();
    const data = req.exec('GET', this.filePath(fileName));
    const file = new this.ncmb.File;
    file.blob = data;
    file.blob.setName(fileName);
    return file;
  }

  static filePath(fileName: string) {
    let url = `/${this.ncmb.version}/`;
    return url = `${url}files/${fileName}`;
  }
}

function _test_download() {
  const ncmb = new NCMB('53ee32f8cc60c24703fecd6e121cabb710c71c46f288b5864a64845c558d1fff', '3bafaebfa7a4fa9470ed7edf0a7e3811228f61e5ae930929cd49dce421311bbf');
  try {
    const fileName = 'test.png';
    const file = ncmb.File.download(fileName);
    const folderId = '10GnZrOQHXf90-N13R6TkV6LVGiKLeEpX';
    const folder = DriveApp.getFolderById(folderId);
    folder.createFile(file.blob);
  } catch (e) {
    console.log(e)
  }
}

function _test_upload() {
  const ncmb = new NCMB('53ee32f8cc60c24703fecd6e121cabb710c71c46f288b5864a64845c558d1fff', '3bafaebfa7a4fa9470ed7edf0a7e3811228f61e5ae930929cd49dce421311bbf');
  ncmb.File.upload('test.csv', 'test1,test2', null, 'text/csv')
}

function _test_upload_binary() {
  const ncmb = new NCMB('53ee32f8cc60c24703fecd6e121cabb710c71c46f288b5864a64845c558d1fff', '3bafaebfa7a4fa9470ed7edf0a7e3811228f61e5ae930929cd49dce421311bbf');
  const png  = DriveApp.getFileById('14cpWq1--kc16UlG2U9hqcCzVzo1Hew94');
  const file = ncmb.File.upload('test.png', png);
  console.log(file);
}

export { NCMBObject, NCMBInstallation, NCMBPush, NCMBFile };

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

function _object_test() {
  const ncmb = new NCMB('53ee32f8cc60c24703fecd6e121cabb710c71c46f288b5864a64845c558d1fff', '3bafaebfa7a4fa9470ed7edf0a7e3811228f61e5ae930929cd49dce421311bbf');
  const className = 'Test';
  const acl = ncmb.Acl();
  acl
    .setPublicReadAccess(true)
    .setPublicWriteAccess(true)
    .setRoleWriteAccess('admin', true);
  const item = ncmb.Object(className);
  item
    .set('acl', acl)
    .set('msg', 'Hello')
    .set('geo', ncmb.GeoPoint(30, 40))
    .set('array', [1, 2, 3])
    .set('number', 5).save();
  const item2 = ncmb.Object(className);
  item2.set('parent', true).set('child', item).save();
  item.setIncrement('number', 2).add('array', [4, 2]).save();
  item.addUnique('array', 2).save();
  item.remove('array', 2).save();

  const item3 = ncmb.Object(className);
  item3.set('objectId', item.get('objectId')).fetch();
  item3.add('array', 3).save();
}