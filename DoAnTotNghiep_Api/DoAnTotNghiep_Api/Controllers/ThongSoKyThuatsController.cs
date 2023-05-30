using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongSoKyThuatsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public ThongSoKyThuatsController(IUserService userService, IConfiguration configuration)
        {
            configuration = configuration;
            _userService = userService;
            DateFormat = configuration["Constants:DateFormat"];

        }
        [Route("Get-All")]
        [HttpGet]
        public IActionResult Getalllll()
        {
            try
            {
                var result = db.ThongSoKyThuats.OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("get-by-id/{id}")]
        [HttpGet]
        public IActionResult GetByIdnhom(int? id)
        {
            var result = from r in db.ThongSoKyThuats                   
                         select new
                         {

                             r.MaThongSo,
                             r.MaSanPham,
                             r.TenThongSo,
                             r.MoTa,
                             r.CreatedAt,
                             r.UpdatedAt
                         };
            var thongso = result.Where(x => x.MaSanPham == id).OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(thongso);
        }
        [Route("get-by-id-tskt/{id}")]
        [HttpGet]
        public IActionResult GetById(int? id)
        {
            var result = db.ThongSoKyThuats.OrderByDescending(x => x.CreatedAt).ToList();
            var kq = result.SingleOrDefault(x => x.MaThongSo == id);
            return Ok(new { kq });
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
                var result = from r in db.ThongSoKyThuats
                             select new
                             {
                                 r.MaThongSo,
                                 r.MaSanPham,
                                 r.TenThongSo,
                                 r.MoTa,
                                 r.CreatedAt,
                                 r.UpdatedAt
                             };
                var result1 = result.Where(s => s.MaSanPham == ma_san_pham || ma_san_pham == null).OrderByDescending(x => x.CreatedAt).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.MaThongSo).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.MaThongSo).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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

        [Route("search-sp")]
        [HttpPost]
        public IActionResult SearchSP([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                int? ma_san_pham = null;
                if (formData.Keys.Contains("ma_san_pham") && !string.IsNullOrEmpty(Convert.ToString(formData["ma_san_pham"]))) { ma_san_pham = int.Parse(formData["ma_san_pham"].ToString()); }
                var result = from r in db.SanPhams
                             select new
                             {
                                 r.MaSanPham,
                                 r.TenSanPham,
                                 r.CreatedAt,
                                 r.UpdatedAt
                             };
                var result1 = result.Where(s => s.MaSanPham == ma_san_pham || ma_san_pham == null).OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(new { result1 });
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [Route("search-ts")]
        [HttpPost]
        public IActionResult Searchts([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                int? ma_san_pham = null;
                if (formData.Keys.Contains("ma_san_pham") && !string.IsNullOrEmpty(Convert.ToString(formData["ma_san_pham"]))) { ma_san_pham = int.Parse(formData["ma_san_pham"].ToString()); }
                var result = from r in db.ThongSoKyThuats
                             select new
                             {
                                 r.MaThongSo,
                                 r.MaSanPham,
                                 r.TenThongSo,
                                 r.MoTa,
                                 r.CreatedAt,
                                 r.UpdatedAt
                             };
                var result1 = result.Where(s => s.MaSanPham == ma_san_pham || ma_san_pham == null).OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(new { result1 });
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [Route("create-tskt")]
        [HttpPost]
        public IActionResult Create([FromBody] ThongSoKyThuat model)
        {
            model.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.ThongSoKyThuats.Add(model);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("update-tskt")]
        [HttpPost]
        public IActionResult Update([FromBody] ThongSoKyThuat model)
        {
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_tskt = db.ThongSoKyThuats.SingleOrDefault(x => x.MaThongSo == model.MaThongSo);
            obj_tskt.MaSanPham = model.MaSanPham;
            obj_tskt.TenThongSo = model.TenThongSo;
            obj_tskt.MoTa = model.MoTa;
            obj_tskt.UpdatedAt = model.UpdatedAt;
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }

        [Route("delete-tskt/{MaThongSo}")]
        [HttpDelete]
        public IActionResult Delete(int? MaThongSo)
        {
            var obj1 = db.ThongSoKyThuats.SingleOrDefault(s => s.MaThongSo == MaThongSo);
            db.ThongSoKyThuats.Remove(obj1);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
    }
}

