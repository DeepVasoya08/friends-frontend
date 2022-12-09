import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';

interface SignUp {
  fname: string;
  lname: string;
  email: string;
  password: string;
  cpassword: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  location: boolean = false;
  formGroup!: FormGroup;

  constructor(private auth: AuthServiceService, private router: Router) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      fname: new FormControl(null, [Validators.required]),
      lname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      cpassword: new FormControl(null, [Validators.required]),
    });
    this.getLocation();
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((data) => {
      this.location = true;
      this.auth.geodata(data.coords.latitude, data.coords.longitude);
    });
  }

  register() {
    navigator.permissions &&
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          if (result.state == 'denied') {
            this.location = false;
          }
          if (!this.location) {
            this.getLocation();
          }
        })
        .then(() => {
          if (!this.location) {
            Swal.fire({
              icon: 'error',
              title: 'Location Required',
              text: 'Allow location for sign-up',
            });
          } else {
            if (
              this.formGroup.value.password !== this.formGroup.value.cpassword
            ) {
              Swal.fire({
                icon: 'error',
                title: 'password not matched!',
                text: 'enter valid password!!',
              });
            } else {
              if (this.formGroup.valid) {
                this.auth.register(this.formGroup.value).subscribe({
                  next: () => {
                    this.router.navigate(['/login']);
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
        })
        .catch((e) =>
          Swal.fire({
            icon: 'error',
            text: e.error.message,
          })
        );
  }
}
