class Config {
  version: string;
  fqdn: string;
  port: number;
  protocol: string;
  signatureMethod: string;
  signatureVersion: number;
  
  constructor() {
    this.version = '2013-09-01';
    this.fqdn = 'mbaas.api.nifcloud.com';
    this.port = 443;
    this.protocol = 'https:';
    this.signatureMethod = 'HmacSHA256';
    this.signatureVersion = 2;
  }
}

export { Config };