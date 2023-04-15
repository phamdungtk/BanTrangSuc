using DoAnTotNghiep_Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoaiSanPhamsController : ControllerBase
    {
        private ApiTrangSucContext db = new ApiTrangSucContext();
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
                var result1 = result.Where(s => s.MaDanhMuc == ma_danh_muc || ma_danh_muc == null).ToList();
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
}