using DoAnTotNghiep_Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        //[Route("get-by-id/{id}")]
        //[HttpGet]
        //public IActionResult GetById(int? id)
        //{
        //    var result = from a in db.SanPhams                   
        //                 join f in db.GiaSanPhams on a.MaSanPham equals f.MaSanPham
        //                 join g in db.GiamGia on a.MaSanPham equals g.MaSanPham
        //                 select new
        //                 {
        //                     MaSanPham = a.MaSanPham,
        //                     TenSanPham = a.TenSanPham,
        //                     Gia = f.Gia,
        //                     PhanTram = g.PhanTram,                            
        //                     MoTaSanPham = a.MoTaSanPham,
        //                     AnhDaiDien = a.AnhDaiDien,
        //                     CreatedAt = a.CreatedAt,
        //                     UpdatedAt = a.UpdatedAt,

        //                 };
        //    var sanpham = result.SingleOrDefault(x => x.MaSanPham == id);
        //    var tong = sanpham.Sum
        //    return Ok(new { sanpham });
        //}
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
        [HttpPost]
        public decimal tkInvoice()
        {
            decimal TongTienn = 0;
            TongTienn += decimal.Parse(db.ChiTietDonHangs.Sum(s => s.SoLuong * s.GiaMua).ToString());
            return TongTienn;
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
}
