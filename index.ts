import { Config } from './libs/config';
import { NCMBObject } from './libs/object';
import { NCMBQuery } from './libs/query';
import { NCMBRequest } from './libs/request';

class NCMB {
  applicationKey: string;
  clientKey: string;
  version: string;
  fqdn: string;
  port: number;
  protocol: string;
  signatureMethod: string;
  signatureVersion: number;
  sessionToken: string;
  
  constructor(applicationKey: string, clientKey: string, config: Config = new Config()) {
    this.applicationKey = applicationKey;
    this.clientKey = clientKey;
    this.version = config.version;
    this.fqdn = config.fqdn;
    this.port = config.port;
    this.protocol = config.protocol;
    this.signatureMethod = config.signatureMethod;
    this.signatureVersion = config.signatureVersion;
    this.sessionToken = '';
  }
  
  Object(name: string) {
    return new NCMBObject(this, name);
  }
  
  Request() {
    return new NCMBRequest(this);
  }
}

export { NCMB };

function test() {
    const ncmb = new NCMB('53ee32f8cc60c24703fecd6e121cabb710c71c46f288b5864a64845c558d1fff', '3bafaebfa7a4fa9470ed7edf0a7e3811228f61e5ae930929cd49dce421311bbf');
    const className = 'Test';
    const obj = ncmb.Object('Test');
    const fields = {a: 'b', c: 'd'};
    obj.sets(fields);
    obj.save();
    Logger.log(obj.get('objectId'))
}