import { NCMB } from '../index';
import { NCMBObject } from './object';

class NCMBUser extends NCMBObject {
  static ncmb: NCMB;

  constructor(ncmb) {
    super(ncmb, 'users');
  }
  // ログイン処理
  static login(userName: string, password: string) {
    const req = this.ncmb.Request();
    const json: {} = req.get(`/${this.ncmb.version}/login`, {
      userName, password
    });
    const user = new NCMBUser(this.ncmb);
    user.sets(json);
    this.ncmb.sessionToken = json.sessionToken;
    return user;
  }
  
  // 会員登録処理
  static signUpByAccount(userName: string, password: string) {
    const req = this.ncmb.Request();
    const json: {} = req.post(`/${this.ncmb.version}/users`, {
      userName, password
    });
    const user = new NCMBUser(this.ncmb);
    user.sets(json);
    return user;
  }
  
  // 匿名会員ログイン
  static loginAsAnonymous(uuid: string) {
    if (!uuid) uuid = Utilities.getUuid();
    var data = {"authData": {"anonymous": {"id": uuid}}}
    const req = this.ncmb.Request();
    const json: {} = req.post(`/${this.ncmb.version}/users`, data);
    const user = new NCMBUser(this.ncmb);
    user.sets(json);
    this.ncmb.sessionToken = json.sessionToken;
    return user;
  }
  
  static logout() {
    this.ncmb.sessionToken = '';
  }
}

export { NCMBUser };

function _user_test() {
    const ncmb = new NCMB('53ee32f8cc60c24703fecd6e121cabb710c71c46f288b5864a64845c558d1fff', '3bafaebfa7a4fa9470ed7edf0a7e3811228f61e5ae930929cd49dce421311bbf');
    const userName = 'test1';
    const password = 'test1';
    ncmb.User.signUpByAccount(userName, password);
    const user = ncmb.User.login(userName, password);
    console.log(user.get('objectId'));
    console.log(ncmb.sessionToken);
    user.destroy();
    ncmb.User.logout();
    const anony = ncmb.User.loginAsAnonymous();
    console.log(anony.get('objectId'));
}