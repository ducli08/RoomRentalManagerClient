import { Component } from '@angular/core';
import { RoomRentalDto, RoomRentalFilterDto, SelectListItem, RoomRentalFilterDtoPagedRequestDto, RoomType, RoomStatus, ServiceProxy } from '../../shared/service.proxies';
import { Data } from '@angular/router';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { CategoryCacheService } from '../../shared/category-cache.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { CreateRoomRentalsComponent } from './createroomrentals/createroomrentals.component';
import { EditRoomRentalsComponent } from './editroomrentals/editroomrentals.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { SelectListItemService } from '../../shared/get-select-list-item.service';
import { NzImageModule } from 'ng-zorro-antd/image';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-roomrentals',
  imports: [NzIconModule, NzFormModule, FormsModule, NzSelectModule, NzInputModule, NzGridModule,
    NzDatePickerModule, NzTableModule, NzButtonModule, CommonModule, NzModalModule, NzSliderModule, NzImageModule],
  templateUrl: './roomrentals.component.html',
  styleUrls: ['./roomrentals.component.css'],
  standalone: true,
})
export class RoomrentalsComponent {
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: readonly Data[] = [];
  roomRentals: readonly RoomRentalDto[] = [];
  roomRentalFilterDto: RoomRentalFilterDto = new RoomRentalFilterDto();
  roomRentalRequestDto: RoomRentalFilterDtoPagedRequestDto = new RoomRentalFilterDtoPagedRequestDto();
  setOfCheckedId = new Set<number>();
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  lstUser: SelectListItem[] = [];
  lstRoomTypes: SelectListItem[] = [];
  lstRoomStatuses: SelectListItem[] = [];
  filterPerRows: Array<Array<{
    label: string;
    key: keyof RoomRentalFilterDto;
    type: string;
    options?: () => SelectListItem[];
    placeholder?: string;
  }>> = [];
  controlRequestArray: Array<{
    label: string;
    key: keyof RoomRentalFilterDto;
    type: string;
    options?: () => SelectListItem[];
    placeholder?: string;
  }> = [];
  constructor(private _serviceProxy: ServiceProxy, private _getSelectListItem: SelectListItemService, private modalService: NzModalService, private memoryCache: CategoryCacheService) { }
  onPageChange(page: number): void {
    debugger
    this.pageIndex = page;
    this.roomRentalRequestDto.page = page;
    this.getAllRoomRentals();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.roomRentalRequestDto.pageSize = pageSize;
    this.getAllRoomRentals();
  }
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.roomRentals;
    this.checked = listOfEnabledData.every(({ id }) => id !== undefined && this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => id !== undefined && this.setOfCheckedId.has(id)) && !this.checked;
  }
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onAllChecked(checked: boolean): void {
    this.roomRentals
      .forEach(({ id }) => id !== undefined && this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  trackData(index: number, item: any): any {
    return item.id;  // Hoặc bất kỳ thuộc tính duy nhất nào của item
  }
  ngOnInit(): void {
    const cachedRoomTypes = this.memoryCache.get<SelectListItem[]>('roomType');
    const cachedRoomStatus = this.memoryCache.get<SelectListItem[]>('roomStatus');
    const cachedUsers = this.memoryCache.get<SelectListItem[]>('user');
    const userObservable = cachedUsers ? of(cachedUsers) : this._getSelectListItem.getSelectListItems("user", "");
    const roomTypeObservable = cachedRoomTypes ? of(cachedRoomTypes) : this._getSelectListItem.getEnumSelectListItems("roomType")
    const roomStatusObservable = cachedRoomStatus ? of(cachedRoomStatus) : this._getSelectListItem.getEnumSelectListItems("roomStatus")
    this.roomRentalFilterDto.roomNumber = "";
    this.roomRentalFilterDto.roomType = undefined;
    this.roomRentalFilterDto.priceStart = "";
    this.roomRentalFilterDto.priceEnd = "";
    this.roomRentalFilterDto.statusRoom = undefined;
    this.roomRentalFilterDto.note = "";
    this.roomRentalFilterDto.area = "";
    this.roomRentalFilterDto.creatorUser = "";
    this.roomRentalFilterDto.lastUpdateUser = "";
    this.roomRentalFilterDto.createdDate = new Date();
    this.roomRentalFilterDto.updatedDate = new Date();
    this.roomRentalRequestDto.filter = this.roomRentalFilterDto;
    this.roomRentalRequestDto.page = this.pageIndex;
    this.roomRentalRequestDto.pageSize = this.pageSize;
    this.roomRentalRequestDto.sortBy = "";
    this.roomRentalRequestDto.sortOrder = "";
    this.controlRequestArray = [
      { label: 'Số phòng', key: 'roomNumber', type: 'text', placeholder: 'Nhập số phòng' },
      { label: 'Loại phòng', key: 'roomType', type: 'select', options: () => this.lstRoomTypes, placeholder: 'Chọn loại phòng' },
      { label: 'Trạng thái phòng', key: 'statusRoom', type: 'select', options: () => this.lstRoomStatuses, placeholder: 'Chọn trạng thái phòng' },
      { label: 'Ghi chú', key: 'note', type: 'text', placeholder: 'Nhập ghi chú' },
      { label: 'Người tạo', key: 'creatorUser', type: 'select', options: () => this.lstUser, placeholder: 'Người tạo' },
      { label: 'Ngày tạo', key: 'createdDate', type: 'datetime', placeholder: '' },
      { label: 'Người cập nhật', key: 'lastUpdateUser', type: 'select', options: () => this.lstUser, placeholder: 'Người cập nhật' },
      { label: 'Ngày cập nhật', key: 'updatedDate', type: 'datetime', placeholder: '' },
      { label: 'Diện tích', key: 'area', type: 'slider', placeholder: 'Chọn khoảng: 0 - 20' },
      { label: 'Giá tiền', key: 'priceStart', type: 'slider', placeholder: '' },
    ];
    this.filterPerRows = this.chunkArray(this.controlRequestArray, 4);
    forkJoin([userObservable, roomTypeObservable, roomStatusObservable])
      .subscribe(([users, roomTypes, roomStatus]) => {
        this.lstUser = users ? users : [];
        this.lstRoomTypes = roomTypes ? roomTypes : [];
        this.lstRoomStatuses = roomStatus ? roomStatus : [];
        if (!cachedUsers) this.memoryCache.set('user', users);
        if (!cachedRoomTypes) this.memoryCache.set('roomType', roomTypes);
        if (!roomStatus) this.memoryCache.set('roomStatus', roomStatus);
      },
        error => {
          console.error('Error fetching data:', error);
        }
      );
    this.getAllRoomRentals();
  }
  getAllRoomRentals(): void {
    this.roomRentalFilterDto.roomType = this.roomRentalFilterDto.roomType !== undefined ? Number(this.roomRentalFilterDto.roomType) : 0;
    this.roomRentalFilterDto.statusRoom = this.roomRentalFilterDto.statusRoom !== undefined ? Number(this.roomRentalFilterDto.statusRoom) : 0;
    this.roomRentalRequestDto.filter = this.roomRentalFilterDto;
    this._serviceProxy.getAllRoomRental(this.roomRentalRequestDto).subscribe(response => {
      this.roomRentals = response.listItem ? response.listItem : [];
      this.total = response.totalCount ? response.totalCount : 0;
    }, error => {
      console.error('Error fetching room rentals:', error);
    });
  }
  chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }
  getEnumOptions<T>(enumObj: T): SelectListItem[] {
    return Object.keys(enumObj as object)
      .map(key => {
        const item = new SelectListItem();
        item.value = (enumObj as any)[key];
        item.text = key;
        return item;
      });
  }
  openCreateRoomRentalModal(): void {
    this.modalService.create({
      nzTitle: 'Tạo phòng cho thuê mới',
      nzContent: CreateRoomRentalsComponent,
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
          disabled: (componentInstance) => !componentInstance?.createRoomRentalForm.valid, // Custom disabled
          onClick: (componentInstance) => {
            if (componentInstance) {
              componentInstance.onSubmit(); // Gọi hàm submit trong component con
            }
          },
        },
      ]
    });
  }

  openEditRoomRentalModal(roomrental: RoomRentalDto): void {
    this.modalService.create<EditRoomRentalsComponent, { roomrentalData: any }, string>({
      nzTitle: 'Chỉnh sửa phòng cho thuê',
      nzContent: EditRoomRentalsComponent,
      nzData: { roomrentalData: roomrental },
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

  getRoomTypeText(value: RoomType): string {
    const found = this.lstRoomTypes.find(item => Number(item.value) === Number(value));
    return found ? found.text ?? '' : '';
  }

  getRoomStatusText(value: RoomStatus): string {
    const found = this.lstRoomStatuses.find(item => Number(item.value) === Number(value));
    return found ? found.text ?? '' : '';
  }
}

