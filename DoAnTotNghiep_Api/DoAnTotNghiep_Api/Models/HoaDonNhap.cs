using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class HoaDonNhap
{
    public int MaHoaDonNhap { get; set; }

    public string SoHoaDon { get; set; } = null!;

    public DateTime? NgayNhap { get; set; }

    public int MaNguoiDung { get; set; }

    public int MaNhaCungCap { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual ICollection<ChiTietHoaDonNhap> ChiTietHoaDonNhaps { get; } = new List<ChiTietHoaDonNhap>();

    public virtual NguoiDung? MaNguoiDungNavigation { get; set; } = null!;

    public virtual NhaCungCap? MaNhaCungCapNavigation { get; set; } = null!;
}
