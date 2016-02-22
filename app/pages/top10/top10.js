import {IonicApp, Page, Modal, Alert, NavController} from 'ionic/ionic';
import {Http} from 'angular2/http';
import {TopicProvider} from '../../providers/topic-provider';
import {TopicDetailPage} from '../topic-detail/topic-detail';

@Page({
  templateUrl: 'build/pages/top10/top10.html'
})
export class Top10Page {
  constructor(app: IonicApp, nav: NavController, topicProvider: TopicProvider) {
    this.app = app;
    this.nav = nav;

    this.topicProvider = topicProvider;

    this.load();
  }
  
  load() {
      console.log('Loading Top10 ... ');
      this.topicProvider.loadTop10().then(data => {
          console.log('success to load top 10 : ' + JSON.stringify(data));
          this.topics = data;
      });
  }
  
  topicSelected(topic) {
      console.log('select : ' + JSON.stringify(topic));
      this.nav.push(TopicDetailPage, topic);
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
