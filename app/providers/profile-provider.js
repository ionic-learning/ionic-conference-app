import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, Events} from 'ionic/ionic';
import {Http, Headers} from 'angular2/http';


@Injectable()
export class ProfileProvider {
  constructor(http:Http) {
    this.http = http;
  }
  
  loadProfile(username) {
      console.log('Try to load user profile : ' + username);
      var url = '/bbs/qry?u=' + username;
      return new Promise(resolve => {
      this.http.get(url).subscribe(res => {
          console.log('Info : ' + res.text());
          resolve(res.text());
        });
       });
  }

  
}