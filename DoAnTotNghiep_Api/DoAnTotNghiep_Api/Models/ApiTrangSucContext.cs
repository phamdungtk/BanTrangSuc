using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep_Api.Models;

public partial class ApiTrangSucContext : DbContext
{
    public ApiTrangSucContext()
    {
    }

    public ApiTrangSucContext(DbContextOptions<ApiTrangSucContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ChiTietAnhSanPham> ChiTietAnhSanPhams { get; set; }

    public virtual DbSet<ChiTietDonHang> ChiTietDonHangs { get; set; }

    public virtual DbSet<ChiTietHoaDonNhap> ChiTietHoaDonNhaps { get; set; }

    public virtual DbSet<ChiTietNhom> ChiTietNhoms { get; set; }

    public virtual DbSet<DanhMuc> DanhMucs { get; set; }

    public virtual DbSet<DonHang> DonHangs { get; set; }

    public virtual DbSet<DonViTinh> DonViTinhs { get; set; }

    public virtual DbSet<GiaSanPham> GiaSanPhams { get; set; }

    public virtual DbSet<GiamGium> GiamGia { get; set; }

    public virtual DbSet<HoaDonNhap> HoaDonNhaps { get; set; }

    public virtual DbSet<KhachHang> KhachHangs { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<NhaCungCap> NhaCungCaps { get; set; }

    public virtual DbSet<NhaSanXuat> NhaSanXuats { get; set; }

    public virtual DbSet<NhomSanPham> NhomSanPhams { get; set; }

    public virtual DbSet<SanPham> SanPhams { get; set; }

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }

    public virtual DbSet<ThongSoKyThuat> ThongSoKyThuats { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=DUNGXUAN;Initial Catalog=API_TrangSuc;Integrated Security=True;TrustServerCertificate=true;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChiTietAnhSanPham>(entity =>
        {
            entity.HasKey(e => e.MaAnhChitiet);

            entity.ToTable("ChiTietAnhSanPham");

            entity.Property(e => e.Anh)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.MaSanPhamNavigation).WithMany(p => p.ChiTietAnhSanPhams)
                .HasForeignKey(d => d.MaSanPham)
                .HasConstraintName("FK_ChiTietAnhSanPham_SanPham");
        });

        modelBuilder.Entity<ChiTietDonHang>(entity =>
        {
            entity.HasKey(e => e.MaChiTietDonHang);

            entity.ToTable("ChiTietDonHang");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.MaDonHangNavigation).WithMany(p => p.ChiTietDonHangs)
                .HasForeignKey(d => d.MaDonHang)
                .HasConstraintName("FK_ChiTietDonHang_DonHang");

            entity.HasOne(d => d.MaSanPhamNavigation).WithMany(p => p.ChiTietDonHangs)
                .HasForeignKey(d => d.MaSanPham)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChiTietDonHang_SanPham");
        });

