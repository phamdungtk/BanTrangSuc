using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhanHoisController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public PhanHoisController(IUserService userService, IConfiguration configuration)
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
                var result = from a in db.PhanHois
                             join b in db.SanPhams on a.MaSanPham equals b.MaSanPham
                             join f in db.NguoiDungs on a.MaNguoiDung equals f.MaNguoiDung
                             select new
                             {
                                 NoiDung = a.NoiDung,
                                 Sao = a.Sao,
                                 MaPhanHoi = a.MaPhanHoi,
                                 MaSanPham = b.MaSanPham,
                                 MaNguoiDung = f.MaNguoiDung,
                                 NgayPhanHoi = a.NgayPhanHoi,
    

                             };
                var kq = result.OrderByDescending(x => x.NgayPhanHoi).ToList();
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
                int? ma_san_pham = null;
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
                if (formData.Keys.Contains("ma_san_pham") && !string.IsNullOrEmpty(Convert.ToString(formData["ma_san_pham"]))) { ma_san_pham = int.Parse(formData["ma_san_pham"].ToString()); }
                var result = from a in db.PhanHois
                             join b in db.SanPhams on a.MaSanPham equals b.MaSanPham
                             join f in db.NguoiDungs on a.MaNguoiDung equals f.MaNguoiDung
                             select new
                             {
                                 NoiDung = a.NoiDung,
                                 Sao = a.Sao,
                                 MaPhanHoi = a.MaPhanHoi,
                                 MaSanPham = b.MaSanPham,
                                 MaNguoiDung = f.MaNguoiDung,
                                 HoTen = f.HoTen,
                                 NgayPhanHoi = a.NgayPhanHoi,
                             };
                var result1 = result.Where(s => s.MaSanPham == ma_san_pham || ma_san_pham == null).OrderByDescending(x => x.NgayPhanHoi).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.MaPhanHoi).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.MaPhanHoi).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderByDescending(x => x.NgayPhanHoi).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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
        [Route("trb_sao")]
        [HttpPost]
        public IActionResult tbSao([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                decimal Tbsao = 0;
                decimal tongsao = 0;
                int? ma_sanpham = null;
                if (formData.Keys.Contains("ma_sanpham") && !string.IsNullOrEmpty(Convert.ToString(formData["ma_sanpham"]))) { ma_sanpham = int.Parse(formData["ma_sanpham"].ToString()); }
                var result = from a in db.PhanHois
                             join b in db.SanPhams on a.MaSanPham equals b.MaSanPham
                             join f in db.NguoiDungs on a.MaNguoiDung equals f.MaNguoiDung
                             select new
                             {
                                 NoiDung = a.NoiDung,
                                 Sao = a.Sao,
                                 MaPhanHoi = a.MaPhanHoi,
                                 MaSanPham = b.MaSanPham,
                                 MaNguoiDung = f.MaNguoiDung,
                                 HoTen = f.HoTen,
                                 NgayPhanHoi = a.NgayPhanHoi,
                             };
                var result1 = result.Where(s => s.MaSanPham == ma_sanpham || ma_sanpham == null).ToList();
                var result2 = result1.Count();
                tongsao += decimal.Parse(result1.Sum(s => s.Sao).ToString());
                //Tbsao += decimal.Parse(result1.Sum(s => s.Sao).ToString());
                var result3 = (tongsao / result2).ToString("#.#");
                return Ok(new { result3 });


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
            var result = from a in db.PhanHois
                         join b in db.SanPhams on a.MaSanPham equals b.MaSanPham
                         join f in db.NguoiDungs on a.MaNguoiDung equals f.MaNguoiDung
                         select new
                         {
                             NoiDung = a.NoiDung,
                             Sao = a.Sao,
                             MaPhanHoi = a.MaPhanHoi,
                             MaSanPham = b.MaSanPham,
                             MaNguoiDung = f.MaNguoiDung,
                             NgayPhanHoi = a.NgayPhanHoi,


                         };
            var sanpham = result.SingleOrDefault(x => x.MaSanPham == id);
            return Ok(new { sanpham });
        }
       
        [Route("create-phanhoi")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] PhanHoi model)
        {
            model.NgayPhanHoi  = System.DateTime.Now;
            db.PhanHois.Add(model);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("update-phanhoi")]
        [HttpPost]
        public IActionResult UpdateUser([FromBody] PhanHoi model)
        {
            var obj_phanhoi = db.PhanHois.SingleOrDefault(x => x.MaPhanHoi == model.MaPhanHoi);
            obj_phanhoi.NoiDung = model.NoiDung;
            obj_phanhoi.Sao = model.Sao;
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("delete-phanhoi/{MaPhanHoi}")]
        [HttpDelete]
        public IActionResult DeleteUser(int? MaPhanHoi)
        {
            var obj1 = db.PhanHois.SingleOrDefault(s => s.MaPhanHoi == MaPhanHoi);
            db.PhanHois.Remove(obj1);
            db.SaveChanges();

            return Ok(new { data = "OK" });
        }
    }
}
