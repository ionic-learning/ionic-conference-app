import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, Events} from 'ionic/ionic';
import {Http, Headers} from 'angular2/http';
import {SessionProvider} from './session-provider';

@Injectable()
export class ProfileProvider {
    constructor(http: Http, sessionProvider: SessionProvider) {
        this.http = http;
        this.sessionProvider = sessionProvider;
    }

    loadProfile(username) {
        console.log('Try to load user profile : ' + JSON.stringify(username));
        var url = 'http://bbs.fudan.edu.cn/bbs/qry?u=' + username;
        return new Promise(resolve => {
            this.http.get(url).subscribe(res => {
                //console.log('Info : ' + res.text());
                var profile = this.constructBasicProfile(res.text());
                console.log('Profile : ' + JSON.stringify(profile));
                if (this.sessionProvider.isLoginUser(username)) {
                    this.loadSelfProfile(profile).then(data => {
                        resolve(data);
                    });
                } else {
                    resolve(profile);
                }
            });
        });
    }

    loadSelfProfile(user) {
        console.log('Try to load self profile ... ');
        return new Promise(resolve => {
            this.http.get('http://bbs.fudan.edu.cn/bbs/info').subscribe(res => {
                var profile = this.constructSelfProfile(res.text(), user);
                this.loadSelfSignature(profile).then(data => {
                    resolve(data);
                });
            });
        });
    }
    
    loadSelfSignature(user) {
        console.log('Try to load self signature ... ');
        return new Promise(resolve => {
            this.http.get('http://bbs.fudan.edu.cn/bbs/sig').subscribe(res => {
                var profile = this.constructSelfSignature(res.text(), user);
                resolve(profile);
            });
        });
    }
    
    constructSelfSignature(response, user) {
        var x2js = new X2JS();
        var body = x2js.xml_str2json(response);
        user.profile.signature = body.bbseufile.text
        return user;
    }
    
    constructSelfProfile(response, user) {
        var x2js = new X2JS();
        var body = x2js.xml_str2json(response);
        var info = body.bbsinfo;

        var birthDay = {
            year: info._year,
            month: info._month,
            day: info._day
        };

        user.history.post_count = info._post;
        user.history.login_count = info._login;
        user.history.online_time = info._stay;
        user.history.register_date = info._since;
        user.history.last_login_ip = info._host;
        user.history.last_login_time = info._last;
        user.profile.gender = info._gender;
        user.profile.birth_date = birthDay;
        user.profile.nick = info.nick;

        return user;
    }

    constructBasicProfile(response) {
        var x2js = new X2JS();
        var body = x2js.xml_str2json(response);
        //console.log('JSON : ' + JSON.stringify(body));
      
      
        var states = body.bbsqry.st;
        var status = states && states[0] ? states[0].$ : null;
        //console.log("status :" + JSON.stringify(status));
        var info = body.bbsqry;
        //console.log("info:" +  JSON.stringify(info));

        var profile = {
            id: info._id,
            nick: body.bbsqry.nick,
            gender: info._gender,
            horoscope: info._horo,
            is_visible: status && status._vis == 1 ? true : false,
            is_web: status && status._web == 1 ? true : false,
            desc: status ? status._desc : "",
            signature: "",
            introdution: body.bbsqry.smd,
            ident: body.bbsqry.ident.indexOf("光华网友") != -1 ? "光华网友" : "天外来客"
        };

        var history = {
            idle_time: status ? status._idle : 0,
            post_count: info._post,
            login_count: info._login,
            last_login_time: info._lastlogin,
            last_login_ip: body.bbsqry.ip
        };

        var performance = {
            performance: info._perf,
            hp: info._hp,
            level: info._level,
            repeat: info._repeat,
            money: info._money,
            contrib: info._contrib,
            rank: info._rank
        };

        var user = {
            profile: profile,
            history: history,
            performance: performance
        };
        return user;
    }
}