import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItems} from '../../shared/menu-items/menu-items';


import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {AuthenticationService} from '../../services/authentication.service';
import {TokenStorageService} from '../../services/token-storage.service';
import {User} from '../../models/user';

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  dir = 'ltr';
  green = false;
  blue = false;
  dark = false;
  minisidebar = false;
  boxed = false;
  danger = false;
  showHide = false;
  horizontal = false;
  url = '';
  sidebarOpened = false;
  status = false;

  currentUser!: User;

  public showSearch = false;

  public config: PerfectScrollbarConfigInterface = {};
  private _mobileQueryListener: () => void;

  clickEvent(): void {
    this.status = !this.status;
  }


  constructor(
    public router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private authService: AuthenticationService,
    private tokenStorageService: TokenStorageService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1023px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);

  }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((isLoggedIn: any) => {
      if (!isLoggedIn) {
        this.router.navigateByUrl('/login');
      } else {
        this.currentUser = this.tokenStorageService.getUser();
      }
    });
  }
}
