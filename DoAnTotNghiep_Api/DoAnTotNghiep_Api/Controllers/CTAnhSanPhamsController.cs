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
}