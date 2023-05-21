using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class SanPham
{
    public int MaSanPham { get; set; }

    public int? MaDanhMuc { get; set; }

    public string? TenSanPham { get; set; }

    public string? MoTaSanPham { get; set; }

    public string? AnhDaiDien { get; set; }

    public int? MaNhaSanXuat { get; set; }

    public int? MaDonViTinh { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public virtual ICollection<ChiTietAnhSanPham> ChiTietAnhSanPhams { get; } = new List<ChiTietAnhSanPham>();

    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; } = new List<ChiTietDonHang>();

    public virtual ICollection<ChiTietHoaDonNhap> ChiTietHoaDonNhaps { get; } = new List<ChiTietHoaDonNhap>();

    public virtual ICollection<ChiTietNhom> ChiTietNhoms { get; } = new List<ChiTietNhom>();

    public virtual ICollection<GiaSanPham> GiaSanPhams { get; } = new List<GiaSanPham>();

    public virtual ICollection<GiamGium> GiamGia { get; } = new List<GiamGium>();

    public virtual DanhMuc? MaDanhMucNavigation { get; set; }

    public virtual DonViTinh? MaDonViTinhNavigation { get; set; }

    public virtual NhaSanXuat? MaNhaSanXuatNavigation { get; set; }

    public virtual ICollection<ThongSoKyThuat> ThongSoKyThuats { get; } = new List<ThongSoKyThuat>();
}
