import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostServiceService } from 'src/app/services/post-service.service';
import { PostInterface } from 'src/app/store/model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
})
export class CommentsComponent {
  postData: any;
  message = '';
  constructor(
    public dialogRef: MatDialogRef<CommentsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: PostInterface,
    private postS: PostServiceService
  ) {
    this.postData = this.data;
  }

  postComment() {
    this.postS.postComments(
      this.postData._id,
      this.postData.userId,
      this.postData.fname,
      this.postData.lname,
      this.message
    );
    this.dialogRef.close();
  }
}
