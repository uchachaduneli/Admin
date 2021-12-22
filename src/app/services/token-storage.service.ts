import {Injectable} from '@angular/core';
import {User} from '../models/user';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {
  }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | undefined {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    return (token) ? token : undefined;
  }

  public setItem(item: string, value: string): void {
    window.sessionStorage.removeItem(item);
    window.sessionStorage.setItem(item, value);
  }

  public getItem(item: string): string | undefined {
    const value = window.sessionStorage.getItem(item);
    return (value) ? value : undefined;
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    // @ts-ignore
    const user = JSON.parse(window.sessionStorage.getItem(USER_KEY)) as User;
    if (user) {
      return user;
    }
    return undefined;
  }
}
