using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhaCungCapsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public NhaCungCapsController(IUserService userService, IConfiguration configuration)
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
                var result = db.NhaCungCaps.OrderBy(x => x.MaNhaCungCap).OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("search-admin")]
        [HttpPost]
        public IActionResult SearchAdmin([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
                var tenncc = formData.Keys.Contains("tenncc") ? (formData["tenncc"]).ToString().Trim() : "";
                var result = db.NhaCungCaps.ToList();
                var result1 = result.Where(x => x.TenNhaCungCap.Contains(tenncc)).OrderByDescending(x => x.CreatedAt).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.TenNhaCungCap).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.TenNhaCungCap).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderBy(x => x.CreatedAt).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                }
                return Ok(
                            new KQNCC
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
            var result = db.NhaCungCaps.ToList();
            var kq = result.SingleOrDefault(x => x.MaNhaCungCap == id);
            return Ok(new { kq });
        }

        [Route("create-ncc")]
        [HttpPost]
        public IActionResult Create([FromBody] NhaCungCap model)
        {
            model.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.NhaCungCaps.Add(model);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("update-ncc")]
        [HttpPost]
        public IActionResult Update([FromBody] NhaCungCap model)
        {
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_ncc = db.NhaCungCaps.SingleOrDefault(x => x.MaNhaCungCap == model.MaNhaCungCap);
            obj_ncc.TenNhaCungCap = model.TenNhaCungCap;
            obj_ncc.DiaChi = model.DiaChi;
            obj_ncc.SoDienThoai = model.SoDienThoai;
            obj_ncc.Email = model.Email;
            obj_ncc.UpdatedAt = model.UpdatedAt;
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("delete-ncc/{MaDonViTinh}")]
        [HttpDelete]
        public IActionResult Delete(int? MaNhaCungCap)
        {
            var obj1 = db.NhaCungCaps.SingleOrDefault(s => s.MaNhaCungCap == MaNhaCungCap);
            db.NhaCungCaps.Remove(obj1);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
    }
    public class KQNCC
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public long totalItem { get; set; }
        public dynamic data { get; set; }
    }
}

