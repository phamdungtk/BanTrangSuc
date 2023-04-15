using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class NhaSanXuat
{
    public int MaNhaSanXuat { get; set; }

    public string TenNhaSanXuat { get; set; } = null!;

    public string? MoTa { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual ICollection<SanPham> SanPhams { get; } = new List<SanPham>();
}
