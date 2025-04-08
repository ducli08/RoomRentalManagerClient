import { Component ,OnInit} from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { PagedRequestDto, ServiceProxy, UserDto } from '../shared/service.proxies';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { CreateUsersComponent } from './create/createusers.component';
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
  imports: [NzTableModule,NzButtonModule, CommonModule, NzModalModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  standalone: true
})
export class UsersComponent implements OnInit{
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: readonly Data[] = [];
  lstUser: readonly UserDto[] = [];
  userRequestDto : PagedRequestDto = new PagedRequestDto();
  listOfCurrentPageData: readonly UserDto[] = [];
  setOfCheckedId = new Set<number>();
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  constructor(private _serviceProxy: ServiceProxy, private modalService: NzModalService) {}
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
    this.getUsers();
  }

  getUsers(): void{
    this._serviceProxy.editingPopupRead(this.userRequestDto).subscribe(response =>{
      this.lstUser = response.listItem ? response.listItem : [];
      this.total = response.totalCount ? response.totalCount : 0;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  trackData(index: number, item: any): any {
    return item.id;  // Hoặc bất kỳ thuộc tính duy nhất nào của item
  }

  openCreateUserModal(): void {
    this.modalService.create({
      nzTitle: 'Tạo người dùng mới',
      nzContent: CreateUsersComponent,
      nzFooter: null, // Bạn có thể thêm footer tùy chỉnh nếu cần
    });
  }
}
