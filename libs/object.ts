import { NCMB } from '../index';

class NCMBObject {
  ncmb: NCMB;
  className: string;
  fields: { [s: string]: string };
  
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
    } else {
      this.fields[key] = value;
    }
    return this;
  }
  
  get(key: string): ary{
    return this.fields[key];
  }
  
  save(): boolean {
    const req = this.ncmb.Request();
    const json: {} = req.post(this.getPath(), this.fields);
    this.sets(json);
    return true;
  }
  
  specialPath(): boolean{
    return ["roles", "users", "files", "installations", "push"].indexOf(this.className) > -1;
  }
  
  getPath(objectId: string = ''): string{
    let url = `/${this.ncmb.version}/`;
    if (this.specialPath()) {
      url = `${url}${this.className}`;
    } else {
      url = `${url}classes/${this.className}`;
    }
    return objectId !== '' ? `${url}/${objectId}` : url;
  }
}

export { NCMBObject };