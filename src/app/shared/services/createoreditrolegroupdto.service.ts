/* Auto-generated from service-proxies.ts */

export class CreateOrEditRoleGroupDto implements ICreateOrEditRoleGroupDto {
    id?: number | undefined;
    name?: string | undefined;
    active?: boolean;
    descriptions?: string | undefined;
    roleIds?: number[] | undefined;

    constructor(data?: ICreateOrEditRoleGroupDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.name = _data["name"];
            this.active = _data["active"];
            this.descriptions = _data["descriptions"];
            if (Array.isArray(_data["roleIds"])) {
                this.roleIds = [] as any;
                for (let item of _data["roleIds"])
                    this.roleIds!.push(item);
            }
        }
    }

    static fromJS(data: any): CreateOrEditRoleGroupDto {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrEditRoleGroupDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["active"] = this.active;
        data["descriptions"] = this.descriptions;
        if (Array.isArray(this.roleIds)) {
            data["roleIds"] = [];
            for (let item of this.roleIds)
                data["roleIds"].push(item);
        }
        return data;
    }
}

export interface ICreateOrEditRoleGroupDto {
    id?: number | undefined;
    name?: string | undefined;
    active?: boolean;
    descriptions?: string | undefined;
    roleIds?: number[] | undefined;
}


