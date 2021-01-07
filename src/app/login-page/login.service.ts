import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  sendId = new Subject<string>();
  loggedInUserId = this.sendId.asObservable();

  
  checkUserandPass(name: string, pwd: string):Observable <any> {
    let user = {
      username:name,
      password:pwd
    }
    
    return this.http.post(environment.baseUrl+"token/generate-token",user);
      
    
  }

  forgotPasswordEmail(email:any):Observable<any>{
    return this.http.get(environment.baseUrl+"token/forgotPassword/"+email);

  }
  resetpassword(obj:any):Observable<any>{
   return this.http.post(environment.baseUrl+"token/resetPassword",obj)
  }


}

