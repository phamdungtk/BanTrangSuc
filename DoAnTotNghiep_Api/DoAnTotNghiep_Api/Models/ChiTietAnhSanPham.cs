using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class ChiTietAnhSanPham
{
    public int MaAnhChitiet { get; set; }

    public int MaSanPham { get; set; }

    public string? Anh { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual SanPham? MaSanPhamNavigation { get; set; }
}
