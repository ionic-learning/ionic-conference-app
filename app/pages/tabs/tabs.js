import {Page} from 'ionic/ionic';
import {SchedulePage} from '../schedule/schedule';
import {SpeakerListPage} from '../speaker-list/speaker-list';
import {AboutPage} from '../about/about';
import {Top10Page} from '../top10/top10';
import {Input} from 'angular2/core';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  constructor() {
    // set the root pages for each tab
    this.tab1Root = SchedulePage;
    this.tab2Root = SpeakerListPage;
    this.tab3Root = AboutPage;
    this.tab4Root = Top10Page;
  }
}
