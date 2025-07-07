import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectListItem, ServiceProxy } from '../../../shared/service.proxies';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { CategoryCacheService } from '../../../shared/category-cache.service';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-editroomrentals',
  imports: [ReactiveFormsModule, NzFormItemComponent, NzFormLabelComponent,
     NzFormControlComponent, NzModalModule, NzInputModule, NzButtonModule,
     NzDatePickerModule, NzSelectModule, CommonModule, NzIconModule],
  templateUrl: './editroomrentals.component.html',
  styleUrl: './editroomrentals.component.css'
})
export class EditRoomRentalsComponent {
editUserForm: FormGroup;
  constructor(private fb: FormBuilder, private serviceProxy: ServiceProxy,private memoryCache: CategoryCacheService, @Inject(NZ_MODAL_DATA) public data: {roomrentalData: any}) {
    this.editUserForm = this.fb.group({
      id: ['', Validators.required],
      roomNumber: ['', Validators.required],
      roomType: ['', Validators.required],
      price: ['', Validators.required],
      statusRoom: ['', Validators.required],
      note: ['', Validators.required],
      area: ['', Validators.required]
    });
  }

  onSubmit(): void {
    // if (this.editUserForm.valid) {
    //   const userDto: CreateOrEditUserDto = this.editUserForm.value;
    //   this.serviceProxy.createOrEditUser(userDto).subscribe(() => {
    //     alert('Người dùng đã được tạo thành công!');
    //     this.editUserForm.reset();
    //   });
    // }
  }
  ngOnInit(): void {
    // this.lstDistricts = this.memoryCache.get('districts') || [];
    // this.lstProvinces = this.memoryCache.get('provinces') || [];
    // this.lstWards = this.memoryCache.get('wards') || [];

    // if(this.data.userData){
    //     this.editUserForm.patchValue(this.data.userData);
    // }
  }
}
