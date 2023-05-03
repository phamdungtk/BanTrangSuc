using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonHangsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public DonHangsController(IUserService userService, IConfiguration configuration)
        {
            configuration = configuration;
            _userService = userService;
            DateFormat = configuration["Constants:DateFormat"];
        }
        [Route("Get-All")]
        [HttpGet]
        public IActionResult Getall()
        {
            try
            {
                var result = db.DonHangs.OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("create-giohang")]
        [HttpPost]
        public IActionResult CreateItem([FromBody] GioHang model)
        {
            db.KhachHangs.Add(model.khach);
            db.SaveChanges();

            int MaKhachHang = model.khach.MaKhachHang;
            DonHang dh = new DonHang();
            dh.MaKhachHang = MaKhachHang;
            dh.NgayDat = System.DateTime.Now;
            dh.TrangThaiDonHang = 1;
            db.DonHangs.Add(dh);
            db.SaveChanges();
            int MaDonHang = dh.MaDonHang;

            if (model.donhang.Count > 0)
            {
                foreach (var item in model.donhang)
                {
                    item.MaDonHang = MaDonHang;
                    db.ChiTietDonHangs.Add(item);
                }
                db.SaveChanges();
            }

            return Ok(new { data = "OK" });
        }
        [Route("Get-DonHang-All")]
        [HttpGet]
        public IActionResult getall()
        {
            try
            {
                var result = db.DonHangs.ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("thongketong")]
        [HttpGet]
        public decimal tkInvoice()
        {
            decimal TongTienn = 0;
            TongTienn += decimal.Parse(db.ChiTietDonHangs.Sum(s => s.SoLuong * s.GiaMua).ToString());
            return TongTienn;
        }
        [Route("SoDonHang")]
        [HttpGet]
        public IActionResult getallsodonhang()
        {
            try
            {
                var kq = db.DonHangs.ToList();
                var result = kq.OrderBy(x => x.MaDonHang).ToList();
                var result2 = result.Count();
                return Ok(result2);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("GetDonhang")]
        [HttpGet]
        public IActionResult GetDonhang()
        {
            try
            {
                var result = from d in db.DonHangs
                             join k in db.KhachHangs on d.MaKhachHang equals k.MaKhachHang
                             select new { d.MaDonHang, k.TenKhachHang, d.NgayDat, d.TrangThaiDonHang };
                var kq = result.OrderBy(x => x.NgayDat).ToList();
                return Ok(kq);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }

        }
        [Route("Get-By-Id/{id}")]
        [HttpGet]
        public IActionResult GetById(int id)
        {
            try
            {
                var kq = from r in db.DonHangs
                             //join g in db.SanPhams on r.MaLoaiSanPham equals g.MaLoaiSanPham
                         select new { r.MaDonHang, r.TrangThaiDonHang, r.NgayDat };
                var result = kq.SingleOrDefault(x => x.MaDonHang == id);
                //var result = kq.Select(x => new { x.MaLoaiSanPham,x.MaLoaiSanPhamCha, x.TenLoaiSanPham, x.Stt, x.TrangThai}).Where(s => s.MaLoaiSanPham == id).FirstOrDefault();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }

        [Route("update-DonHang")]
        [HttpPost]
        public IActionResult UpdateDonHang(DonHang obj)
        {
            var obj_donhang = db.DonHangs.SingleOrDefault(x => x.MaDonHang == obj.MaDonHang);
            obj_donhang.TrangThaiDonHang = obj.TrangThaiDonHang;
            //....
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("delete-DonHang/{MaDonHang}")]
        [HttpDelete]
        public IActionResult Deletedonhang(int? MaDonHang)
        {
            var obj = db.DonHangs.SingleOrDefault(s => s.MaDonHang == MaDonHang);
            db.DonHangs.Remove(obj);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }

    }
    public class GioHang
    {
        public KhachHang khach { get; set; }
        public List<ChiTietDonHang> donhang { get; set; }
    }
}
            


