import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {
  }

  showSuccess(message: string, title: string): void {
    this.toastr.success(message, title, {closeButton: true, newestOnTop: true, timeOut: 6000});
  }

  showError(message: string, title: string): void {
    this.toastr.error(message, title, {closeButton: true, newestOnTop: true, timeOut: 6000});
  }

  showInfo(message: string, title: string): void {
    this.toastr.info(message, title, {closeButton: true, newestOnTop: true, timeOut: 6000});
  }

}
