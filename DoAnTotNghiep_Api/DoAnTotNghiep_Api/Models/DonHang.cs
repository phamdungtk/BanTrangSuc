using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class DonHang
{
    public int MaDonHang { get; set; }

    public int? MaKhachHang { get; set; }

    public DateTime? NgayDat { get; set; }

    public int? TrangThaiDonHang { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; } = new List<ChiTietDonHang>();

    public virtual KhachHang? MaKhachHangNavigation { get; set; }
}
