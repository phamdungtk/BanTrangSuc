using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class PhanHoi
{
    public int MaPhanHoi { get; set; }

    public int? MaSanPham { get; set; }

    public int? MaNguoiDung { get; set; }

    public string? NoiDung { get; set; }

    public int? Sao { get; set; }

    public DateTime? NgayPhanHoi { get; set; }

    public virtual NguoiDung? MaNguoiDungNavigation { get; set; }
}
