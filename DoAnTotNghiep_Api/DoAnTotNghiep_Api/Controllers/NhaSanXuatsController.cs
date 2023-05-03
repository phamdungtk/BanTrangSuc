using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhaSanXuatsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public NhaSanXuatsController(IUserService userService, IConfiguration configuration)
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
                var result = db.NhaSanXuats.OrderBy(x => x.MaNhaSanXuat).OrderByDescending(x => x.CreatedAt).ToList();
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
                var tennxs = formData.Keys.Contains("tennxs") ? (formData["tennxs"]).ToString().Trim() : "";
                var result = db.NhaSanXuats.ToList();
                var result1 = result.Where(x => x.TenNhaSanXuat.Contains(tennxs)).OrderByDescending(x => x.CreatedAt).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.TenNhaSanXuat).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.TenNhaSanXuat).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderBy(x => x.CreatedAt).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                }
                return Ok(
                            new KQNSX
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
            var result = db.NhaSanXuats.ToList();
            var kq = result.SingleOrDefault(x => x.MaNhaSanXuat == id);
            return Ok(new { kq });
        }

        [Route("create-nsx")]
        [HttpPost]
        public IActionResult Create([FromBody] NhaSanXuat model)
        {
            model.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.NhaSanXuats.Add(model);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("update-nsx")]
        [HttpPost]
        public IActionResult Update([FromBody] NhaSanXuat model)
        {
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_nsx = db.NhaSanXuats.SingleOrDefault(x => x.MaNhaSanXuat == model.MaNhaSanXuat);
            obj_nsx.TenNhaSanXuat = model.TenNhaSanXuat;
            obj_nsx.MoTa = model.MoTa;
            obj_nsx.UpdatedAt = model.UpdatedAt;
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }

        [Route("delete-nsx/{MaNhaSanXuat}")]
        [HttpDelete]
        public IActionResult Delete(int? MaNhaSanXuat)
        {
            var obj1 = db.NhaSanXuats.SingleOrDefault(s => s.MaNhaSanXuat == MaNhaSanXuat);
            db.NhaSanXuats.Remove(obj1);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
    }

    public class KQNSX
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public long totalItem { get; set; }
        public dynamic data { get; set; }
    }

}