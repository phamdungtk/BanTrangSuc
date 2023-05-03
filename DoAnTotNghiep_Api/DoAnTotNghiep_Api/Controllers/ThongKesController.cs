using DoAnTotNghiep_Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongKesController : ControllerBase
    {
        private ApiTrangSucContext db = new ApiTrangSucContext();
        [Route("thongketong-Invoice")]
        [HttpPost]
        public decimal tkInvoice()
        {
            decimal TongTienn = 0;
            TongTienn += decimal.Parse(db.ChiTietDonHangs.Sum(s => s.SoLuong * s.GiaMua).ToString());
            return TongTienn;
        }
    }
}
