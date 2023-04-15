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
                var result = db.NhaSanXuats.OrderBy(x => x.MaNhaSanXuat).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
    }
}
