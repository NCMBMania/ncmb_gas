import { NCMB } from '../index';

class NCMBRequest {
  ncmb: NCMB;
  constructor(ncmb: NCMB) {
    this.ncmb = ncmb;
  }
  post(path: string, fields: object): object{
    const timestamp = new Date().toISOString();
    const method = 'POST';
    let url = `${this.ncmb.protocol}//${this.ncmb.fqdn}${path}`;
    const query: {[s: string]: string} = {};
    const sig = this.createSignature(url, path, method, query, timestamp);
    if (query) {
      const queries = [];
      for (let key in query) {
        let q = query[key];
        if (typeof q === "object") q = JSON.stringify(q);
        queries.push(`${key}=${encodeURIComponent(q)}`);
      };
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
    /*
    if (fields && fields.acl && fields.acl.json) {
      fields.acl = fields.acl.json();      
    }
    */
    params.payload = JSON.stringify(fields);
    const response = UrlFetchApp.fetch(url, params);
    /*
    if (method === 'DELETE' && contents == '') {
      return {};
    }
    */
    return JSON.parse(response.getContentText('UTF-8'));
  }
  
  createSignature(url: string, path: string, method: string, queries: { [s: string]: any }, timestamp: string) {
    const data: { [s: string]: any } = {
      'SignatureMethod': this.ncmb.signatureMethod,
      'SignatureVersion': this.ncmb.signatureVersion,
      'X-NCMB-Application-Key': this.ncmb.applicationKey,
      'X-NCMB-Timestamp': timestamp
    };
    
    if (queries) {
      for (let key in queries) {
        let value: any = queries[key];
        if(typeof value === "object") value = JSON.stringify(value);
        data[key] = encodeURIComponent(value);
      };
    }
    
    const sigStr = [
      method,
      this.ncmb.fqdn,
      path,
      Object.keys(data).sort().map(key => [key, data[key]].join("=")).join('&')
    ].join("\n");
    return Utilities.base64Encode(Utilities.computeHmacSha256Signature(sigStr, this.ncmb.clientKey));
  }  
}

export { NCMBRequest };