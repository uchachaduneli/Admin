import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {merge, Observable, of as observableOf} from 'rxjs';
import {FileUploadService} from '../services/file-upload.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Files} from '../models/files';
import {catchError, map, startWith, switchMap, take} from 'rxjs/operators';
import {NotificationService} from '../services/notification.service';
import {ConfirmDialogComponent, ConfirmDialogModel} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TokenStorageService} from '../services/token-storage.service';
import {User} from '../models/user';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, AfterViewInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  @Input() parcelId!: number;
  @Input() showNewlyUploadedFilesUl!: boolean;
  @Input() showUploadedFilesTable!: boolean;
  fileList!: Files[];
  currentUser!: User;

  fileInfos?: Observable<any>;

  constructor(private notifyService: NotificationService,
              private tokenStorageService: TokenStorageService,
              private uploadService: FileUploadService,
              private dialog: MatDialog) {
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  loadParcelFiles(): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.uploadService.getFiles(this.parcelId);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(() => {
          this.notifyService.showError('არსებული ფაილების ჩატვირთვა ვერ მოხერხდა', '');
          return observableOf([]);
        })
      ).subscribe(data => {
      this.fileList = data as Files[];
    });
  }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
    this.currentUser = this.tokenStorageService.getUser();
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile, this.parcelId, this.currentUser.id).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
              this.loadParcelFiles();
              this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }

      this.selectedFiles = undefined;
    }
  }

  downloadFile(fileName: string): void {
    this.uploadService.getFileByName(fileName).pipe(take(1))
      .subscribe((resp) => {
        const downloadLink = document.createElement('a');
        // @ts-ignore
        downloadLink.href = URL.createObjectURL(new Blob([resp.body], {type: resp.body.type}));
        // @ts-ignore
        downloadLink.download = fileName;
        downloadLink.click();
      });
  }

  confirmFileDeletion(fileName: string): void {
    const message = `ფაილის წაშლა`;
    const dialogData = new ConfirmDialogModel('დაადასტურეთ ოპერაცია', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.uploadService.delete(fileName).subscribe(
          (event: any) => {
            this.notifyService.showInfo('ფაილის წაშლა დასრულდა წარმატებით', '');
            console.log(event.message);
            this.loadParcelFiles();
          },
          (err: any) => {
            console.log(err);
            if (err.error && err.error.message) {
              this.notifyService.showError(err.error.message, '');
            } else {
              this.notifyService.showError('ფაილის წაშლა ვერ მოხერხდა', '');
            }
          });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.showUploadedFilesTable && this.parcelId) {
      this.loadParcelFiles();
    }
  }

}
