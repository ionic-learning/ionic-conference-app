import {Page, NavParams} from 'ionic/ionic';
import {TopicProvider} from '../../providers/topic-provider';


@Page({
  templateUrl: 'build/pages/topic-detail/topic-detail.html'
})
export class TopicDetailPage {
  constructor(navParams: NavParams, topicProvider: TopicProvider) {
    this.navParams = navParams;
    this.topic = navParams.data;
    console.log(JSON.stringify(this.topic));
    
    this.topicProvider = topicProvider;
    
    this.load();
  }
  
  load() {
      console.log('Loading topic detail ... ');
      this.topicProvider.loadDetail(this.topic.id, 'BNAME', this.topic.board)
        .then(data => {
          console.log('success to load topic detail : ' + JSON.stringify(data));
          this.topics = data;
      });
  }
}