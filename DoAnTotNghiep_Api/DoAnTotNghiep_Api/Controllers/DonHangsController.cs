using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Helpers;
using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        [Route("Get-By-Id-donhang/{id}")]
        [HttpGet]
        public IActionResult GetByIddonhang(int id)
        {
            var result1 = from a in db.DonHangs
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
                              g.TenKhachHang,
                              g.DiaChi,
                              g.SoDienThoai,
                              g.Email,
                              a.CreatedAt,
                              a.UpdatedAt,


                          };
            var chitiet = result1.Where(x => x.MaDonHang == id).OrderByDescending(x => x.NgayDat);
            return Ok(new { chitiet });
        }

        [Route("search")]
        [HttpPost]
        public IActionResult Search([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
                int? trangthai = null;
                if (formData.Keys.Contains("trangthai") && !string.IsNullOrEmpty(Convert.ToString(formData["trangthai"]))) { trangthai = int.Parse(formData["trangthai"].ToString()); }              
                var tenkhachhang = formData.Keys.Contains("tenkhachhang") ? (formData["tenkhachhang"]).ToString().Trim() : "";
                var sodienthoai = formData.Keys.Contains("sodienthoai") ? (formData["sodienthoai"]).ToString().Trim() : "";
                var result = from a in db.DonHangs
                             join g in db.KhachHangs on a.MaKhachHang equals g.MaKhachHang
                             select new
                             {
                                 MaDonHang = a.MaDonHang,
                                 MaKhachHang = a.MaKhachHang,
                                 TrangThaiDonHang = a.TrangThaiDonHang,
                                 NgayDat = a.NgayDat,
                                 TenKhachHang = g.TenKhachHang,
                                 DiaChi = g.DiaChi,
                                 SoDienThoai = g.SoDienThoai,
                                 Email = g.Email,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var result1 = result.Where(x => x.TrangThaiDonHang == trangthai || trangthai == null && x.TenKhachHang.Contains(tenkhachhang) && x.SoDienThoai.Contains(sodienthoai)).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.MaDonHang).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.MaDonHang).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderByDescending(x => x.NgayDat).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                }
                return Ok(
                            new ResponseListMessage
                            {
                                page = page,
                                totalItem = total,
                                pageSize = pageSize,
                                data = result2
                            }
                   );

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [Route("search-ct")]
        [HttpPost]
        public IActionResult SearchCT([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                int? ma_don_hang = null;
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
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
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.MaDonHang).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.MaDonHang).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderByDescending(x => x.NgayDat).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                }
                return Ok(
                           new KQCTDH
                           {
                               page = page,
                               totalItem = total,
                               pageSize = pageSize,
                               data = result2
                           }
                         );
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [Route("search-lichsu")]
        [HttpPost]
        public IActionResult SearchCTLS([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                int? ma_nguoi_dung = null;
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
                if (formData.Keys.Contains("ma_nguoi_dung") && !string.IsNullOrEmpty(Convert.ToString(formData["ma_nguoi_dung"]))) { ma_nguoi_dung = int.Parse(formData["ma_nguoi_dung"].ToString()); }
                var result = from a in db.DonHangs
                             join b in db.ChiTietDonHangs on a.MaDonHang equals b.MaDonHang
                             join f in db.SanPhams on b.MaSanPham equals f.MaSanPham
                             join g in db.KhachHangs on a.MaKhachHang equals g.MaKhachHang
                             join t in db.NguoiDungs on g.MaNguoiDung equals t.MaNguoiDung
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
                                 t.MaNguoiDung
                             };
                var result1 = result.Where(s => s.MaNguoiDung == ma_nguoi_dung || ma_nguoi_dung == null).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.TenSanPham).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.TenSanPham).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderByDescending(x => x.NgayDat).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                }
                return Ok(
                            new ResponseListMessage
                            {
                               page = page,
                               totalItem = total,
                               pageSize = pageSize,
                               data = result2
                            }
                        );
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [Route("create-giohang")]
        [HttpPost]
        public IActionResult CreateItem([FromBody] GioHang model)
        {


            model.khach.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.khach.UpdatedAt = DateTime.Now.ToString(DateFormat);
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
        [Route("update-DonHang")]
        [HttpPost]
        public IActionResult UpdateDonHang(DonHang obj)
        {
            obj.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_donhang = db.DonHangs.SingleOrDefault(x => x.MaDonHang == obj.MaDonHang);
            if (obj_donhang.TrangThaiDonHang == 4)
            {
                return BadRequest("TrangThaiDonHang is already 1, cannot update!");
            }
            else
            {
                obj_donhang.TrangThaiDonHang = obj.TrangThaiDonHang;
                obj_donhang.UpdatedAt = obj.UpdatedAt;
                db.SaveChanges();
                return Ok(new { data = "OK" });
            }

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
    public class KQCTDH
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public long totalItem { get; set; }
        public dynamic data { get; set; }
    }
    public class GioHang
    {
        public KhachHang khach { get; set; }
        public List<ChiTietDonHang> donhang { get; set; }
    }
}
            


