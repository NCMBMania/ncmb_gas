import { NCMB } from '../index';
import { assert, expect } from 'chai';
describe('Base', () => {
  it('Initialize NCMB', () => {
    const applicationKey = 'aaa';
    const clientKey = 'bbb';
    const ncmb = new NCMB(applicationKey, clientKey);
    expect(ncmb.applicationKey).to.equal(applicationKey);
  });
  it('Initialize NCMB 2', () => {
    const applicationKey = 'aaa';
    const clientKey = 'bbb';
    const ncmb = new NCMB(applicationKey, clientKey);
    expect(ncmb.signatureVersion).to.equal(2);
  });
});