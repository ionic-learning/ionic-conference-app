/**
 * Created by lvxu on 2/18/2016.
 */
import {Injectable} from 'angular2/core';
import {Config} from 'ionic/ionic';

@Injectable()
export class ApiEndpoint {
    constructor(config: Config) {
        this.apiUrlPrefix = config.get('apiUrlPrefix');
        console.log('ApiUrlPrefix ' + this.apiUrlPrefix);
    }
    
    getFullUrl(url) {
        console.log('Try to get full URL for ' + url);
        return this.apiUrlPrefix + url;
    }
}
