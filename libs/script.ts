import { NCMB } from '../index';

class NCMBScript {
  ncmb: NCMB;
  headers: object;
  body: object;
  queries: object;
  
  constructor(ncmb: NCMB) {
    this.ncmb = ncmb;
    this.headers = {};
    this.body = {};
    this.queries = {};
  }
  
  set(params: object): Script {
    for (let key in params) {
      this.headers[key] = params[key];
    }
    return this;
  }
  
  data(params: object): Script {
    for (let key in params) {
      this.body[key] = params[key];
    }
    return this;
  }
  
  query(params: object): Script {
    for (let key in params) {
      this.queries[key] = params[key];
    }
    return this;
  }
  
  exec(method: string, filename: string): object {
    const req = this.ncmb.Request();
    const json: object = req.exec(method, `/2015-09-01/script/${filename}`, this.body, this.queries, {
      fqdn: `script.mbaas.api.nifcloud.com`
    });
    return json;
  }
}

export { NCMBScript };

function test_script() {
  const applicationKey = '70dfced7542e494861ec39ba7442115dfa9806312a444831ed9a7faac5087934';
  const clientKey = '4d0dea61349c1ae47106a06c80f11dfffe705e606709fa9563ac5cf80cf2edff';
  const ncmb = new NCMB(applicationKey, clientKey);
  const json = ncmb.Script()
    .data({
      name: 'Atsushi',
      to: 'atsushi@moongift.jp'
    })
    .exec('POST', 'sendmail.js');
  Logger.log(json);
}