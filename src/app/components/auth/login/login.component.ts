import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';

interface LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formint: LoginForm = {
    email: '',
    password: '',
  };

  constructor(private auth: AuthServiceService) {}

  ngOnInit(): void {}

  login(form: NgForm): void {
    this.auth.login(form.value).subscribe({
      next: (data) => {
        data.toString();
        this.auth.saveData(data);
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
