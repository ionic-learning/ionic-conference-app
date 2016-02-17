import {IonicApp, Page, Modal, Alert, NavController} from 'ionic/ionic';
import {Http} from 'angular2/http';
import {ConferenceData} from '../../providers/conference-data';
import {UserData} from '../../providers/user-data';
import {ScheduleFilterPage} from '../schedule-filter/schedule-filter';
import {SessionDetailPage} from '../session-detail/session-detail';


@Page({
  templateUrl: 'build/pages/schedule/schedule.html'
})
export class SchedulePage {
  constructor(app: IonicApp, nav: NavController, confData: ConferenceData, user: UserData, http: Http) {
    this.app = app;
    this.nav = nav;
    this.confData = confData;
    this.user = user;

    this.http = http;


    this.dayIndex = 0;
    this.queryText = '';
    this.excludeTracks = [];
    this.filterTracks = [];
    this.segment = 'all';

    this.hasSessions = false;
    this.groups = [];

    this.updateSchedule();
    this.testLoadData();
  }

  testLoadData() {
    this.http.get('http://192.168.31.128:8100/bbs/top10').subscribe(res => {
      console.log(res.text());
    console.log(JSON.stringify(this.processData(res.text())));
    });
  }

  constructTopic(data) {
    var topic = {
      id : data._gid,
      title : data.__text,
      board : data._board,
      count : data._count,
      owner : data._owner
    };

    return topic;
  }

  processData (cnv) {
    var x2js = new X2JS();
    var aftCnv = x2js.xml_str2json(cnv);

    var topics = [];
    var topTopics = aftCnv.bbstop10.top;
    for (var key in topTopics) {
      topics.push(this.constructTopic(topTopics[key]));
    }
    return topics;
  }

  onPageDidEnter() {
    this.app.setTitle('Schedule');
  }

  updateSchedule() {
    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).then(data => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });
  }

  presentFilter() {
    let modal = Modal.create(ScheduleFilterPage, this.excludeTracks);
    this.nav.present(modal);

    modal.onDismiss(data => {
      if (data) {
        this.excludeTracks = data;
        this.updateSchedule();
      }
    });

  }

  goToSessionDetail(sessionData) {
    // go to the session detail page
    // and pass in the session data
    this.nav.push(SessionDetailPage, sessionData);
  }

  addFavorite(slidingItem, sessionData) {

    if (this.user.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // create an alert instance
      let alert = Alert.create({
        title: 'Favorite already added',
        message: 'Would you like to remove this session from your favorites?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              // they clicked the cancel button, do not remove the session
              // close the sliding item and hide the option buttons
              slidingItem.close();
            }
          },
          {
            text: 'Remove',
            handler: () => {
              // they want to remove this session from their favorites
              this.user.removeFavorite(sessionData.name);

              // close the sliding item and hide the option buttons
              slidingItem.close();
            }
          }
        ]
      });
      // now present the alert on top of all other content
      this.nav.present(alert);

    } else {
      // remember this session as a user favorite
      this.user.addFavorite(sessionData.name);

      // create an alert instance
      let alert = Alert.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }
      });
      // now present the alert on top of all other content
      this.nav.present(alert);
    }

  }

}
