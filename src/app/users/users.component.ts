import { Component ,OnInit} from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PagedRequestDto, ServiceProxy, UserDto } from '../shared/service.proxies';
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
  imports: [NzTableModule,NzButtonModule],
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
  constructor(private _serviceProxy: ServiceProxy) {}
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onCurrentPageDataChange(listOfCurrentPageData: readonly UserDto[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
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
    this.userRequestDto.page = 1;
    this.userRequestDto.pageSize = 10;
    this.userRequestDto.search = "";
    this.userRequestDto.sortBy = "";
    this.userRequestDto.sortOrder = "";
    this.getUsers();
  }

  getUsers(): void{
    this._serviceProxy.editingPopupRead(this.userRequestDto).subscribe(response =>{
      this.lstUser = response.listItem ? response.listItem : [];
    }, error => {
      console.error('Error fetching users:', error);
    });
  }
}
