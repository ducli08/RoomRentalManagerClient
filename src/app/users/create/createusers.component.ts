import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateOrEditUserDto, ServiceProxy } from '../../shared/service.proxies';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { CategoryCacheService } from '../../shared/category-cache.service';

@Component({
  selector: 'app-create-users',
  templateUrl: './createusers.component.html',
  styleUrls: ['./createusers.component.css'],
  imports: [ReactiveFormsModule, NzFormItemComponent, NzFormLabelComponent,
     NzFormControlComponent, NzModalModule, NzInputModule, NzButtonModule,
     NzDatePickerModule, NzSelectModule, CommonModule],
  standalone: true,
})
export class CreateUsersComponent implements OnInit {
  createUserForm: FormGroup;
  lstProvinces: any[] = [];
  lstDistricts: any[] = [];
  lstWards: any[] = [];
  constructor(private fb: FormBuilder, private serviceProxy: ServiceProxy,private memoryCache: CategoryCacheService) {
    this.createUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      provinceCode: ['', Validators.required],
      districtCode: ['', Validators.required],
      wardCode: ['', Validators.required],
      address: ['', Validators.required],
      idCard: ['', Validators.required],
      job: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      roleGroupId: ['', Validators.required],
      bikeId: ['', Validators.required],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.createUserForm.valid) {
      const userDto: CreateOrEditUserDto = this.createUserForm.value;
      this.serviceProxy.createOrEditUser(userDto).subscribe(() => {
        alert('Người dùng đã được tạo thành công!');
        this.createUserForm.reset();
      });
    }
  }
  ngOnInit(): void {
    this.lstDistricts = this.memoryCache.get('districts') || [];
    this.lstProvinces = this.memoryCache.get('provinces') || [];
    this.lstWards = this.memoryCache.get('wards') || [];
  }
}