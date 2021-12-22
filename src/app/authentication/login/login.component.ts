import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup = Object.create(null);

  constructor(private fb: FormBuilder, private router: Router,
              private authService: AuthenticationService,
              private notifyService: NotificationService) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit(): void {
    const val = this.form.value;
    if (val.uname && val.password) {
      this.authService.login(val.uname, val.password).subscribe(() => {
        this.router.navigateByUrl('/users');
      }, error => {
        console.log(error);
        this.notifyService.showError('ავტორიზაცია ვერ მოხერხდა', '');
      });
    }
  }
}
