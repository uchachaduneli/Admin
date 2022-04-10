import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {TokenStorageService} from '../services/token-storage.service';
import {NotificationService} from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, private notificationService: NotificationService,
    private tokenStorageService: TokenStorageService,
    private authService: AuthenticationService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.tokenStorageService.getToken();
    if (!token) {
      this.notificationService.showInfo('გთხოვთ გაიაროთ ავტორიზაცია', '');
      return false;
    } else if (this.authService.isTokenExpired()) {
      this.authService.logout();
      this.notificationService.showInfo('გთხოვთ გაიაროთ ავტორიზაცია', '');
      return false;
    } else {
      return true;
    }
  }
}

// export class AuthGuard implements CanLoad {
//   constructor(
//     private router: Router, private notificationService: NotificationService,
//     private tokenStorageService: TokenStorageService,
//     private authService: AuthenticationService
//   ) {
//   }
//
//     canLoad(): boolean {
//     const token = this.tokenStorageService.getToken();
//     if (!token) {
//       this.notificationService.showError('Please Login', '');
//       return false;
//     } else if (this.authService.isTokenExpired()) {
//       this.authService.logout();
//       this.notificationService.showError('Token Expired Please Login', '');
//       return false;
//     } else {
//       return true;
//     }
//   }
// }
