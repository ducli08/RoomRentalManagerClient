import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateOrEditUserDto, ServiceProxy } from '../../shared/service.proxies';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-create-users',
  templateUrl: './createusers.component.html',
  styleUrls: ['./createusers.component.css'],
  imports: [ReactiveFormsModule, NzFormItemComponent, NzFormLabelComponent,
     NzFormControlComponent, NzModalModule, NzInputModule, NzButtonModule],
  standalone: true,
})
export class CreateUsersComponent {
  createUserForm: FormGroup;

  constructor(private fb: FormBuilder, private serviceProxy: ServiceProxy) {
    this.createUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      provinceId: ['', Validators.required],
      districtId: ['', Validators.required],
      wardId: ['', Validators.required],
      address: ['', Validators.required],
      idCard: ['', Validators.required],
      job: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  onSubmit(): void {
    debugger
    if (this.createUserForm.valid) {
      const userDto: CreateOrEditUserDto = this.createUserForm.value;
      this.serviceProxy.createOrEditUser(userDto).subscribe(() => {
        alert('Người dùng đã được tạo thành công!');
        this.createUserForm.reset();
      });
    }
  }
}