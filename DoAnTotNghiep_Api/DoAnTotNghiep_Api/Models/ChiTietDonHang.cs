using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class ChiTietDonHang
{
    public int MaChiTietDonHang { get; set; }

    public int MaDonHang { get; set; }

    public int MaSanPham { get; set; }

    public int? SoLuong { get; set; }

    public double? GiaMua { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual DonHang? MaDonHangNavigation { get; set; } = null!;

    public virtual SanPham? MaSanPhamNavigation { get; set; } = null!;
}
