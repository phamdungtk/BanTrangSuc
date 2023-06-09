﻿using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Models;
using DoAnTotNghiep_Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace DoAnTotNghiep_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamsController : ControllerBase
    {
        private IUserService _userService;
        private readonly IConfiguration configuration;
        private readonly string DateFormat;
        private ApiTrangSucContext db = new ApiTrangSucContext();
        public SanPhamsController(IUserService userService, IConfiguration configuration)
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
                var result = from a in db.SanPhams
                             join b in db.DanhMucs on a.MaDanhMuc equals b.MaDanhMuc
                             join f in db.GiaSanPhams on a.MaSanPham equals f.MaSanPham
                             join g in db.GiamGia on a.MaSanPham equals g.MaSanPham
                             //join h in db.ThongSoKyThuats on a.MaSanPham equals h.MaSanPham
                             join t in db.NhaSanXuats on a.MaNhaSanXuat equals t.MaNhaSanXuat
                             join s in db.DonViTinhs on a.MaDonViTinh equals s.MaDonViTinh
                             select new
                             {
                                 TenSanPham = a.TenSanPham,
                                 TenDanhMuc = b.TenDanhMuc,
                                 MaSanPham = a.MaSanPham,
                                 Gia = f.Gia,
                                 PhanTram = g.PhanTram,
                                 ThoiGianBatDau = g.ThoiGianBatDau,
                                 ThoiGianKetThuc = g.ThoiGianKetThuc,
                                 //TenThongSo = h.TenThongSo,
                                 //Mota = h.MoTa,
                                 TenNhaSanXuat = t.TenNhaSanXuat,
                                 MotaNSX = t.MoTa,
                                 TenDonViTinh = s.TenDonViTinh,
                                 MoTaSanPham = a.MoTaSanPham,
                                 AnhDaiDien = a.AnhDaiDien,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var kq = result.OrderByDescending(x => x.MaSanPham).ToList();

                return Ok(kq);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("Get-All-Donggia")]
        [HttpGet]
        public IActionResult Getalldonggia()
        {
            try
            {
                var result = from a in db.SanPhams
                             join b in db.DanhMucs on a.MaDanhMuc equals b.MaDanhMuc
                             join f in db.GiaSanPhams on a.MaSanPham equals f.MaSanPham
                             join g in db.GiamGia on a.MaSanPham equals g.MaSanPham
                             //join h in db.ThongSoKyThuats on a.MaSanPham equals h.MaSanPham
                             join t in db.NhaSanXuats on a.MaNhaSanXuat equals t.MaNhaSanXuat
                             join s in db.DonViTinhs on a.MaDonViTinh equals s.MaDonViTinh
                             select new
                             {
                                 TenSanPham = a.TenSanPham,
                                 TenDanhMuc = b.TenDanhMuc,
                                 MaSanPham = a.MaSanPham,
                                 Gia = f.Gia,
                                 PhanTram = g.PhanTram,
                                 ThoiGianBatDau = g.ThoiGianBatDau,
                                 ThoiGianKetThuc = g.ThoiGianKetThuc,
                                 //TenThongSo = h.TenThongSo,
                                 //Mota = h.MoTa,
                                 TenNhaSanXuat = t.TenNhaSanXuat,
                                 MotaNSX = t.MoTa,
                                 TenDonViTinh = s.TenDonViTinh,
                                 MoTaSanPham = a.MoTaSanPham,
                                 AnhDaiDien = a.AnhDaiDien,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var kq = result.Where(x => x.Gia == 200000).ToList();
                return Ok(kq);
            }
            catch (Exception ex)
            {
                return Ok("Err");
            }
        }
        [Route("all-sp")]
        [HttpPost]
        public IActionResult Searchspall([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
                var result = from a in db.SanPhams
                             join b in db.DanhMucs on a.MaDanhMuc equals b.MaDanhMuc
                             join f in db.GiaSanPhams on a.MaSanPham equals f.MaSanPham
                             join g in db.GiamGia on a.MaSanPham equals g.MaSanPham
                             //join h in db.ThongSoKyThuats on a.MaSanPham equals h.MaSanPham
                             join t in db.NhaSanXuats on a.MaNhaSanXuat equals t.MaNhaSanXuat
                             join s in db.DonViTinhs on a.MaDonViTinh equals s.MaDonViTinh
                             select new
                             {
                                 MaSanPham = a.MaSanPham,
                                 TenSanPham = a.TenSanPham,
                                 TenDanhMuc = b.TenDanhMuc,
                                 Gia = f.Gia,
                                 PhanTram = g.PhanTram,
                                 ThoiGianBatDau = g.ThoiGianBatDau,
                                 ThoiGianKetThuc = g.ThoiGianKetThuc,
                                 //TenThongSo = h.TenThongSo,
                                 //Mota = h.MoTa,
                                 TenNhaSanXuat = t.TenNhaSanXuat,
                                 MotaNSX = t.MoTa,
                                 TenDonViTinh = s.TenDonViTinh,
                                 MoTaSanPham = a.MoTaSanPham,
                                 AnhDaiDien = a.AnhDaiDien,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var result1 = result.ToList();
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
                        result2 = result1.OrderByDescending(x => x.MaSanPham).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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
                var tensanpham = formData.Keys.Contains("tensanpham") ? (formData["tensanpham"]).ToString().Trim() : "";
                var tendanhmuc = formData.Keys.Contains("tendanhmuc") ? (formData["tendanhmuc"]).ToString().Trim() : "";
                var tennhasanxuat = formData.Keys.Contains("tennhasanxuat") ? (formData["tennhasanxuat"]).ToString().Trim() : "";
                var result = from a in db.SanPhams
                             join b in db.DanhMucs on a.MaDanhMuc equals b.MaDanhMuc
                             //join c in db.ChiTietAnhSanPhams on a.MaSanPham equals c.MaSanPham
                             //join d in db.ChiTietHoaDonNhaps on a.MaSanPham equals d.MaSanPham
                             //join e in db.ChiTietNhoms on a.MaSanPham equals e.MaSanPham
                             join f in db.GiaSanPhams on a.MaSanPham equals f.MaSanPham
                             join g in db.GiamGia on a.MaSanPham equals g.MaSanPham
                             //join h in db.ThongSoKyThuats on a.MaSanPham equals h.MaSanPham
                             join t in db.NhaSanXuats on a.MaNhaSanXuat equals t.MaNhaSanXuat
                             join s in db.DonViTinhs on a.MaDonViTinh equals s.MaDonViTinh
                             select new
                             {
                                 MaSanPham = a.MaSanPham,
                                 TenSanPham = a.TenSanPham,
                                 TenDanhMuc = b.TenDanhMuc,
                                 //Anh = c.Anh,
                                 //SoLuong = d.SoLuong,
                                 //DonGiaNhap = d.DonGiaNhap,
                                 //MaNhomSanPham = e.MaNhomSanPham,
                                 Gia = f.Gia,
                                 PhanTram = g.PhanTram,
                                 ThoiGianBatDau = g.ThoiGianBatDau,
                                 ThoiGianKetThuc = g.ThoiGianKetThuc,
                                 //TenThongSo = h.TenThongSo,
                                 //Mota = h.MoTa,
                                 TenNhaSanXuat = t.TenNhaSanXuat,
                                 MotaNSX = t.MoTa,
                                 TenDonViTinh = s.TenDonViTinh,
                                 MoTaSanPham = a.MoTaSanPham,
                                 AnhDaiDien = a.AnhDaiDien,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var result1 = result.Where(x => x.TenSanPham.Contains(tensanpham) && x.TenDanhMuc.Contains(tendanhmuc) && x.TenNhaSanXuat.Contains(tennhasanxuat)).ToList();
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
                        result2 = result1.OrderByDescending(x => x.MaSanPham).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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
        [Route("timkiem")]
        [HttpPost]
        public IActionResult Searchtq([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                string loc = "";
                if (formData.Keys.Contains("loc") && !string.IsNullOrEmpty(Convert.ToString(formData["loc"]))) { loc = formData["loc"].ToString(); }
                var tensanpham = formData.Keys.Contains("tensanpham") ? (formData["tensanpham"]).ToString().Trim() : "";
                var tendanhmuc = formData.Keys.Contains("tendanhmuc") ? (formData["tendanhmuc"]).ToString().Trim() : ""; 
                var result = from a in db.SanPhams
                             join b in db.DanhMucs on a.MaDanhMuc equals b.MaDanhMuc
                             join f in db.GiaSanPhams on a.MaSanPham equals f.MaSanPham
                             join g in db.GiamGia on a.MaSanPham equals g.MaSanPham
                             //join h in db.ThongSoKyThuats on a.MaSanPham equals h.MaSanPham
                             join t in db.NhaSanXuats on a.MaNhaSanXuat equals t.MaNhaSanXuat
                             join s in db.DonViTinhs on a.MaDonViTinh equals s.MaDonViTinh
                             select new
                             {
                                 MaSanPham = a.MaSanPham,
                                 TenSanPham = a.TenSanPham,
                                 TenDanhMuc = b.TenDanhMuc,
                                 Gia = f.Gia,
                                 PhanTram = g.PhanTram,
                                 ThoiGianBatDau = g.ThoiGianBatDau,
                                 ThoiGianKetThuc = g.ThoiGianKetThuc,
                                 //TenThongSo = h.TenThongSo,
                                 //Mota = h.MoTa,
                                 TenNhaSanXuat = t.TenNhaSanXuat,
                                 MotaNSX = t.MoTa,
                                 TenDonViTinh = s.TenDonViTinh,
                                 MoTaSanPham = a.MoTaSanPham,
                                 AnhDaiDien = a.AnhDaiDien,
                                 CreatedAt = a.CreatedAt,
                                 UpdatedAt = a.UpdatedAt,

                             };
                var result1 = result.Where(x => x.TenSanPham.Contains(tensanpham) && x.TenDanhMuc.Contains(tendanhmuc)).ToList();
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
                        result2 = result1.OrderByDescending(x => x.MaSanPham).Skip(pageSize * (page - 1)).Take(pageSize).ToList();
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
            var result = from a in db.SanPhams
                         join b in db.DanhMucs on a.MaDanhMuc equals b.MaDanhMuc
                         //join c in db.ChiTietAnhSanPhams on a.MaSanPham equals c.MaSanPham
                         //join d in db.ChiTietHoaDonNhaps on a.MaSanPham equals d.MaSanPham
                         //join e in db.ChiTietNhoms on a.MaSanPham equals e.MaSanPham
                         join f in db.GiaSanPhams on a.MaSanPham equals f.MaSanPham
                         join g in db.GiamGia on a.MaSanPham equals g.MaSanPham
                         //join h in db.ThongSoKyThuats on a.MaSanPham equals h.MaSanPham
                         join t in db.NhaSanXuats on a.MaNhaSanXuat equals t.MaNhaSanXuat
                         join s in db.DonViTinhs on a.MaDonViTinh equals s.MaDonViTinh
                         select new
                         {
                             MaSanPham = a.MaSanPham,
                             TenSanPham = a.TenSanPham,
                             TenDanhMuc = b.TenDanhMuc,
                             MaDanhMuc = b.MaDanhMuc,
                             //Anh = c.Anh,
                             //SoLuong = d.SoLuong,
                             //DonGiaNhap = d.DonGiaNhap,
                             //MaNhomSanPham = e.MaNhomSanPham,
                             Gia = f.Gia,
                             PhanTram = g.PhanTram,
                             ThoiGianBatDau = g.ThoiGianBatDau,
                             ThoiGianKetThuc = g.ThoiGianKetThuc,
                             //TenThongSo = h.TenThongSo,
                             //Mota = h.MoTa,
                             TenNhaSanXuat = t.TenNhaSanXuat,
                             MaNhaSanXuat = t.MaNhaSanXuat,
                             MotaNSX = t.MoTa,
                             TenDonViTinh = s.TenDonViTinh,
                             MaDonViTinh = s.MaDonViTinh,
                             MoTaSanPham = a.MoTaSanPham,
                             AnhDaiDien = a.AnhDaiDien,
                             CreatedAt = a.CreatedAt,
                             UpdatedAt = a.UpdatedAt,

                         };
            var sanpham = result.SingleOrDefault(x => x.MaSanPham == id);
            return Ok(new { sanpham });
        }
        [HttpGet("{maSanPham}")]
        public ActionResult<bool> CheckIsExpired(int maSanPham)
        {
            var sanPham = db.GiamGia.FirstOrDefault(sp => sp.MaSanPham == maSanPham);
            if (sanPham == null)
            {
                return false;
            }
            DateTime thoiGianBatDau;
            DateTime thoiGianKetThuc;
            bool isDateStart = DateTime.TryParse(sanPham.ThoiGianBatDau.ToString(), CultureInfo.InvariantCulture, DateTimeStyles.None, out thoiGianBatDau);
            bool isDateEnd = DateTime.TryParse(sanPham.ThoiGianKetThuc.ToString(), CultureInfo.InvariantCulture, DateTimeStyles.None, out thoiGianKetThuc);
            if (!isDateStart || !isDateEnd)
            {
                return false;
            }
            var start = thoiGianBatDau.ToUniversalTime().Ticks;
            var end = thoiGianKetThuc.ToUniversalTime().Ticks;
            var now = DateTime.UtcNow.Ticks;
            if (start <= now && now <= end)
            {
                return true;
            }
            else
            {
                //return false;
                var giamGia =  db.GiamGia.SingleOrDefault(sp => sp.MaSanPham == maSanPham);
                if (giamGia != null)
                {
                    giamGia.PhanTram = 0;
                     db.SaveChangesAsync();
                }
                return false;
            }
        }






        [Route("get-tuongtu/{id}")]
        [HttpGet]
        public IActionResult GetProducRelatedtById(int id)
        {
            var result = from a in db.SanPhams                     
                         join f in db.GiaSanPhams on a.MaSanPham equals f.MaSanPham
                         join g in db.GiamGia on a.MaSanPham equals g.MaSanPham
                         select new
                         {
                             MaSanPham = a.MaSanPham,
                             MaDanhMuc = a.MaDanhMuc,
                             TenSanPham = a.TenSanPham,                          
                             Gia = f.Gia,
                             PhanTram = g.PhanTram,
                             ThoiGianBatDau = g.ThoiGianBatDau,
                             ThoiGianKetThuc = g.ThoiGianKetThuc,
                             AnhDaiDien = a.AnhDaiDien,
                             CreatedAt = a.CreatedAt,
                             UpdatedAt = a.UpdatedAt,
                         };
            var result1 = result.Where(x => x.MaSanPham == id).FirstOrDefault();
            var result2 = result.Where(x => x.MaDanhMuc == result1.MaDanhMuc).ToList();
            return Ok(result2);
        }
        [Route("create-sanpham")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] SanphamModel model)
        {
            model.sanpham.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.sanpham.UpdatedAt = DateTime.Now.ToString(DateFormat);
            db.SanPhams.Add(model.sanpham);
            db.SaveChanges();

            int MaSanPham = model.sanpham.MaSanPham;

            //model.chitietanhsanpham.CreatedAt = DateTime.Now.ToString(DateFormat);
            //model.chitietanhsanpham.UpdatedAt = DateTime.Now.ToString(DateFormat);
            //db.ChiTietAnhSanPhams.Add(model.chitietanhsanpham);
            //db.SaveChanges();

            model.giasapham.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.giasapham.UpdatedAt = DateTime.Now.ToString(DateFormat);
            model.giasapham.MaSanPham = MaSanPham;
            db.GiaSanPhams.Add(model.giasapham);
            db.SaveChanges();

            model.giamgia.CreatedAt = DateTime.Now.ToString(DateFormat);
            model.giamgia.UpdatedAt = DateTime.Now.ToString(DateFormat);
            model.giamgia.MaSanPham = MaSanPham;
            db.GiamGia.Add(model.giamgia);
            db.SaveChanges();

            //model.thongsokythuat.CreatedAt = DateTime.Now.ToString(DateFormat);
            //model.thongsokythuat.UpdatedAt = DateTime.Now.ToString(DateFormat);
            //model.thongsokythuat.MaSanPham = MaSanPham;
            //db.ThongSoKyThuats.Add(model.thongsokythuat);
            //db.SaveChanges();

            return Ok(new { data = "OK" });
        }
        [Route("update-sanpham")]
        [HttpPost]
        public IActionResult UpdateUser([FromBody] SanphamModel model)
        {
            model.sanpham.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_sanpham = db.SanPhams.SingleOrDefault(x => x.MaSanPham == model.sanpham.MaSanPham);
            obj_sanpham.MaSanPham = model.sanpham.MaSanPham;
            obj_sanpham.TenSanPham = model.sanpham.TenSanPham;
            obj_sanpham.MoTaSanPham = model.sanpham.MoTaSanPham;
            obj_sanpham.MaDanhMuc = model.sanpham.MaDanhMuc;
            obj_sanpham.AnhDaiDien = model.sanpham.AnhDaiDien;
            obj_sanpham.MaNhaSanXuat = model.sanpham.MaNhaSanXuat;
            obj_sanpham.MaDonViTinh = model.sanpham.MaDonViTinh;
            obj_sanpham.UpdatedAt = model.sanpham.UpdatedAt;
            db.SaveChanges();

            model.giasapham.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_giasanpham = db.GiaSanPhams.SingleOrDefault(x => x.MaSanPham == model.giasapham.MaSanPham);
            obj_giasanpham.Gia = model.giasapham.Gia;
         
            obj_giasanpham.UpdatedAt = model.giasapham.UpdatedAt;
            db.SaveChanges();

            model.giamgia.UpdatedAt = DateTime.Now.ToString(DateFormat);
            var obj_giamgia = db.GiamGia.SingleOrDefault(x => x.MaSanPham == model.giamgia.MaSanPham);
            obj_giamgia.PhanTram = model.giamgia.PhanTram;
            obj_giamgia.ThoiGianBatDau = model.giamgia.ThoiGianBatDau;
            obj_giamgia.ThoiGianKetThuc = model.giamgia.ThoiGianKetThuc;
            obj_giamgia.UpdatedAt = model.giamgia.UpdatedAt;
            db.SaveChanges();

            //model.thongsokythuat.UpdatedAt = DateTime.Now.ToString(DateFormat);
            //var obj_thongsokythuat = db.ThongSoKyThuats.SingleOrDefault(x => x.MaSanPham == model.thongsokythuat.MaSanPham);
            //obj_thongsokythuat.TenThongSo = model.thongsokythuat.TenThongSo;
            //obj_thongsokythuat.MoTa = model.thongsokythuat.MoTa;
            //obj_thongsokythuat.UpdatedAt = model.thongsokythuat.UpdatedAt;
            //db.SaveChanges();
            return Ok(new { data = "OK" });
        }

        [Route("delete-sanpham/{MaSanPham}")]
        [HttpDelete]
        public IActionResult DeleteUser(int? MaSanPham)
        {
            var obj1 = db.SanPhams.SingleOrDefault(s => s.MaSanPham == MaSanPham);
            db.SanPhams.Remove(obj1);
            db.SaveChanges();
            //var obj2 = db.GiaSanPhams.SingleOrDefault(s => s.MaSanPham == MaSanPham);
            //db.GiaSanPhams.Remove(obj2);
            //db.SaveChanges();
            //var obj3 = db.GiamGia.SingleOrDefault(s => s.MaSanPham == MaSanPham);
            //db.GiamGia.Remove(obj3);
            //db.SaveChanges();
            //var obj4 = db.ThongSoKyThuats.SingleOrDefault(s => s.MaSanPham == MaSanPham);
            //db.ThongSoKyThuats.Remove(obj4);
            //db.SaveChanges();

            return Ok(new { data = "OK" });
        }
    }
}
