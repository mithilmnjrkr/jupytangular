import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';

export let callbackUrl = 'localhost';

@Injectable()
export class SearchService {
    http: Http

    constructor(public
) {
}

search(query
:
string
):
Observable < Response > {
    console.log('Searching ' + query);
return this.http.post(callbackUrl, {query});
}
}
