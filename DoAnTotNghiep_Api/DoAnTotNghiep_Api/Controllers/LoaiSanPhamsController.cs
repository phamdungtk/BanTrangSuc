using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoaiSanPhamsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public LoaiSanPhamsController(IUserService userService, IConfiguration configuration)
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
                var result = db.DanhMucs.OrderBy(x => x.MaDanhMuc).OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("get-loai-sanpham")]
        [HttpGet]
        public IEnumerable<DanhMucModel> GetAllMenu()
        {
            return GetData();
        }

        [NonAction]
        private List<DanhMucModel> GetData()
        {
            var allItemGroups = db.DanhMucs.Where(x => x.TrangThai == true).Select(x => new DanhMucModel { MaDanhMuc = x.MaDanhMuc, MaDanhMucCha = x.MaDanhMucCha, TenDanhMuc = x.TenDanhMuc }).ToList();
            var lstParent = allItemGroups.Where(ds => ds.MaDanhMucCha == null).ToList();
            foreach (var item in lstParent)
            {
                item.children = GetHiearchyList(allItemGroups, item);
            }
            return lstParent;
        }
        [NonAction]
        private List<DanhMucModel> GetHiearchyList(List<DanhMucModel> lstAll, DanhMucModel node)
        {
            var lstChilds = lstAll.Where(ds => ds.MaDanhMucCha == node.MaDanhMuc).ToList();
            if (lstChilds.Count == 0)
                return null;
            for (int i = 0; i < lstChilds.Count; i++)
            {
                var childs = GetHiearchyList(lstAll, lstChilds[i]);
                lstChilds[i].type = (childs == null || childs.Count == 0) ? "leaf" : "";
                lstChilds[i].children = childs;
            }
            return lstChilds.ToList();
        }
        [Route("search")]
        [HttpPost]
        public IActionResult Search([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                int? ma_danh_muc = null;
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
                if (formData.Keys.Contains("ma_danh_muc") && !string.IsNullOrEmpty(Convert.ToString(formData["ma_danh_muc"]))) { ma_danh_muc = int.Parse(formData["ma_danh_muc"].ToString()); }
                var result = from r in db.SanPhams
                             join g in db.GiaSanPhams on r.MaSanPham equals g.MaSanPham
                             select new { r.MaSanPham, r.TenSanPham, r.AnhDaiDien, g.Gia, r.MaDanhMuc ,r.CreatedAt,r.UpdatedAt };
                var result1 = result.Where(s => s.MaDanhMuc == ma_danh_muc || ma_danh_muc == null).OrderByDescending(x => x.CreatedAt).ToList();
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
                           new KQDM
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
                var tendanhmuc = formData.Keys.Contains("tendanhmuc") ? (formData["tendanhmuc"]).ToString().Trim() : "";
                var result = db.DanhMucs.ToList();
                var result1 = result.Where(x => x.TenDanhMuc.Contains(tendanhmuc)).ToList();
                long total = result1.Count();
                dynamic result2 = null;
                switch (loc)
                {
                    case "TD":
                        result2 = result1.OrderBy(x => x.TenDanhMuc).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    case "GD":
                        result2 = result1.OrderByDescending(x => x.TenDanhMuc).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                    default:
                        result2 = result1.OrderBy(x => x.CreatedAt).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
                        break;
                }
                return Ok(
                            new KQDMADMIN
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
            var result = db.DanhMucs.ToList();
            var kq = result.SingleOrDefault(x => x.MaDanhMuc == id);
            return Ok(new { kq });
        }

        [Route("create-loai")]
        [HttpPost]
        public IActionResult Create([FromBody] DanhMuc model)
        {
            model.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.DanhMucs.Add(model);
            db.SaveChanges();
            return Ok(new { data = "OK" });
        }
        [Route("update-loai")]
        [HttpPost]
        public IActionResult Update([FromBody] DanhMuc model)
        {
            model.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_loaisanpham = db.DanhMucs.SingleOrDefault(x => x.MaDanhMuc == model.MaDanhMuc);
            obj_loaisanpham.MaDanhMucCha = model.MaDanhMucCha;
            obj_loaisanpham.TenDanhMuc = model.TenDanhMuc;
            obj_loaisanpham.UpdatedAt = model.UpdatedAt;
            db.SaveChanges();

           
            return Ok(new { data = "OK" });
        }

        [Route("delete-loai/{MaDanhMuc}")]
        [HttpDelete]
        public IActionResult Delete(int? MaDanhMuc)
        {
            var obj1 = db.DanhMucs.SingleOrDefault(s => s.MaDanhMuc == MaDanhMuc);
            db.DanhMucs.Remove(obj1);
            db.SaveChanges();         
            return Ok(new { data = "OK" });
        }
    }
    public class DanhMucModel
    {
        public int MaDanhMuc { get; set; }
        public int? MaDanhMucCha { get; set; }
        public string TenDanhMuc { get; set; }
        public List<DanhMucModel> children { get; set; }
        public string type { get; set; }
    }
    public class KQDM
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public long totalItem { get; set; }
        public dynamic data { get; set; }
    }
    public class KQDMADMIN
    {
        public int page { get; set; }
        public int pageSize { get; set; }
        public long totalItem { get; set; }
        public dynamic data { get; set; }
    }
}