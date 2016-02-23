import {IonicApp, Page, NavController, Storage, LocalStorage, Events} from 'ionic/ionic';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';
import {SessionProvider} from '../../providers/session-provider';


@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  constructor(nav: NavController, events: Events, sessionProvider: SessionProvider) {
    this.nav = nav;
    this.sessionProvider = sessionProvider;

    this.login = {};
    this.submitted = false;
    
    this.events = events;
  }

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
        console.log('try to login for :' + JSON.stringify(this.login));
      this.sessionProvider.login(this.login.username, this.login.password).then(data => {
          console.log('success to login : ' + JSON.stringify(data));
          this.nav.push(TabsPage);
      });
      
    }
  }

  onSignup() {
    this.nav.push(SignupPage);
  }
}
