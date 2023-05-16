using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SqlServer.Server;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChiTietNhomsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public ChiTietNhomsController(IUserService userService, IConfiguration configuration)
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
                var result = from a in db.ChiTietNhoms
                             join b in db.SanPhams on a.MaSanPham equals b.MaSanPham
                             select new
                             {
                                 MaNhomSanPham = a.MaNhomSanPham,
                                 MaChiTietNhom = a.MaChiTietNhom,
                                 MaSanPham = b.MaSanPham,
                                 TenSanPham =  b.TenSanPham,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var kq = result.OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(kq);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        //[Route("search")]
        //[HttpPost]
        //public IActionResult Search([FromBody] Dictionary<string, object> formData)
        //{
        //    try
        //    {
        //        var page = int.Parse(formData["page"].ToString());
        //        var pageSize = int.Parse(formData["pageSize"].ToString());
        //        string loc = "";
        //        if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
        //        var tennhom = formData.Keys.Contains("tennhom") ? (formData["tennhom"]).ToString().Trim() : "";
        //        var tensanpham = formData.Keys.Contains("tensanpham") ? (formData["tensanpham"]).ToString().Trim() : "";
        //        var result = from a in db.ChiTietNhoms
        //                     join b in db.SanPhams on a.MaSanPham equals b.MaSanPham
        //                     select new
        //                     {
        //                         MaNhomSanPham = a.MaNhomSanPham,
        //                         MaChiTietNhom = a.MaChiTietNhom,
        //                         MaSanPham = b.MaSanPham,
        //                         TenSanPham = b.TenSanPham,
        //                         CreatedAt = a.CreatedAt,
        //                         UpdatedAt = a.UpdatedAt,

        //                     };
        //        var result1 = result.Where(x => x.TenSanPham.Contains(tensanpham)).OrderByDescending(x => x.CreatedAt).ToList();
        //        long total = result1.Count();
        //        dynamic result2 = null;
        //        switch (loc)
        //        {
        //            case "TD":
        //                result2 = result1.OrderBy(x => x.TenSanPham).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
        //                break;
        //            case "GD":
        //                result2 = result1.OrderByDescending(x => x.TenSanPham).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
        //                break;
        //            default:
        //                result2 = result1.OrderBy(x => x.CreatedAt).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
        //                break;
        //        }
        //        return Ok(
        //                    new ResponseListMessage
        //                    {
        //                        page = page,
        //                        totalItem = total,
        //                        pageSize = pageSize,
        //                        data = result2
        //                    }
        //           );

        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message);
        //    }
        //}

        [Route("get-by-id/{id}")]
        [HttpGet]
        public IActionResult GetById(int? id)
        {
            var result = db.ChiTietNhoms.OrderByDescending(x => x.CreatedAt).ToList();
            var kq = result.SingleOrDefault(x => x.MaChiTietNhom == id);
            return Ok(new { kq });
        }


        [Route("get-by-id-nhom/{id}")]
        [HttpGet]
        public IActionResult GetByIdnhom(int? id)
        {
            var result = from a in db.ChiTietNhoms
                         join b in db.SanPhams on a.MaSanPham equals b.MaSanPham
                         join c in db.NhomSanPhams on a.MaNhomSanPham equals c.MaNhomSanPham
                         select new
                         {
                             MaNhomSanPham = c.MaNhomSanPham,
                             MaChiTietNhom = a.MaChiTietNhom,
                             MaSanPham = b.MaSanPham,
                             TenSanPham = b.TenSanPham,
                             TenNhom = c.TenNhom,
                             AnhNhom = c.AnhNhom,
                             CreatedAt = a.CreatedAt,
                             UpdatedAt = a.UpdatedAt,
                         };
            var chitietnhom = result.Where(x => x.MaNhomSanPham == id).OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(chitietnhom);
        }
        [Route("search")]
        [HttpPost]
        public IActionResult Search([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                int? ma_nhom = null;
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
                if (formData.Keys.Contains("ma_nhom") && !string.IsNullOrEmpty(Convert.ToString(formData["ma_nhom"]))) { ma_nhom = int.Parse(formData["ma_nhom"].ToString()); }
                var result = from a in db.ChiTietNhoms
                             join b in db.SanPhams on a.MaSanPham equals b.MaSanPham
                             join c in db.NhomSanPhams on a.MaNhomSanPham equals c.MaNhomSanPham
                             select new
                             {
                                 MaNhomSanPham = c.MaNhomSanPham,
                                 MaChiTietNhom = a.MaChiTietNhom,
                                 MaSanPham = b.MaSanPham,
                                 TenSanPham = b.TenSanPham,
                                 AnhDaiDien = b.AnhDaiDien,
                                 TenNhom = c.TenNhom,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,
                             };
                var result1 = result.Where(s => s.MaNhomSanPham == ma_nhom || ma_nhom == null).OrderByDescending(x => x.CreatedAt).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.MaChiTietNhom).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.MaChiTietNhom).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderByDescending(x => x.CreatedAt).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                }
                return Ok(
                           new KQCTN
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

        [Route("search-nsp")]
        [HttpPost]
        public IActionResult SearchNSP([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                int? ma_nhom = null;
                if (formData.Keys.Contains("ma_nhom") && !string.IsNullOrEmpty(Convert.ToString(formData["ma_nhom"]))) { ma_nhom = int.Parse(formData["ma_nhom"].ToString()); }
                var result = from r in db.NhomSanPhams
                             select new
                             {
                                 r.MaNhomSanPham,
                                 r.TenNhom,
                             };
                var result1 = result.Where(s => s.MaNhomSanPham == ma_nhom || ma_nhom == null).ToList();
                return Ok(new { result1 });
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [Route("create-chitietnhom")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] ChiTietNhom model)
        {
            model.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.ChiTietNhoms.Add(model);
            db.SaveChanges();

            return Ok(new { data = "OK" });
        }
        [Route("update-chitietnhom")]
        [HttpPost]
        public IActionResult UpdateUser([FromBody] ChiTietNhom model)
        {
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_chitietnhom = db.ChiTietNhoms.SingleOrDefault(x => x.MaChiTietNhom == model.MaChiTietNhom);
            obj_chitietnhom.MaSanPham = model.MaSanPham;
            obj_chitietnhom.UpdatedAt = model.UpdatedAt;
            db.SaveChanges();


            return Ok(new { data = "OK" });
        }

        [Route("delete-chitietnhom/{MaChiTietNhom}")]
        [HttpDelete]
        public IActionResult DeleteUser(int? MaChiTietNhom)
        {
            var obj1 = db.ChiTietNhoms.SingleOrDefault(s => s.MaChiTietNhom == MaChiTietNhom);
            db.ChiTietNhoms.Remove(obj1);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
    }
    public class KQCTN
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public long totalItem { get; set; }
        public dynamic data { get; set; }
    }
    public class KQCTNSP
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public long totalItem { get; set; }
        public dynamic data { get; set; }
    }
}


