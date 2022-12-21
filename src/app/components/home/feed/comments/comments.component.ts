import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PostServiceService } from 'src/app/services/post-service.service';
import { PostInterface } from 'src/app/store/model';
import { userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
})
export class CommentsComponent {
  postData: any;
  message = '';

  // cur user
  uid!: string;
  fname!: string;
  lname!: string;

  constructor(
    public dialogRef: MatDialogRef<CommentsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: PostInterface,
    private postS: PostServiceService,
    private store: Store<State>
  ) {
    this.postData = this.data;
    this.store.pipe(select(userSelector)).subscribe({
      next: (data) => {
        this.uid = data._id;
        this.fname = data.fname;
        this.lname = data.lname;
      },
    });
  }

  postComment() {
    this.postS.postComments(
      this.postData._id,
      this.uid,
      this.fname,
      this.lname,
      this.message
    );
    this.dialogRef.close();
  }
}
