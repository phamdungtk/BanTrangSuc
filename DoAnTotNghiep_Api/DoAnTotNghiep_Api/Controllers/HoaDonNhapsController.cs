using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoaDonNhapsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public HoaDonNhapsController(IUserService userService, IConfiguration configuration)
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
                var result = from a in db.HoaDonNhaps
                             join b in db.ChiTietHoaDonNhaps on a.MaHoaDonNhap equals b.MaHoaDonNhap
                             join c in db.SanPhams on b.MaSanPham equals c.MaSanPham
                             join d in db.NguoiDungs on a.MaNguoiDung equals d.MaNguoiDung
                             join e in db.NhaCungCaps on a.MaNhaCungCap equals e.MaNhaCungCap
                             select new
                             {
                                 MaHoaDonNhap = a.MaHoaDonNhap,
                                 SoHoaDon = a.SoHoaDon,
                                 NgayNhap = a.NgayNhap,
                                 SoLuong = b.SoLuong,
                                 DonGiaNhap = b.DonGiaNhap,
                                 MaNguoiDung = d.MaNguoiDung,
                                 MaNhaCungCap = e.MaNhaCungCap,
                                 MaSanPham = c.MaSanPham,
                                 TenSanPham = c.TenSanPham,
                                 HoTen = d.HoTen,
                                 TenNhaCungCap = e.TenNhaCungCap,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var kq = result.ToList();
                return Ok(kq);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
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
                var sohoadon = formData.Keys.Contains("sohoadon") ? (formData["sohoadon"]).ToString().Trim() : "";
                var nguoidung = formData.Keys.Contains("nguoidung") ? (formData["nguoidung"]).ToString().Trim() : "";
                var nhacungcap = formData.Keys.Contains("nhacungcap") ? (formData["nhacungcap"]).ToString().Trim() : "";
                var sanpham = formData.Keys.Contains("sanpham") ? (formData["sanpham"]).ToString().Trim() : "";
               
                var result = from a in db.HoaDonNhaps
                             join b in db.ChiTietHoaDonNhaps on a.MaHoaDonNhap equals b.MaHoaDonNhap
                             join c in db.SanPhams on b.MaSanPham equals c.MaSanPham
                             join d in db.NguoiDungs on a.MaNguoiDung equals d.MaNguoiDung
                             join e in db.NhaCungCaps on a.MaNhaCungCap equals e.MaNhaCungCap
                             select new
                             {
                                 MaHoaDonNhap = a.MaHoaDonNhap,
                                 SoHoaDon = a.SoHoaDon,
                                 NgayNhap = a.NgayNhap,
                                 SoLuong = b.SoLuong,
                                 DonGiaNhap = b.DonGiaNhap,
                                 MaNguoiDung = d.MaNguoiDung,
                                 MaNhaCungCap = e.MaNhaCungCap,
                                 MaSanPham = c.MaSanPham,
                                 TenSanPham = c.TenSanPham,
                                 HoTen = d.HoTen,
                                 TenNhaCungCap = e.TenNhaCungCap,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,
                             };
                var result1 = result.Where(x => x.SoHoaDon.Contains(sohoadon) && x.HoTen.Contains(nguoidung)&& x.TenSanPham.Contains(sanpham) && x.TenNhaCungCap.Contains(nhacungcap)).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.SoHoaDon).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.SoHoaDon).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderBy(x => x.CreatedAt).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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
        
        [Route("get-by-id/{id}")]
        [HttpGet]
        public IActionResult GetById(int? id)
        {
            var result = from a in db.HoaDonNhaps
                         join b in db.ChiTietHoaDonNhaps on a.MaHoaDonNhap equals b.MaHoaDonNhap
                         join c in db.SanPhams on b.MaSanPham equals c.MaSanPham
                         join d in db.NguoiDungs on a.MaNguoiDung equals d.MaNguoiDung
                         join e in db.NhaCungCaps on a.MaNhaCungCap equals e.MaNhaCungCap
                         select new
                         {
                             MaHoaDonNhap = a.MaHoaDonNhap,
                             SoHoaDon = a.SoHoaDon,
                             NgayNhap = a.NgayNhap,
                             SoLuong = b.SoLuong,
                             DonGiaNhap = b.DonGiaNhap,
                             MaNguoiDung = d.MaNguoiDung,
                             MaNhaCungCap = e.MaNhaCungCap,
                             MaSanPham = c.MaSanPham,
                             TenSanPham = c.TenSanPham,
                             HoTen = d.HoTen,
                             TenNhaCungCap = e.TenNhaCungCap,
                             CreatedAt = a.CreatedAt,
                             UpdatedAt = a.UpdatedAt,

                         };
            var hoadonnhap = result.SingleOrDefault(x => x.MaHoaDonNhap == id);
            return Ok(new { hoadonnhap });
        }

        [Route("create-hoadonnhap")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] HoaDonNhapModel model)
        {
            model.hoadonnhap.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.hoadonnhap.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.HoaDonNhaps.Add(model.hoadonnhap);
            db.SaveChanges();

            int MaHoaDonNhap = model.hoadonnhap.MaHoaDonNhap;

            model.chitiethoadonnhap.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.chitiethoadonnhap.UpdatedAt = DateTime.Now.ToString(DateFormat);
            model.chitiethoadonnhap.MaHoaDonNhap = MaHoaDonNhap;
            db.ChiTietHoaDonNhaps.Add(model.chitiethoadonnhap);
            db.SaveChanges();

            return Ok(new { data = "OK" });
        }
        [Route("update-hoadonnhap")]
        [HttpPost]
        public IActionResult UpdateUser([FromBody] HoaDonNhapModel model)
        {
            model.hoadonnhap.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_hoadonnhap = db.HoaDonNhaps.SingleOrDefault(x => x.MaHoaDonNhap == model.hoadonnhap.MaHoaDonNhap);
            obj_hoadonnhap.MaHoaDonNhap = model.hoadonnhap.MaHoaDonNhap;
            obj_hoadonnhap.SoHoaDon = model.hoadonnhap.SoHoaDon;
            obj_hoadonnhap.MaNguoiDung = model.hoadonnhap.MaNguoiDung;
            obj_hoadonnhap.MaNhaCungCap = model.hoadonnhap.MaNhaCungCap;
            obj_hoadonnhap.UpdatedAt = model.hoadonnhap.UpdatedAt;
            db.SaveChanges();

            model.chitiethoadonnhap.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_cthoadonnhap = db.ChiTietHoaDonNhaps.SingleOrDefault(x => x.MaHoaDonNhap == model.chitiethoadonnhap.MaHoaDonNhap);
            obj_cthoadonnhap.MaHoaDonNhap = model.chitiethoadonnhap.MaHoaDonNhap;
            obj_cthoadonnhap.MaSanPham = model.chitiethoadonnhap.MaSanPham;
            obj_cthoadonnhap.SoLuong = model.chitiethoadonnhap.SoLuong;
            obj_cthoadonnhap.DonGiaNhap = model.chitiethoadonnhap.DonGiaNhap;
            obj_cthoadonnhap.UpdatedAt = model.chitiethoadonnhap.UpdatedAt;
            db.SaveChanges();
     
            return Ok(new { data = "OK" });
        }

        [Route("delete-hoadonnhap/{MaHoaDonNhap}")]
        [HttpDelete]
        public IActionResult DeleteUser(int? MaHoaDonNhap)
        {
            var obj1 = db.HoaDonNhaps.SingleOrDefault(s => s.MaHoaDonNhap == MaHoaDonNhap);
            db.HoaDonNhaps.Remove(obj1);
            db.SaveChanges();
            //var obj2 = db.ChiTietHoaDonNhaps.SingleOrDefault(s => s.MaHoaDonNhap == MaHoaDonNhap);
            //db.ChiTietHoaDonNhaps.Remove(obj2);
            //db.SaveChanges();
            return Ok(new { data = "OK" });
        }
    }
}

