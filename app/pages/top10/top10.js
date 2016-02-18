import {IonicApp, Page, Modal, Alert, NavController} from 'ionic/ionic';
import {Http} from 'angular2/http';
import {TopicsProvider} from '../../providers/TopicsProvider';


@Page({
  templateUrl: 'build/pages/top10/top10.html'
})
export class Top10Page {
  constructor(app: IonicApp, nav: NavController, topicsProvider: TopicsProvider) {
    this.app = app;
    this.nav = nav;

    this.topicsProvider = topicsProvider;

    this.load();
  }
  
  load() {
      console.log('Loading Top10 ... ');
      this.topicsProvider.loadTop10().then(data => {
          console.log('success to load top 10 : ' + JSON.stringify(data));
          this.topics = data;
      });
  }
  
  topicSelected(topic) {
      console.log('select : ' + JSON.stringify(topic));
  }
  
  doRefresh(refresher) {
    console.log('Doing Refresh', refresher)

    setTimeout(() => {
      refresher.complete();
      console.log("Complete");
    }, 5000);
  }

  doStart(refresher) {
    console.log('Doing Start', refresher);
  }

  doPulling(refresher) {
    console.log('Pulling', refresher);
  }

}
