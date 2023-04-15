using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class ChiTietHoaDonNhap
{
    public int MaChiTiet { get; set; }

    public int? MaSanPham { get; set; }

    public int? MaHoaDonNhap { get; set; }

    public int? SoLuong { get; set; }

    public double? DonGiaNhap { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual HoaDonNhap? MaHoaDonNhapNavigation { get; set; }

    public virtual SanPham? MaSanPhamNavigation { get; set; }
}
