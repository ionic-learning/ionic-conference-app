import {Injectable} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic/ionic';
import {Http, Headers} from 'angular2/http';

@Injectable()
export class SessionProvider {
    constructor(http: Http) {
        // inject the Http provider and set to this instance
        this.storage = new Storage(LocalStorage);
        this.HAS_LOGGED_IN = 'hasLoggedIn';
        this.USER_NAME = 'userName';
        this.http = http;
    }

    login(username, password) {
        return new Promise(resolve => {
            var headers = new Headers();
            headers.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            var body = 'id=' + username + '&pw=' + password;//+'&persistent=on';
            /*
           this.http.post('http://bbs.fudan.edu.cn/bbs/login', 
               body, {headers:headers})
               .filter(x => x.status == '302')
               .subscribe(res => {
               console.log('login response : ' + res.status);
               this.events.publish('user:login');
               resolve(true);
           }, err => {
               console.log('login error : ' + JSON.stringify(err));
           }, () => console.log('complete login')
           );*/
            var isLoginSuccess = function (response) {
                if (response.indexOf('bbstop10') > -1) {
                    return true;
                }
                return false;
            }

            $.post('http://bbs.fudan.edu.cn/bbs/login', body, function (data, statusText, xhr) {
                console.log('status : ' + statusText);
                //console.log('response : ' + JSON.stringify(xhr));
                if (isLoginSuccess(xhr.responseText)) {
                    console.log('success');
                    resolve(true);
                } else {
                    console.log('fail to login');
                    resolve(false);
                }
            });
        });

    }

    storeLoginSession(userName) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.storage.set(this.USER_NAME, userName);
    }

    getLoginUser() {
        return this.storage.get(this.USER_NAME)._result;
    }

    isLoginUser(userName) {
        return this.getLoginUser() == userName;
    }

}