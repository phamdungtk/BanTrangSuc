using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonViTinhsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public DonViTinhsController(IUserService userService, IConfiguration configuration)
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
                var result = db.DonViTinhs.OrderBy(x => x.MaDonViTinh).ToList();
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
                var tendvt = formData.Keys.Contains("tendvt") ? (formData["tendvt"]).ToString().Trim() : "";
                var result = db.DonViTinhs.ToList();
                var result1 = result.Where(x => x.TenDonViTinh.Contains(tendvt)).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.TenDonViTinh).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.TenDonViTinh).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderBy(x => x.CreatedAt).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                }
                return Ok(
                            new KQDVT
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
            var result = db.DonViTinhs.ToList();
            var kq = result.SingleOrDefault(x => x.MaDonViTinh == id);
            return Ok(new { kq });
        }

        [Route("create-dvt")]
        [HttpPost]
        public IActionResult Create([FromBody] DonViTinh model)
        {
            model.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.DonViTinhs.Add(model);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("update-dvt")]
        [HttpPost]
        public IActionResult Update([FromBody] DonViTinh model)
        {
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_dvt = db.DonViTinhs.SingleOrDefault(x => x.MaDonViTinh == model.MaDonViTinh);
            obj_dvt.TenDonViTinh = model.TenDonViTinh;
            obj_dvt.UpdatedAt = model.UpdatedAt;
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("delete-dvt/{MaDonViTinh}")]
        [HttpDelete]
        public IActionResult Delete(int? MaDonViTinh)
        {
            var obj1 = db.DonViTinhs.SingleOrDefault(s => s.MaDonViTinh == MaDonViTinh);
            db.DonViTinhs.Remove(obj1);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
    }
    public class KQDVT
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public long totalItem { get; set; }
        public dynamic data { get; set; }
    }
}