import {IonicApp, Page, Modal, Alert, NavController, Storage, LocalStorage} from 'ionic/ionic';
import {Http} from 'angular2/http';
import {SessionProvider} from '../../providers/session-provider';
import {ProfileProvider} from '../../providers/profile-provider';

@Page({
  templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage {
  constructor(app: IonicApp, nav: NavController, 
        sessionProvider : SessionProvider, profileProvider: ProfileProvider) {
    this.app = app;
    this.nav = nav;
    this.sessionProvider = sessionProvider;
    this.profileProvider = profileProvider;

    this.load();
  }
  
  load() {
      console.log('Loading Profile ... ');
      var username = this.sessionProvider.getLoginUser();
      this.profileProvider.loadProfile(username).then(data => {
          console.log('success to load profile : ' + data);
      });
  }
  

}
