using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class KhachHang
{
    public int MaKhachHang { get; set; }

    public string TenKhachHang { get; set; } = null!;

    public string? DiaChi { get; set; }

    public string? SoDienThoai { get; set; }

    public string? Email { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public int? MaNguoiDung { get; set; }

    public virtual ICollection<DonHang> DonHangs { get; } = new List<DonHang>();

    public virtual NguoiDung? MaNguoiDungNavigation { get; set; }
}
