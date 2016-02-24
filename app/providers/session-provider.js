import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, Events} from 'ionic/ionic';
import {Http, Headers} from 'angular2/http';

@Injectable()
export class SessionProvider {
  constructor(events: Events, http:Http) {
    // inject the Http provider and set to this instance
    this.storage = new Storage(LocalStorage);
    this.events = events;
    this.HAS_LOGGED_IN = 'hasLoggedIn';
    this.http = http;
  }
  
  login(username, password) {
     return new Promise(resolve => {
         var headers = new Headers();
         headers.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
         headers.append('Content-Type', 'application/x-www-form-urlencoded');
         var body = 'id='+username+'&pw='+password;//+'&persistent=on';
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
            console.log(response);
            return true;
        }
        $.post('/bbs/login', body, function( data, statusText, xhr ) {
            console.log('status : ' +statusText);
            //console.log('response : ' + JSON.stringify(xhr));
            if (isLoginSuccess(xhr.responseText)) {
                console.log('success');
            }
        });
    });
    
  }

  
}