import { CreateOrEditRoomRentalDto, ServiceProxy } from '../../../shared/service.proxies';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { CategoryCacheService } from '../../../shared/category-cache.service'; 
@Component({
  selector: 'app-createroomrentals',
  imports: [ReactiveFormsModule, NzFormItemComponent, NzFormLabelComponent,
     NzFormControlComponent, NzModalModule, NzInputModule, NzButtonModule,
     NzDatePickerModule, NzSelectModule, CommonModule],
  templateUrl: './createroomrentals.component.html',
  styleUrl: './createroomrentals.component.css'
})
export class CreateRoomRentalsComponent {
  createRoomRentalForm: FormGroup;
  constructor(private fb: FormBuilder, private serviceProxy: ServiceProxy) {
    this.createRoomRentalForm = this.fb.group({
        roomNumber: ['', Validators.required],
        roomType: ['', [Validators.required, Validators.email]],
        statusRoom: ['', Validators.required],
        note: ['', Validators.required],
        area: ['', Validators.required]
      });
    }
  
    onSubmit(): void {
      if (this.createRoomRentalForm.valid) {
        const roomRentalDto: CreateOrEditRoomRentalDto = this.createRoomRentalForm.value;
        this.serviceProxy.createOrEditRoomRental(roomRentalDto).subscribe(() => {
          alert('Phòng cho thuê đã được tạo thành công!');
          this.createRoomRentalForm.reset();
        });
      }
    }
    ngOnInit(): void {
    }
}
