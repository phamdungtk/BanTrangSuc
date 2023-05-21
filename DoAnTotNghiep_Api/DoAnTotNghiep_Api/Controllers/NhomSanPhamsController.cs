using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhomSanPhamsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public NhomSanPhamsController(IUserService userService, IConfiguration configuration)
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
                var result = db.NhomSanPhams.OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("searchnhom")]
        [HttpPost]
        public IActionResult Searchnhom([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                int? ma_nhom_sp = null;
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
                if (formData.Keys.Contains("ma_nhom_sp") && !string.IsNullOrEmpty(Convert.ToString(formData["ma_nhom_sp"]))) { ma_nhom_sp = int.Parse(formData["ma_nhom_sp"].ToString()); }
                var result = from r in db.NhomSanPhams
                             join g in db.ChiTietNhoms on r.MaNhomSanPham equals g.MaNhomSanPham
                             join a in db.SanPhams on g.MaSanPham equals a.MaSanPham
                             join s in db.GiaSanPhams on a.MaSanPham equals s.MaSanPham
                             join t in db.GiamGia on a.MaSanPham equals t.MaSanPham
                             select new
                             {
                                 r.MaNhomSanPham,
                                 r.TenNhom,
                                 g.MaSanPham,
                                 a.TenSanPham,
                                 a.AnhDaiDien,
                                 s.Gia,
                                 t.PhanTram,
                                 r.CreatedAt,
                                 r.UpdatedAt
                             };
                var result1 = result.Where(s => s.MaNhomSanPham == ma_nhom_sp || ma_nhom_sp == null).OrderByDescending(x => x.CreatedAt).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.Gia).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.Gia).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderByDescending(x => x.CreatedAt).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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
                var tennhom = formData.Keys.Contains("tennhom") ? (formData["tennhom"]).ToString().Trim() : "";
                var result = from a in db.NhomSanPhams
                             select new
                             {
                                 MaNhomSanPham = a.MaNhomSanPham,
                                 TenNhom = a.TenNhom,
                                 AnhNhom = a.AnhNhom,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var result1 = result.Where(x => x.TenNhom.Contains(tennhom)).OrderByDescending(x => x.CreatedAt).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.TenNhom).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.TenNhom).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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
            var result = from a in db.NhomSanPhams
                         select new
                         {
                             MaNhomSanPham = a.MaNhomSanPham,
                             TenNhom = a.TenNhom,
                             AnhNhom = a.AnhNhom,
                             CreatedAt = a.CreatedAt,
                             UpdatedAt = a.UpdatedAt,

                         };
            var nhomsanpham = result.SingleOrDefault(x => x.MaNhomSanPham == id);
            return Ok(new { nhomsanpham });
        }

        [Route("create-nhomsanpham")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] NhomSanPham model)
        {
            model.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.NhomSanPhams.Add(model);
            db.SaveChanges();

            return Ok(new { data = "OK" });
        }
        [Route("update-nhomsanpham")]
        [HttpPost]
        public IActionResult UpdateUser([FromBody] NhomSanPham model)
        {
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_nhomsanpham = db.NhomSanPhams.SingleOrDefault(x => x.MaNhomSanPham == model.MaNhomSanPham);
            obj_nhomsanpham.TenNhom = model.TenNhom;
            obj_nhomsanpham.AnhNhom = model.AnhNhom;
            obj_nhomsanpham.UpdatedAt = model.UpdatedAt;
            db.SaveChanges();


            return Ok(new { data = "OK" });
        }

        [Route("delete-nhomsanpham/{MaNhomSanPham}")]
        [HttpDelete]
        public IActionResult DeleteUser(int? MaNhomSanPham)
        {
            var obj1 = db.NhomSanPhams.SingleOrDefault(s => s.MaNhomSanPham == MaNhomSanPham);
            db.NhomSanPhams.Remove(obj1);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
    }
}


