using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TinTucsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public TinTucsController(IUserService userService, IConfiguration configuration)
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
                var result = from a in db.TinTucs
                             join b in db.NguoiDungs on a.MaNguoiDung equals b.MaNguoiDung
                           
                             select new
                             {
                                 TieuDe = a.TieuDe,
                                 NoiDung = a.NoiDung,
                                 AnhTinTuc = a.AnhTinTuc,
                                 MaTinTuc = a.MaTinTuc,
                                 HoTen = b.HoTen,
                                 MaNguoiDung = b.MaNguoiDung,
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
        [Route("all-tt")]
        [HttpPost]
        public IActionResult Searchttall([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
                var result = from a in db.TinTucs
                             join b in db.NguoiDungs on a.MaNguoiDung equals b.MaNguoiDung

                             select new
                             {
                                 TieuDe = a.TieuDe,
                                 NoiDung = a.NoiDung,
                                 AnhTinTuc = a.AnhTinTuc,
                                 MaTinTuc = a.MaTinTuc,
                                 HoTen = b.HoTen,
                                 MaNguoiDung = b.MaNguoiDung,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var result1 = result.ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.TieuDe).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.TieuDe).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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
                var tieu_de = formData.Keys.Contains("tieu_de") ? (formData["tieu_de"]).ToString().Trim() : "";
                var result = from a in db.TinTucs
                             join b in db.NguoiDungs on a.MaNguoiDung equals b.MaNguoiDung
                             select new
                             {
                                 TieuDe = a.TieuDe,
                                 NoiDung = a.NoiDung,
                                 AnhTinTuc = a.AnhTinTuc,
                                 MaTinTuc = a.MaTinTuc,
                                 HoTen = b.HoTen,
                                 MaNguoiDung = b.MaNguoiDung,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var result1 = result.Where(x => x.TieuDe.Contains(tieu_de)).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.TieuDe).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.TieuDe).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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
       
        [Route("get-by-id/{id}")]
        [HttpGet]
        public IActionResult GetById(int? id)
        {
            var result = from a in db.TinTucs
                         join b in db.NguoiDungs on a.MaNguoiDung equals b.MaNguoiDung
                         select new
                         {
                             TieuDe = a.TieuDe,
                             NoiDung = a.NoiDung,
                             AnhTinTuc = a.AnhTinTuc,
                             MaTinTuc = a.MaTinTuc,
                             HoTen = b.HoTen,
                             MaNguoiDung = b.MaNguoiDung,
                             CreatedAt = a.CreatedAt,
                             UpdatedAt = a.UpdatedAt,

                         };
            var tintuc = result.SingleOrDefault(x => x.MaTinTuc == id);
            return Ok(new { tintuc });
        }
      
        [Route("create-tintuc")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] TinTuc model)
        {
            model.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.Add(model);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("update-tintuc")]
        [HttpPost]
        public IActionResult UpdateUser([FromBody] TinTuc model)
        {
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_tintuc = db.TinTucs.SingleOrDefault(x => x.MaTinTuc == model.MaTinTuc);
            obj_tintuc.MaTinTuc = model.MaTinTuc;
            obj_tintuc.MaNguoiDung = model.MaNguoiDung;
            obj_tintuc.TieuDe = model.TieuDe;
            obj_tintuc.NoiDung = model.NoiDung;
            obj_tintuc.AnhTinTuc = model.AnhTinTuc;
            obj_tintuc.UpdatedAt = model.UpdatedAt;
            db.SaveChanges();

            return Ok(new { data = "OK" });
        }

        [Route("delete-tintuc/{MaTinTuc}")]
        [HttpDelete]
        public IActionResult DeleteUser(int? MaTinTuc)
        {
            var obj1 = db.TinTucs.SingleOrDefault(s => s.MaTinTuc == MaTinTuc);
            db.TinTucs.Remove(obj1);
            db.SaveChanges();           
            return Ok(new { data = "OK" });
        }
    }
}


