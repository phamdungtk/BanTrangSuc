﻿using System.ComponentModel.DataAnnotations;

namespace DoAnTotNghiep_Api.Models
{
    public class AuthenticateModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}