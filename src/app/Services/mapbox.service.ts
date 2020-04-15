import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs'
import {environment} from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  constructor(private http:HttpClient) { }


  getGeoLocations(txt):Observable<any>{
    const api="https://api.mapbox.com/geocoding/v5/mapbox.places/";
    return this.http.get(api+txt+".json?limit=5&access_token="+environment.mapboxKey);
  }
}
