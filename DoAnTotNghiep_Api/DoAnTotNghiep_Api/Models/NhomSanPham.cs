using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class NhomSanPham
{
    public int MaNhomSanPham { get; set; }

    public string? TenNhom { get; set; }

    public bool? TrangThai { get; set; }

    public string? AnhNhom { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual ICollection<ChiTietNhom> ChiTietNhoms { get; } = new List<ChiTietNhom>();
}
