using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class NhaCungCap
{
    public int MaNhaCungCap { get; set; }

    public string? TenNhaCungCap { get; set; }

    public string? DiaChi { get; set; }

    public string? SoDienThoai { get; set; }

    public string? Email { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual ICollection<HoaDonNhap> HoaDonNhaps { get; } = new List<HoaDonNhap>();
}
