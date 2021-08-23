import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
// import moment = require('moment');
import * as moment from 'moment';
import {MomentInput} from 'moment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private BaseUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') as string));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // tslint:disable-next-line:typedef
  login(username: string, password: string) {
    // @ts-ignore
    return this.http.post<any>(`${this.BaseUrl}/login`, {username, password})
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          console.log(user);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', JSON.stringify(user.token));
          localStorage.setItem('created', JSON.stringify(user.created));
          const expiresAt = moment().add(user.expiredInSecs, 'second');
          localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  public isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration(): MomentInput {
    const expiration = localStorage.getItem('expires_at');
    if (expiration != null) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    } else {
      console.log('logging out caused by : Cant get token expiration from storage');
      this.logout();
      return null;
    }
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('token');
    // @ts-ignore
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

}
