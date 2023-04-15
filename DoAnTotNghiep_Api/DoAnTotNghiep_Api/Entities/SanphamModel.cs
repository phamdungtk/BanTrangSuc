using DoAnTotNghiep_Api.Models;

namespace DoAnTotNghiep_Api.Entities
{
    public class SanphamModel
    {
            public SanPham? sanpham { get; set; }
            //public ChiTietAnhSanPham? chitietanhsanpham { get; set; }
            //public ChiTietHoaDonNhap? chitiethoadonnhap { get; set; }
            public DanhMuc? danhmuc { get; set; }
            //public ChiTietNhom? chitietnhom { get; set; }
            public GiaSanPham? giasapham { get; set; }
            public GiamGium? giamgia { get; set; }
            public ThongSoKyThuat? thongsokythuat { get; set; }
            public NhaSanXuat? nhasanxuat { get; set; }
            public DonViTinh? donvitinh { get; set; }
    }
}
