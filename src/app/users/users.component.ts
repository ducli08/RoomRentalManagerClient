import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { PagedRequestDto, SelectListItem, ServiceProxy, UserDto } from '../shared/service.proxies';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { CreateUsersComponent } from './create/createusers.component';
import { CategoryCacheService } from '../shared/category-cache.service';
import { forkJoin, of } from 'rxjs';
import { EditUsersComponent } from './edit/editusers.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
export interface Data {
  id: number;
  name: string;
  email: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  idCard: string;
  job: string;
  dateOfBirth: string;
  gender: string;
  bikeId: string;
  address: string;
  disabled: boolean;
}
@Component({
  selector: 'app-users',
  imports: [NzTableModule, NzButtonModule, CommonModule, NzModalModule, NzIconModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  standalone: true
})
export class UsersComponent implements OnInit {
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: readonly Data[] = [];
  lstUser: readonly UserDto[] = [];
  userRequestDto: PagedRequestDto = new PagedRequestDto();
  listOfCurrentPageData: readonly UserDto[] = [];
  setOfCheckedId = new Set<number>();
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  lstProvinces: SelectListItem[] = [];
  lstDistricts: SelectListItem[] = [];
  lstWards: SelectListItem[] = [];
  constructor(private _serviceProxy: ServiceProxy, private modalService: NzModalService, private memoryCache: CategoryCacheService) { }
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onPageChange(page: number): void {
    debugger
    this.pageIndex = page;
    this.userRequestDto.page = page;
    this.getUsers();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.userRequestDto.pageSize = pageSize;
    this.getUsers();
  }
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData;
    this.checked = listOfEnabledData.every(({ id }) => id !== undefined && this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => id !== undefined && this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .forEach(({ id }) => id !== undefined && this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  sendRequest(): void {
    this.loading = true;
    const requestData = this.listOfData.filter(data => data.id !== undefined && this.setOfCheckedId.has(data.id));
    console.log(requestData);
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loading = false;
    }, 1000);
  }

  ngOnInit(): void {
    this.userRequestDto.page = this.pageIndex;
    this.userRequestDto.pageSize = this.pageSize;
    this.userRequestDto.search = "";
    this.userRequestDto.sortBy = "";
    this.userRequestDto.sortOrder = "";
    const cachedProvinces = this.memoryCache.get<SelectListItem[]>('provinces');
    const cachedDistricts = this.memoryCache.get<SelectListItem[]>('districts');
    const cachedWards = this.memoryCache.get<SelectListItem[]>('wards');
    const provinceObservable = cachedProvinces ? of(cachedProvinces) : this._serviceProxy.getAllProvince();
    const districtObservable = cachedDistricts ? of(cachedDistricts) : this._serviceProxy.getAllDistrict(undefined);
    const wardObservable = cachedWards ? of(cachedWards) : this._serviceProxy.getAllWard(undefined);
    forkJoin([provinceObservable, districtObservable, wardObservable])
      .subscribe(([provinces, districts, wards]) => {
        this.lstProvinces = provinces ? provinces : [];
        this.lstDistricts = districts ? districts : [];
        this.lstWards = wards ? wards : [];
        if (!cachedProvinces) this.memoryCache.set('provinces', provinces);
        if (!cachedDistricts) this.memoryCache.set('districts', districts);
        if (!cachedWards) this.memoryCache.set('wards', wards);
        this.getUsers();
      },
        error => {
          console.error('Error fetching data:', error);
        }
      );
  }

  getUsers(): void {
    this._serviceProxy.editingPopupRead(this.userRequestDto).subscribe(response => {
      this.lstUser = response.listItem ? response.listItem : [];
      this.total = response.totalCount ? response.totalCount : 0;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  getProvinceName(provinceId: string | undefined): string {
    if (!provinceId) return '';
    const province = this.lstProvinces.find(p => p.value === provinceId.toString());
    return province ? province.text ?? '' : '';
  }

  getDistrictName(districtId: string | undefined): string {
    if (!districtId) return '';
    const district = this.lstDistricts.find(d => d.value === districtId.toString());
    return district ? district.text ?? '' : '';
  }

  getWardName(wardId: string | undefined): string {
    if (!wardId) return '';
    const ward = this.lstWards.find(w => w.value === wardId.toString());
    return ward ? ward.text ?? '' : '';
  }

  trackData(index: number, item: any): any {
    return item.id;  // Hoặc bất kỳ thuộc tính duy nhất nào của item
  }

  openCreateUserModal(): void {
    this.modalService.create({
      nzTitle: 'Tạo người dùng mới',
      nzContent: CreateUsersComponent,
      nzWidth: '600px',
      nzStyle: { height: '70vh' },
      nzBodyStyle: { overflow: 'auto', maxHeight: 'calc(70vh - 55px)' },
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => this.modalService.closeAll(), 
        },
        {
          label: 'Lưu',
          type: 'primary',
          disabled: (componentInstance) => !componentInstance?.createUserForm.valid, // Custom disabled
          onClick: (componentInstance) => {
            if (componentInstance) {
              componentInstance.onSubmit(); // Gọi hàm submit trong component con
            }
          },
        },
      ]
    });
  }

  openEditUserModal(user: UserDto): void {
    this.modalService.create<EditUsersComponent, { userData: any }, string>({
      nzTitle: 'Chỉnh sửa người dùng',
      nzContent: EditUsersComponent,
      nzData: { userData: user },
      nzWidth: '600px',
      nzStyle: { height: '70vh' }, 
      nzBodyStyle: { overflow: 'auto', maxHeight: 'calc(70vh - 55px)' }, 
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => this.modalService.closeAll(), 
        },
        {
          label: 'Lưu',
          type: 'primary',
          disabled: (componentInstance) => !componentInstance?.editUserForm.valid, // Custom disabled
          onClick: (componentInstance) => {
            if (componentInstance) {
              componentInstance.onSubmit(); // Gọi hàm submit trong component con
            }
          },
        },
      ],
    })
  }
}
