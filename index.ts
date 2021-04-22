import { Config } from './libs/config';
import { NCMBObject, NCMBInstallation, NCMBPush, NCMBFile } from './libs/object';
import { NCMBQuery } from './libs/query';
import { NCMBRequest } from './libs/request';
import { NCMBAcl } from './libs/acl';
import { NCMBUser } from './libs/user';
import { NCMBScript } from './libs/script';
import { NCMBGeoPoint } from './libs/geopoint';

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
  User: typeof NCMBUser;
  Installation: typeof NCMBInstallation;
  Push: typeof NCMBPush;
  File: typeof NCMBFile;

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
    this.User = NCMBUser;
    this.User.ncmb = this;
    this.Installation = NCMBInstallation;
    this.Installation.ncmb = this;
    this.Push = NCMBPush;
    this.Push.ncmb = this;
    this.File = NCMBFile;
    this.File.ncmb = this;
  }
  
  Object(name: string): NCMBObject {
    return new NCMBObject(this, name);
  }
  
  Request(): NCMBRequest {
    return new NCMBRequest(this);
  }
  
  Query(name: string): NCMBQuery {
    return new NCMBQuery(this, name);
  }
  
  Acl(): NCMBAcl {
    return new NCMBAcl;
  }
  
  Script(): NCMBScript {
    return new NCMBScript(this);
  }

  GeoPoint(latitude:number, longitude:number): NCMBGeoPoint {
    return new NCMBGeoPoint(latitude, longitude);
  }
}

function init(applicationKey: string, clientKey: string, config: Config = new Config()) {
  return new NCMB(applicationKey, clientKey, config);
}

export { NCMB, init };

function _test() {
    const ncmb = new NCMB('53ee32f8cc60c24703fecd6e121cabb710c71c46f288b5864a64845c558d1fff', '3bafaebfa7a4fa9470ed7edf0a7e3811228f61e5ae930929cd49dce421311bbf');
    const className = 'Test';
    const obj = ncmb.Object('Test');
    const fields = {a: 'b', c: 'd'};
    obj.sets(fields);
    obj.save();
    console.log(obj.get('objectId'));
    obj.set('memo', new Date());
    obj.save();
    console.log(obj.get('updateDate'));
}