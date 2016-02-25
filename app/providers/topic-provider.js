/**
 * Created by lvxu on 2/18/2016.
 */

import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {ApiEndpoint} from './ApiEndpoint';


@Injectable()
export class TopicProvider {
    constructor(http: Http) {
        // inject the Http provider and set to this instance
        this.http = http;
    }

    loadTop10() {
        return new Promise(resolve => {
            this.http.get('http://bbs.fudan.edu.cn/bbs/top10').subscribe(res => {
                let top10 = this.convertTop10(res.text());
                console.log('Top 10 : ' + JSON.stringify(top10));
                resolve(top10);
            });
        });
    }

    loadDetail(id, loaded_by, board) {
        var url = this.constructTopicDetailUrl(id, loaded_by, board);
        console.log('url is ' + url);
        return new Promise(resolve => {
            this.http.get(url).subscribe(res => {
                let topicDetail = this.convertTopicDetail(res.text());
                console.log('detail : ' + JSON.stringify(topicDetail));
                resolve(topicDetail);
            });
        });
    }

    constructTopic(data) {
        var topic = {
            id: data._gid,
            title: data.__text,
            board: data._board,
            count: data._count,
            owner: data._owner
        };

        return topic;
    }

    convertTop10(cnv) {
        var x2js = new X2JS();
        var aftCnv = x2js.xml_str2json(cnv);

        var topics = [];
        var topTopics = aftCnv.bbstop10.top;
        for (var key in topTopics) {
            topics.push(this.constructTopic(topTopics[key]));
        }
        return topics;
    }

    constructTopicDetailUrl(id, loaded_by, board) {
        var url = 'http://bbs.fudan.edu.cn/bbs/tcon?new=1&f=' + id;
        if (loaded_by == "BNAME") {
            url += "&board=";
            url += board;
        } else {
            url += "&bid=";
            url += board;
        }
        return url;
    }

    convertTopicDetail(data) {
        var xmlDoc = new XmlDocument(data);
        return this.parseDetail(xmlDoc);
    }

    parseDetail(body) {

        var getPreviousCursorOfTopicDetail = function (gid, firstFid) {
            if (firstFid == gid) {
                return -1;
            }
            return firstFid;
        }

        var getNextCursorOfTopicDetail = function (postCount, pageCount, lastFid, isLastPage) {
            if (postCount != pageCount) {
                return -1;
            }

            if (isLastPage) {
                return -1;
            }
            return lastFid;
        }

        var parseContent = function (contentRaw) {
            var content = "";
            _(contentRaw.childrenNamed("p")).forEach(function (para) {
                content += "<p>";
                var child = para.firstChild;
                if (child) {
                    var name = child.name;
                    if (name == "br") {
                        content += "<br/>";
                    } else if (name == "a") {
                        var href = child.attr.href;
                        content += "<a href='";
                        content += href;
                        content += "'>";
                        if (child.attr.i) {
                            content += "<img src='";
                            content += href;
                            content += "'/>"
                        } else {
                            content += href;
                        }
                    } else if (name == "c") {
                        content += "<span class='a";
                        content += child.attr.h;
                        content += child.attr.f;
                        content += " a";
                        content += child.attr.b;
                        content += "'>";
                        content += child.val;
                        content += "</span>";

                    }
                } else {
                    content += para.val;
                }
                content += "</p>";
            });
            return content;
        }

        var constructPost = function (postRaw) {

            var body = "";
            var qoute = "";
            var sign = "";
            _(postRaw.childrenNamed("pa")).forEach(function (pa) {
                var m = pa.attr.m;
                if (m == "t") {
                    body += parseContent(pa);
                } else if (m == "q") {
                    //post.qoute = pa.toString({compressed:true});
                } else if (m == "s") {
                    //post.poster.sign = pa.toString({compressed:true});
                    sign += parseContent(pa);
                }
            });

            var post = {
                id: postRaw.attr.fid,
                //title : postRaw.valueWithPath("title"),
                poster: {
                    name: postRaw.valueWithPath("owner"),
                    nick: postRaw.valueWithPath("nick"),
                    sign: sign
                },
                post_time: postRaw.valueWithPath("date"),
                body: body
            };

            return post;
        }
        var isLastPage = body.attr.last;
        var pageCount = body.attr.page;
        var gid = body.attr.gid;
        var postsRaw = body.childrenNamed("po");
        var postCount = postsRaw.length;
        var firstFid = _.head(postsRaw).attr.fid;
        var lastFid = _.last(postsRaw).attr.fid;

        var previousCursor = getPreviousCursorOfTopicDetail(gid, firstFid);
        var nextCursor = getNextCursorOfTopicDetail(postCount, pageCount, lastFid, isLastPage);

        var posts = [];
        _(postsRaw).forEach(function (postRaw) {
            posts.push(constructPost(postRaw));
        });
        var result = {
            count: posts.length,
            previous_cursor: previousCursor,
            next_cursor: nextCursor,
            posts: posts
        };
        return result;
    }




}
