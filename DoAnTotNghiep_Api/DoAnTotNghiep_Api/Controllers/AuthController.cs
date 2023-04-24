using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public AuthController(IUserService userService, IConfiguration configuration)
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
                var result = from t in db.NguoiDungs
                             join n in db.TaiKhoans on t.MaNguoiDung equals n.MaNguoiDung                         
                             select new
                             {
                                 HoTen = t.HoTen,
                                 NgaySinh = t.NgaySinh,
                                 GioiTinh = t.GioiTinh,
                                 AnhDaiDien = t.AnhDaiDien,
                                 DiaChi = t.DiaChi,
                                 Email = t.Email,
                                 DienThoai = t.DienThoai,
                                 TrangThai = t.TrangThai,
                                 LoaiQuyen = n.LoaiQuyen,
                                 CreatedAt = n.CreatedAt,
                                 UpdatedAt = n.UpdatedAt,
                             };
                var kq = result.ToList();
                return Ok(kq);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("get-admin")]
        [HttpGet]
        public IActionResult GetIdadmin()
        {
            try
            {
                var result = from t in db.NguoiDungs
                             join n in db.TaiKhoans on t.MaNguoiDung equals n.MaNguoiDung
                             select new
                             {
                                 MaTaiKhoan = n.MaTaiKhoan,
                                 MaNguoiDung = t.MaNguoiDung,
                                 HoTen = t.HoTen,
                                 NgaySinh = t.NgaySinh,
                                 GioiTinh = t.GioiTinh,
                                 AnhDaiDien = t.AnhDaiDien,
                                 DiaChi = t.DiaChi,
                                 Email = t.Email,
                                 DienThoai = t.DienThoai,
                                 TrangThai = t.TrangThai,
                                 LoaiQuyen = n.LoaiQuyen,
                                 CreatedAt = n.CreatedAt,
                                 UpdatedAt = n.UpdatedAt,
                             };
                var kq = result.OrderBy(x => x.MaTaiKhoan).Where(x => x.LoaiQuyen == "Admin").ToList();      
                return Ok(kq);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
           
        }
        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthenticateModel model)
        {
            var user = _userService.Authenticate(model.Username, model.Password);

            if (user == null)
                return BadRequest(new { message = "Tài khoản hoặc mật khẩu sai!" });

            return Ok(user);
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
                var hoten = formData.Keys.Contains("hoten") ? (formData["hoten"]).ToString().Trim() : "";
                var taikhoan = formData.Keys.Contains("taikhoan") ? (formData["taikhoan"]).ToString().Trim() : "";
                var loaiquyen = formData.Keys.Contains("loaiquyen") ? (formData["loaiquyen"]).ToString().Trim() : "";
                var result = from n in db.TaiKhoans
                             join t in db.NguoiDungs on n.MaNguoiDung equals t.MaNguoiDung
                             select new
                             {
                                 HoTen = t.HoTen,
                                 NgaySinh = t.NgaySinh,
                                 GioiTinh = t.GioiTinh,
                                 AnhDaiDien = t.AnhDaiDien,
                                 DiaChi = t.DiaChi,
                                 Email = t.Email,
                                 DienThoai = t.DienThoai,
                                 TaiKhoan1 = n.TaiKhoan1,
                                 TrangThai = t.TrangThai,
                                 LoaiQuyen = n.LoaiQuyen,
                                 CreatedAt = n.CreatedAt,
                                 UpdatedAt = n.UpdatedAt,
                                 MaNguoiDung = n.MaNguoiDung };
                var result1 = result.Where(x => x.HoTen.Contains(hoten) && x.TaiKhoan1.Contains(taikhoan) && x.LoaiQuyen.Contains(loaiquyen)).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.HoTen).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.HoTen).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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
            var result = from n in db.TaiKhoans
                         join t in db.NguoiDungs on n.MaNguoiDung equals t.MaNguoiDung
                         select new {
                             HoTen = t.HoTen,
                             NgaySinh = t.NgaySinh,
                             GioiTinh = t.GioiTinh,
                             AnhDaiDien = t.AnhDaiDien,
                             DiaChi = t.DiaChi,
                             Email = t.Email,
                             DienThoai = t.DienThoai,
                             TrangThai = t.TrangThai,
                             TaiKhoan1 = n.TaiKhoan1,
                             MatKhau = n.MatKhau,
                             LoaiQuyen = n.LoaiQuyen,
                             CreatedAt = n.CreatedAt,
                             UpdatedAt = n.UpdatedAt,
                             MaNguoiDung = n.MaNguoiDung
                         };
            var user = result.SingleOrDefault(x => x.MaNguoiDung == id);
            return Ok(new { user });
        }

        [Route("create-auth")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] UserModel model)
        {
            model.nguoidung.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.nguoidung.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.NguoiDungs.Add(model.nguoidung);
            db.SaveChanges();
            int MaNguoiDung = model.nguoidung.MaNguoiDung;
            model.taikhoan.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.taikhoan.UpdatedAt = DateTime.Now.ToString(DateFormat);
            model.taikhoan.MaNguoiDung = MaNguoiDung;
            db.TaiKhoans.Add(model.taikhoan);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }


        [Route("update-auth")]
        [HttpPost]
        public IActionResult UpdateUser([FromBody] UserModel model)
        {
            model.nguoidung.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_nguoidung = db.NguoiDungs.SingleOrDefault(x => x.MaNguoiDung == model.nguoidung.MaNguoiDung);
            obj_nguoidung.HoTen = model.nguoidung.HoTen;
            obj_nguoidung.DiaChi = model.nguoidung.DiaChi;
            obj_nguoidung.NgaySinh = model.nguoidung.NgaySinh;
            obj_nguoidung.GioiTinh = model.nguoidung.GioiTinh;
            obj_nguoidung.AnhDaiDien = model.nguoidung.AnhDaiDien;
            obj_nguoidung.DiaChi = model.nguoidung.DiaChi;
            obj_nguoidung.Email = model.nguoidung.Email;
            obj_nguoidung.DienThoai = model.nguoidung.DienThoai;
            obj_nguoidung.UpdatedAt = model.nguoidung.UpdatedAt;
            db.SaveChanges();
            model.taikhoan.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_taikhoan = db.TaiKhoans.SingleOrDefault(x => x.MaNguoiDung == model.taikhoan.MaNguoiDung);
            obj_taikhoan.TaiKhoan1 = model.taikhoan.TaiKhoan1;
            obj_taikhoan.MatKhau = model.taikhoan.MatKhau;
            obj_taikhoan.LoaiQuyen = model.taikhoan.LoaiQuyen;
            obj_taikhoan.UpdatedAt = model.taikhoan.UpdatedAt;

            db.SaveChanges();
            return Ok(new { data = "OK" });
        }

        [Route("delete-auth/{MaNguoiDung}")]
        [HttpDelete]
        public IActionResult DeleteUser(int? MaNguoiDung)
        {
            var obj1 = db.TaiKhoans.SingleOrDefault(s => s.MaNguoiDung == MaNguoiDung);
            db.TaiKhoans.Remove(obj1);
            db.SaveChanges();
            var obj2 = db.NguoiDungs.SingleOrDefault(s => s.MaNguoiDung == MaNguoiDung);
            db.NguoiDungs.Remove(obj2);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
    }
}
