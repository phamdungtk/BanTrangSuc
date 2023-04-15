using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class GiaSanPham
{
    public int MaGiaSanPham { get; set; }

    public int MaSanPham { get; set; }

    public double? Gia { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual SanPham? MaSanPhamNavigation { get; set; } = null!;
}
