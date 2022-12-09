import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { debounceTime, Observable, Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { PostInterface, UserInterface } from 'src/app/store/model';
import { userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';
import { MatDialog } from '@angular/material/dialog';
import { RequestsComponent } from './requests/requests.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  textSearch: string = '';
  user: Observable<UserInterface>;
  uid!: string;
  subject = new Subject<any>();
  res: any; // for debouncing

  req_queue: any;

  constructor(
    private store: Store<State>,
    protected userService: UserService,
    private dialog: MatDialog
  ) {
    this.user = this.store.pipe(select(userSelector));
    this.user.subscribe({
      next: (data) => (this.uid = data._id),
    });
  }

  ngOnInit(): void {
    this.userService.req_queue.subscribe((val) => {
      this.req_queue = val;
    });
    this.subject.pipe(debounceTime(1000)).subscribe((d) => this.search(d));
  }

  onChange(res: any) {
    this.subject.next(res.target.value);
  }

  seeRequests() {
    this.dialog.open(RequestsComponent);
  }

  search(val: string) {
    if (this.textSearch)
      this.userService.searchUser(val).subscribe({
        next: (data) => (this.res = data),
        error: (e) => alert(e.message),
      });
  }
}
