import { Component } from '@angular/core';
import { RoomRentalDto, RoomRentalFilterDto, SelectListItem, RoomRentalFilterDtoPagedRequestDto, RoomType, RoomStatus, ServiceProxy } from '../../shared/service.proxies';
import { Data } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
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

@Component({
  selector: 'app-roomrentals',
  imports: [NzIconModule, NzFormModule, FormsModule, NzSelectModule, NzInputModule, NzGridModule, NzDatePickerModule, NzTableModule, NzButtonModule, CommonModule],
  templateUrl: './roomrentals.component.html',
  styleUrl: './roomrentals.component.css'
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
  constructor(private _serviceProxy: ServiceProxy, private modalService: NzModalService, private memoryCache: CategoryCacheService) { }
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
    debugger
    this.lstRoomTypes = this.getEnumOptions(RoomType);
    this.lstRoomStatuses = this.getEnumOptions(RoomStatus);
    this.roomRentalFilterDto.roomNumber = "";
    this.roomRentalFilterDto.roomType = RoomType._1;
    this.roomRentalFilterDto.priceStart = "";
    this.roomRentalFilterDto.priceEnd = "";
    this.roomRentalFilterDto.statusRoom = RoomStatus._1;
    this.roomRentalFilterDto.note = "";
    this.roomRentalFilterDto.area = "";
    this.roomRentalRequestDto.filter = this.roomRentalFilterDto;
    this.roomRentalRequestDto.page = this.pageIndex;
    this.roomRentalRequestDto.pageSize = this.pageSize;
    this.roomRentalRequestDto.sortBy = "";
    this.roomRentalRequestDto.sortOrder = "";
    this.controlRequestArray = [
      { label: 'Số phòng', key: 'roomNumber', type: 'text', placeholder: 'Nhập số phòng' },
      { label: 'Loại phòng', key: 'roomType', type: 'select', options: () => this.lstRoomTypes, placeholder: 'Chọn loại phòng' },
      { label: '', key: 'priceStart', type: 'rangeDouble', placeholder: 'bắt đầu từ 0' },
      { label: '', key: 'priceEnd', type: 'rangeDouble', placeholder: 'kết thúc tại 3' },
      { label: 'Trạng thái phòng', key: 'statusRoom', type: 'select', options: () => this.lstRoomStatuses, placeholder: 'Chọn trạng thái phòng' },
      { label: 'Ghi chú', key: 'note', type: 'text', placeholder: 'Nhập ghi chú' },
      { label: 'Diện tích', key: 'area', type: 'rangeDouble', placeholder: 'Chọn khoảng: 0 - 20' },
    ];
    this.filterPerRows = this.chunkArray(this.controlRequestArray, 4);
    this.getAllRoomRentals();
  }
  getAllRoomRentals(): void {
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
}

