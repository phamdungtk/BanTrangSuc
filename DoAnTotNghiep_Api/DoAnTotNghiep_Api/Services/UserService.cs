using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using DoAnTotNghiep_Api.Entities;
using DoAnTotNghiep_Api.Helpers;
using DoAnTotNghiep_Api.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace   DoAnTotNghiep_Api.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
    }

    public class UserService : IUserService
    {
        private ApiTrangSucContext db = new ApiTrangSucContext();

        private readonly AppSettings _appSettings;

        public UserService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public User Authenticate(string username, string password)
        {
            var result = from t in db.TaiKhoans
                         join n in db.NguoiDungs on t.MaNguoiDung equals n.MaNguoiDung
                         select new User { LoaiQuyen = t.LoaiQuyen, MaNguoiDung = t.MaNguoiDung, AnhDaiDien = n.AnhDaiDien, TaiKhoan = t.TaiKhoan1, HoTen = n.HoTen, MatKhau = t.MatKhau, DiaChi = n.DiaChi, DienThoai = n.DienThoai, Email = n.Email };
            var user = result.SingleOrDefault(x => x.TaiKhoan == username && x.MatKhau == password);

            // return null if user not found
            if (user == null)
                return null;

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.TaiKhoan.ToString()),
                    new Claim(ClaimTypes.MobilePhone, user.DienThoai.ToString()),
                    new Claim(ClaimTypes.Email, user.Email.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user.WithoutPassword();
        }

    }
}