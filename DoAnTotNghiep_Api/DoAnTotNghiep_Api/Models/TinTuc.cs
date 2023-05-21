using System;
using System.Collections.Generic;

namespace DoAnTotNghiep_Api.Models;

public partial class TinTuc
{
    public int MaTinTuc { get; set; }

    public int? MaNguoiDung { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public string? CreatedAt { get; set; }

    public string? UpdatedAt { get; set; }

    public string? AnhTinTuc { get; set; }

    public virtual NguoiDung? MaNguoiDungNavigation { get; set; }
}
