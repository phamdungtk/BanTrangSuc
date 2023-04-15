using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class DonViTinh
{
    public int MaDonViTinh { get; set; }

    public string? TenDonViTinh { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual ICollection<SanPham> SanPhams { get; } = new List<SanPham>();
}
