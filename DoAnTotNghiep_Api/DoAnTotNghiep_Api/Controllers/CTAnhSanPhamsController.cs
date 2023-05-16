using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CTAnhSanPhamsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public CTAnhSanPhamsController(IUserService userService, IConfiguration configuration)
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
                var result = db.ChiTietAnhSanPhams.OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
       
        [Route("get-by-id/{id}")]
        [HttpGet]
        public IActionResult GetById(int? id)
        {
            try
            {
                var result = db.ChiTietAnhSanPhams.Where(x => x.MaSanPham == id).OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(result);

            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }

        [Route("get-by-id-anh/{id}")]
        [HttpGet]
        public IActionResult GetByIdAnh(int? id)
        {
            var result = db.ChiTietAnhSanPhams.OrderByDescending(x => x.CreatedAt).ToList();
            var kq = result.SingleOrDefault(x => x.MaAnhChitiet == id);
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
                var result = from r in db.ChiTietAnhSanPhams 
                             select new
                             {
                                 r.MaAnhChitiet,
                                 r.MaSanPham,
                                 r.Anh,
                                 r.CreatedAt,
                                 r.UpdatedAt
                             };
                var result1 = result.Where(s => s.MaSanPham == ma_san_pham || ma_san_pham == null).OrderByDescending(x => x.CreatedAt).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.MaAnhChitiet).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.MaAnhChitiet).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderByDescending(x => x.CreatedAt).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                }
                return Ok(
                           new KQCTA
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
        [Route("create-ctanhsp")]
        [HttpPost]
        public IActionResult Create([FromBody] ChiTietAnhSanPham model)
        {
            model.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.ChiTietAnhSanPhams.Add(model);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("update-ctanhsp")]
        [HttpPost]
        public IActionResult Update([FromBody] ChiTietAnhSanPham model)
        {
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_ctanhsp = db.ChiTietAnhSanPhams.SingleOrDefault(x => x.MaAnhChitiet == model.MaAnhChitiet);
            obj_ctanhsp.Anh = model.Anh;
            obj_ctanhsp.UpdatedAt = model.UpdatedAt;
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }

        [Route("delete-ctanhsp/{MaAnhChitiet}")]
        [HttpDelete]
        public IActionResult Delete(int? MaAnhChitiet)
        {
            var obj1 = db.ChiTietAnhSanPhams.SingleOrDefault(s => s.MaAnhChitiet == MaAnhChitiet);
            db.ChiTietAnhSanPhams.Remove(obj1);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
    }
    public class KQCTA
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public long totalItem { get; set; }
        public dynamic data { get; set; }
    }
}