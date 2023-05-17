using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Drawing.Printing;
using System.Globalization;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongKesController : ControllerBase
    {
        private ApiTrangSucContext db = new ApiTrangSucContext();

        [Route("get-gia-giam gia")]
        [HttpGet]
        public decimal giamgia()
        {
            decimal TongTienn = 0;
            var query1 = from c in db.SanPhams
                         join s in db.GiaSanPhams on c.MaSanPham equals s.MaSanPham
                         join p in db.GiamGia on c.MaSanPham equals p.MaSanPham
                         //group c by new { MaSanPham = s.MaSanPham, Gia = s.Gia , PhanTram = p.PhanTram} into g
                         select new
                         {
                             MaSanPham = c.MaSanPham,
                             Gia = s.Gia,
                             PhanTram = p.PhanTram,
                             //GiaGiamGia = decimal.Parse(query1.Sum(x => (x.Gia * x.PhanTram)))
                         };
            //var sanpham = query1.SingleOrDefault(x => x.MaSanPham == id);
            TongTienn += decimal.Parse(query1.Sum(s => s.Gia * s.PhanTram / 100).ToString());
            return TongTienn;
        }
        [Route("tong-don-hang-theo-ma")]
        [HttpPost]
        public IActionResult SearchCT([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                decimal TongTienn = 0;
                int? ma_don_hang = null;
                if (formData.Keys.Contains("ma_don_hang") && !string.IsNullOrEmpty(Convert.ToString(formData["ma_don_hang"]))) { ma_don_hang = int.Parse(formData["ma_don_hang"].ToString()); }
                var result = from a in db.DonHangs
                             join b in db.ChiTietDonHangs on a.MaDonHang equals b.MaDonHang
                             join f in db.SanPhams on b.MaSanPham equals f.MaSanPham
                             join g in db.KhachHangs on a.MaKhachHang equals g.MaKhachHang
                             select new
                             {
                                 a.MaDonHang,
                                 a.MaKhachHang,
                                 a.NgayDat,
                                 a.TrangThaiDonHang,
                                 b.MaChiTietDonHang,
                                 b.MaSanPham,
                                 b.SoLuong,
                                 b.GiaMua,
                                 f.TenSanPham,
                                 f.AnhDaiDien,
                                 g.TenKhachHang,
                                 g.DiaChi,
                                 g.SoDienThoai,
                                 g.Email,
                             };
                var result1 = result.Where(s => s.MaDonHang == ma_don_hang || ma_don_hang == null).ToList();
                TongTienn += decimal.Parse(result1.Sum(s => s.SoLuong * s.GiaMua).ToString());
                return Ok(new { TongTienn });
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [Route("get-sp-banchay")]
        [HttpGet]
        public IActionResult banchay()
        {
            var query1 = from c in db.ChiTietDonHangs
                         join s in db.SanPhams on c.MaSanPham equals s.MaSanPham
                         group c by new { MaSanPham = s.MaSanPham, TenSanPham = s.TenSanPham, AnhDaiDien = string.IsNullOrEmpty(s.AnhDaiDien) ? "" : s.AnhDaiDien } into g
                         select new
                         {
                             MaSanPham = g.Key.MaSanPham,
                             TenSanPham = g.Key.TenSanPham,
                             AnhDaiDien = g.Key.AnhDaiDien,
                             Tong = g.Sum(x => (x.SoLuong))
                         };
            var result1 = query1.OrderByDescending(x => x.Tong).ToList();

            return Ok(new
            {
                listbanchay = result1,
            }); 

        }
        [Route("thongketong-DonHang")]
        [HttpGet]
        public IActionResult Getalllll()
        {
            try
            {
                var result = db.DonHangs.Count();
                return Ok(new { result });
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("thongketongauth")]
        [HttpGet]
        public IActionResult Getallauth()
        {
            try
            {
                var result = db.NguoiDungs.Count();
                return Ok(new { result });
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("thongketongssp")]
        [HttpGet]
        public IActionResult Getallssp()
        {
            try
            {
                var result = db.SanPhams.Count();
                return Ok(new { result });
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("thongketong")]
        [HttpGet]
        public IActionResult Getalll()
        {
            try
            {
                decimal TongTienn = 0;
                var result = from a in db.DonHangs
                             join b in db.ChiTietDonHangs on a.MaDonHang equals b.MaDonHang
                             select new
                             {
                                 a.MaDonHang,
                                 a.MaKhachHang,
                                 a.NgayDat,
                                 a.TrangThaiDonHang,
                                 b.MaChiTietDonHang,
                                 b.MaSanPham,
                                 b.SoLuong,
                                 b.GiaMua,
                             };
                TongTienn += decimal.Parse(result.Sum(s => s.SoLuong * s.GiaMua).ToString());
                string formatted = string.Format(CultureInfo.InvariantCulture, "{0:N0}", TongTienn);
                return Ok(new { formatted });
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [Route("thongketong-sanphambanchay")]
        [HttpPost]
        public decimal sanphambanchay()
        {
            decimal TongTienn = 0;
            TongTienn += decimal.Parse(db.ChiTietDonHangs.Sum(s => s.SoLuong).ToString());
            return TongTienn;
        }
    }
    public class Tong
    {
        public int data { get; set; }
    }
}
