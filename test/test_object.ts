import { NCMB } from '../index';
import { assert, expect } from 'chai';
import config from './config';

describe('Object', () => {
  it('Initialize Object', () => {
    const applicationKey = 'aaa';
    const clientKey = 'bbb';
    const ncmb = new NCMB(applicationKey, clientKey);
    const className = 'Test';
    const obj = ncmb.Object('Test');
    expect(obj.className).to.equal(className);
  });
  
  it('Set Object', () => {
    const applicationKey = 'aaa';
    const clientKey = 'bbb';
    const ncmb = new NCMB(applicationKey, clientKey);
    const className = 'Test';
    const obj = ncmb.Object('Test');
    const fields = {a: 'b', c: 'd'};
    obj.sets(fields);
    assert.deepEqual(obj.fields, fields);
  });
  
  it('Save Object', () => {
    const ncmb = new NCMB(config.applicationKey, config.clientKey);
    const className = 'Test';
    const obj = ncmb.Object('Test');
    const fields = {a: 'b', c: 'd'};
    obj.sets(fields);
    obj.save();
    assert.deepEqual(obj.fields, fields);
  });
  
});
