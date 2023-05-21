using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class GiamGium
{
    public int MaGiamGia { get; set; }

    public int? MaSanPham { get; set; }

    public int? PhanTram { get; set; }

    public bool? TrangThai { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual SanPham? MaSanPhamNavigation { get; set; }
}
