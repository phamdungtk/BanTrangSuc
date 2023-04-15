using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class TaiKhoan
{
    public int MaTaiKhoan { get; set; }

    public int? MaNguoiDung { get; set; }

    public string? TaiKhoan1 { get; set; }

    public string? MatKhau { get; set; }

    public bool? TrangThai { get; set; }

    public string? LoaiQuyen { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual NguoiDung? MaNguoiDungNavigation { get; set; }
}
