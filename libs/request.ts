import { NCMB } from '../index';

class NCMBRequest {
  ncmb: NCMB;
  constructor(ncmb: NCMB) {
    this.ncmb = ncmb;
  }
  exec(method: string, path: string, fields: {[s: string]: any} = {}, query: {[s: string]: string} = {}, options: object = {}) {
    const timestamp = new Date().toISOString();
    let url = `${this.ncmb.protocol}//${options.fqdn || this.ncmb.fqdn}${path}`;
    const sig = this.createSignature(url, path, method, query, timestamp, options);
    if (Object.keys(query).length > 0) {
      const queries = Object.keys(query).sort().map(key => {
        let q = query[key];
        if (q !== '') {
          if (typeof q === "object") q = JSON.stringify(q);
          return `${key}=${encodeURIComponent(q)}`;
        }
      })
      url = `${url}?${queries.join('&')}`;
    }
    const headers: {[s: string]: string} = {
      'X-NCMB-Application-Key': this.ncmb.applicationKey,
      'X-NCMB-Signature': sig,
      'X-NCMB-Timestamp': timestamp,
      'X-NCMB-Apps-Session-Token': this.ncmb.sessionToken
    };
    if (this.ncmb.sessionToken === '') {
      delete headers['X-NCMB-Apps-Session-Token'];
    }
    const params: {[s: string]: any} = {
      headers: headers,
      method: method,
      contentType: "application/json"
    }
    if (['GET', 'DELETE'].indexOf(method) === -1) {
      params.payload = JSON.stringify(fields);
    }
    const response = UrlFetchApp.fetch(url, params);
    const contents = response.getContentText('UTF-8');
    if (method === 'DELETE' && contents == '') {
      return {};
    }
    return JSON.parse(contents);
  }
  
  get(path: string, query: object): object {
    return this.exec('GET', path, {}, query);
  }
  put(path: string, fields: object): object {
    return this.exec('PUT', path, fields);
  }
  
  delete(path: string): boolean {
    const json: {} = this.exec('DELETE', path);
    return Object.keys(json).length === 0;
  }
  
  post(path: string, fields: object): object{
    return this.exec('POST', path, fields);
    /*
    if (fields && fields.acl && fields.acl.json) {
      fields.acl = fields.acl.json();      
    }
    */
  }
  
  createSignature(url: string, path: string, method: string, queries: { [s: string]: any }, timestamp: string, options: object = {}) {
    const data: { [s: string]: any } = {
      'SignatureMethod': this.ncmb.signatureMethod,
      'SignatureVersion': this.ncmb.signatureVersion,
      'X-NCMB-Application-Key': this.ncmb.applicationKey,
      'X-NCMB-Timestamp': timestamp
    };
    
    if (Object.keys(queries).length > 0) {
      for (let key in queries) {
        let value: any = queries[key];
        if (value === '') continue;
        if(typeof value === "object") value = JSON.stringify(value);
        data[key] = encodeURIComponent(value);
      };
    }
    
    const sigStr = [
      method,
      options.fqdn || this.ncmb.fqdn,
      path,
      Object.keys(data).sort().map(key => [key, data[key]].join("=")).join('&')
    ].join("\n");
    return Utilities.base64Encode(Utilities.computeHmacSha256Signature(sigStr, this.ncmb.clientKey));
  }  
}

export { NCMBRequest };

function test() {
    const ncmb = new NCMB('53ee32f8cc60c24703fecd6e121cabb710c71c46f288b5864a64845c558d1fff', '3bafaebfa7a4fa9470ed7edf0a7e3811228f61e5ae930929cd49dce421311bbf');
    const className = 'Test';
    const obj = ncmb.Object('Test');
    const fields = {a: 'b', c: 'd'};
    obj.sets(fields);
    obj.save();
    Logger.log(obj.get('objectId'));
    obj.set('memo', new Date()).set('ary', ['a', 'b', 'c']).save();
    Logger.log(obj.get('updateDate'));
    // obj.destroy();
}