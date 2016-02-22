import {Page, NavParams} from 'ionic/ionic';


@Page({
  templateUrl: 'build/pages/topic-detail/topic-detail.html'
})
export class TopicDetailPage {
  constructor(navParams: NavParams) {
    this.navParams = navParams;
    this.topic = navParams.topic;
    console.log(JSON.stringify(this.topic));
  }
}