        modelBuilder.Entity<ChiTietHoaDonNhap>(entity =>
        {
            entity.HasKey(e => e.MaChiTiet);

            entity.ToTable("ChiTietHoaDonNhap");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.MaHoaDonNhapNavigation).WithMany(p => p.ChiTietHoaDonNhaps)
                .HasForeignKey(d => d.MaHoaDonNhap)
                .HasConstraintName("FK_ChiTietHoaDonNhap_HoaDonNhap");

            entity.HasOne(d => d.MaSanPhamNavigation).WithMany(p => p.ChiTietHoaDonNhaps)
                .HasForeignKey(d => d.MaSanPham)
                .HasConstraintName("FK_ChiTietHoaDonNhap_SanPham");
        });

        modelBuilder.Entity<ChiTietNhom>(entity =>
        {
            entity.HasKey(e => e.MaChiTietNhom);

            entity.ToTable("ChiTietNhom");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.MaNhomSanPhamNavigation).WithMany(p => p.ChiTietNhoms)
                .HasForeignKey(d => d.MaNhomSanPham)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChiTietNhom_NhomSanPham");

            entity.HasOne(d => d.MaSanPhamNavigation).WithMany(p => p.ChiTietNhoms)
                .HasForeignKey(d => d.MaSanPham)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChiTietNhom_SanPham");
        });

        modelBuilder.Entity<DanhMuc>(entity =>
        {
            entity.HasKey(e => e.MaDanhMuc);

            entity.ToTable("DanhMuc");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.Stt).HasColumnName("STT");
            entity.Property(e => e.TenDanhMuc).HasMaxLength(250);
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<DonHang>(entity =>
        {
            entity.HasKey(e => e.MaDonHang);

            entity.ToTable("DonHang");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.NgayDat).HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.MaKhachHangNavigation).WithMany(p => p.DonHangs)
                .HasForeignKey(d => d.MaKhachHang)
                .HasConstraintName("FK_DonHang_KhachHang");
        });

        modelBuilder.Entity<DonViTinh>(entity =>
        {
            entity.HasKey(e => e.MaDonViTinh);

            entity.ToTable("DonViTinh");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.TenDonViTinh).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<GiaSanPham>(entity =>
        {
            entity.HasKey(e => e.MaGiaSanPham).HasName("PK_GiaSanPham_1");

            entity.ToTable("GiaSanPham");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.MaSanPhamNavigation).WithMany(p => p.GiaSanPhams)
                .HasForeignKey(d => d.MaSanPham)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GiaSanPham_SanPham");
        });

        modelBuilder.Entity<GiamGium>(entity =>
        {
            entity.HasKey(e => e.MaGiamGia).HasName("PK_GiamGias");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<HoaDonNhap>(entity =>
        {
            entity.HasKey(e => e.MaHoaDonNhap);

            entity.ToTable("HoaDonNhap");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.NgayNhap).HasColumnType("datetime");
            entity.Property(e => e.SoHoaDon)
                .HasMaxLength(50)
                .IsFixedLength();
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.HoaDonNhaps)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HoaDonNhap_NguoiDung");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.HoaDonNhaps)
                .HasForeignKey(d => d.MaNhaCungCap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HoaDonNhap_NhaCungCap");
        });

        modelBuilder.Entity<KhachHang>(entity =>
        {
            entity.HasKey(e => e.MaKhachHang);

            entity.ToTable("KhachHang");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.DiaChi).HasMaxLength(1500);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.TenKhachHang).HasMaxLength(250);
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung);

            entity.ToTable("NguoiDung");

            entity.Property(e => e.AnhDaiDien)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.DiaChi).HasMaxLength(1500);
            entity.Property(e => e.DienThoai)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.GioiTinh).HasMaxLength(20);
            entity.Property(e => e.HoTen).HasMaxLength(250);
            entity.Property(e => e.NgaySinh).HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<NhaCungCap>(entity =>
        {
            entity.HasKey(e => e.MaNhaCungCap);

            entity.ToTable("NhaCungCap");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.DiaChi).HasMaxLength(500);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.TenNhaCungCap).HasMaxLength(250);
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<NhaSanXuat>(entity =>
        {
            entity.HasKey(e => e.MaNhaSanXuat);

            entity.ToTable("NhaSanXuat");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.MoTa).HasColumnType("ntext");
            entity.Property(e => e.TenNhaSanXuat).HasMaxLength(250);
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<NhomSanPham>(entity =>
        {
            entity.HasKey(e => e.MaNhomSanPham);

            entity.ToTable("NhomSanPham");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.TenNhom).HasMaxLength(250);
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<SanPham>(entity =>
        {
            entity.HasKey(e => e.MaSanPham);

            entity.ToTable("SanPham");

            entity.Property(e => e.AnhDaiDien)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.MoTaSanPham).HasColumnType("ntext");
            entity.Property(e => e.TenSanPham).HasMaxLength(250);
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.MaDanhMucNavigation).WithMany(p => p.SanPhams)
                .HasForeignKey(d => d.MaDanhMuc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SanPham_DanhMuc");

            entity.HasOne(d => d.MaDonViTinhNavigation).WithMany(p => p.SanPhams)
                .HasForeignKey(d => d.MaDonViTinh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SanPham_DonViTinh");

            entity.HasOne(d => d.MaNhaSanXuatNavigation).WithMany(p => p.SanPhams)
                .HasForeignKey(d => d.MaNhaSanXuat)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SanPham_NhaSanXuat");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.MaTaiKhoan);

            entity.ToTable("TaiKhoan");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.LoaiQuyen)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.MatKhau)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.TaiKhoan1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("TaiKhoan");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.TaiKhoans)
                .HasForeignKey(d => d.MaNguoiDung)
                .HasConstraintName("FK_TaiKhoan_NguoiDung");
        });

        modelBuilder.Entity<ThongSoKyThuat>(entity =>
        {
            entity.HasKey(e => e.MaThongSo).HasName("PK_ThongSKyThuat");

            entity.ToTable("ThongSoKyThuat");

            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.MoTa).HasMaxLength(500);
            entity.Property(e => e.TenThongSo).HasMaxLength(150);
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.MaSanPhamNavigation).WithMany(p => p.ThongSoKyThuats)
                .HasForeignKey(d => d.MaSanPham)
                .HasConstraintName("FK_ThongSoKyThuat_SanPham1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
