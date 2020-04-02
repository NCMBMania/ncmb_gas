import { NCMBUser } from './user';

class NCMBAcl {
  fields: { [s: string]: string };
  constructor() {
    this.fields = {
      '*': {
        read: true,
        write: true
      }
    };
  }
  
  setPublicReadAccess(bol: boolean): NCMBAcl {
    if (!this.fields['*']) this.fields['*'] = {};
    this.fields['*'].read = bol;
    return this;
  }
  
  setPublicWriteAccess(bol: boolean): NCMBAcl {
    if (!this.fields['*']) this.fields['*'] = {};
    this.fields['*'].write = bol;
    return this;
  }
  
  setUserReadAccess(user: NCMBUser, bol: boolean): NCMBAcl {
    const objectId = user.get('objectId');
    if (!this.fields[objectId]) this.fields[objectId] = {};
    this.fields[objectId].read = bol;
    return this;
  }
  
  setUserWriteAccess(user: NCMBUser, bol: boolean): NCMBAcl {
    const objectId = user.get('objectId');
    if (!this.fields[objectId]) this.fields[objectId] = {};
    this.fields[objectId].write = bol;
    return this;
  }
  
  setRoleReadAccess(roleName: string, bol: boolean): NCMBAcl {
    const role = `role:${roleName}`;
    if (!this.fields[role]) this.fields[role] = {};
    this.fields[role].read = bol;
    return this;
  }
  
  setRoleWriteAccess(roleName: string, bol: boolean): NCMBAcl {
    const role = `role:${roleName}`;
    if (!this.fields[role]) this.fields[role] = {};
    this.fields[role].write = bol;
    return this;
  }
  
  toJSON(): object {
    const params = {};
    const fields = this.fields;
    for (let key in fields) {
      if (fields[key].write || fields[key].read) {
        params[key] = {}
      }
      if (fields[key].write) params[key].write = true;
      if (fields[key].read) params[key].read = true;
    }
    return params;
  }
}

export { NCMBAcl };