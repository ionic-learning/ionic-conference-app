/**
 * Created by lvxu on 2/18/2016.
 */

import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {ApiEndpoint} from './ApiEndpoint';


@Injectable()
export class TopicsProvider {
  constructor(http:Http) {
    // inject the Http provider and set to this instance
    this.http = http;
  }

  loadTop10() {
    return new Promise(resolve => {
        this.http.get(ApiEndpoint.url + '/top10'.subscribe(res => {
          console.log(res.text());
          let top10 = this.processData(res.text());
          console.log('Top 10 : ' + JSON.stringify(top10));
          resolve(top10);
        });
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
}
