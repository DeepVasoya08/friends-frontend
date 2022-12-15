import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(private auth: AuthServiceService) {
    const checkToken = localStorage.getItem('auth');
    if (checkToken != null || checkToken != undefined) {
      this.auth.reload();
    }
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  login(): void {
    if (this.formGroup.valid) {
      this.auth.login(this.formGroup.value).subscribe({
        next: (data) => {
          const token = data.headers.get('token');
          this.auth.saveData(data.body, token);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            text: err.error.message,
          });
        },
      });
    }
  }
}
