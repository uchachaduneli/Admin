import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
// import moment = require('moment');
import {Router} from '@angular/router';
import {TokenStorageService} from './token-storage.service';
import {Token} from '../authentication/token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private BaseUrl = `${environment.apiUrl}/auth`;

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private http: HttpClient, private tokenStorageService: TokenStorageService) {
    // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') as string));
    // this.currentUser = this.currentUserSubject.asObservable();
    if (this.isTokenExpired() === false) {
      this.loggedIn.next(true);
    } else {
      this.logout();
    }
  }

  get isLoggedIn(): any {
    return this.loggedIn.asObservable();
  }

  // public get currentUserValue(): User {
  //   return this.currentUserSubject.value;
  // }

  // tslint:disable-next-line:typedef
  login(username: string, password: string) {
    // @ts-ignore
    return this.http.post<any>(`${this.BaseUrl}/login`, {username, password})
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          console.log(user);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // localStorage.setItem('currentUser', JSON.stringify(user));
          // localStorage.setItem('token', JSON.stringify(user.token));
          // localStorage.setItem('created', JSON.stringify(user.created));
          // const expiresAt = moment().add(user.expiredInSecs, 'second');
          // localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
          // this.currentUserSubject.next(user);
          this.setUser(user);
        }
        return user;
      }));
  }

  setUser(data: any): void {
    this.tokenStorageService.saveToken(data.token);
    this.tokenStorageService.saveUser(data.user);
    // this.currentUserSubject.next(data);
    this.loggedIn.next(true);
  }

  logout(): void {
    // remove user from local storage to log user out
    this.loggedIn.next(false);
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }


  getTokenExpirationDate(token: string): Date | undefined {
    const decoded: Token = jwt_decode(token);
    if (decoded.exp === undefined) {
      return undefined;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.tokenStorageService.getToken();
    }
    // console.log('isTokenExpired', token);
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return true;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

}
