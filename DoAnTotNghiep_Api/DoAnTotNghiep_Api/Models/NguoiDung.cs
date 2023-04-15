using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class NguoiDung
{
    public int MaNguoiDung { get; set; }

    public string? HoTen { get; set; }

    public DateTime? NgaySinh { get; set; }

    public string? GioiTinh { get; set; }

    public string? AnhDaiDien { get; set; }

    public string? DiaChi { get; set; }

    public string? Email { get; set; }

    public string? DienThoai { get; set; }

    public bool? TrangThai { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual ICollection<HoaDonNhap> HoaDonNhaps { get; } = new List<HoaDonNhap>();

    public virtual ICollection<TaiKhoan> TaiKhoans { get; } = new List<TaiKhoan>();
}
