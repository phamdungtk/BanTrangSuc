import { Role } from "./role";

export class User {
    maNguoiDung: number;
    taiKhoan: string;
    matKhau: string;
    hoTen: string;
    diaChi: string;
    dienThoai: string;
    email: string;
    loaiQuyen: Role;
    token?: string;
}