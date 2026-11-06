<#
.SYNOPSIS
    Automated Git & GitHub Setup for Lemo-Opuscar Studio
.DESCRIPTION
    Initializes git repository, creates commit, and connects with GitHub.
#>

$ghPath = "C:\Program Files\GitHub CLI\gh.exe"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 OTOMATISASI PENGATURAN GITHUB: LEMO-OPUSCAR STUDIO" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Initialize Git Repo
if (-not (Test-Path ".git")) {
    Write-Host "[1/4] Menginisialisasi repositori Git lokal..." -ForegroundColor Green
    git init -b main
} else {
    Write-Host "[1/4] Repositori Git lokal sudah ada." -ForegroundColor Green
}

# 2. Stage & Commit
Write-Host "[2/4] Menyimpan seluruh berkas proyek ke Git..." -ForegroundColor Green
git add .
git commit -m "feat: initial Lemo-Opuscar Studio Web App & Cloud Render Farm" --allow-empty

# 3. Check GitHub CLI Authentication
Write-Host "[3/4] Memeriksa koneksi GitHub CLI..." -ForegroundColor Green
$authCheck = & $ghPath auth status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[!] Anda belum login ke akun GitHub di perangkat ini." -ForegroundColor Yellow
    Write-Host "Silakan jalankan perintah berikut untuk login instan lewat browser (1 klik):" -ForegroundColor White
    Write-Host "    & '$ghPath' auth login -w" -ForegroundColor Magenta
    Write-Host "`nSetelah login berhasil, jalankan kembali skrip ini untuk otomatis membuat repo!" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "[*] Terautentikasi ke GitHub!" -ForegroundColor Green
}

# 4. Create Remote Repo and Push Automatically
Write-Host "[4/4] Membuat repository di akun GitHub dan mengunggah kode..." -ForegroundColor Green
$repoName = "lemo-opuscar-studio"

& $ghPath repo create $repoName --public --source=. --remote=origin --push 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================================" -ForegroundColor Green
    Write-Host "🎉 REPOSITORI GITHUB BERHASIL DIBUAT DAN DIUNGGAH!" -ForegroundColor Yellow
    Write-Host "Kini Anda dapat langsung merender film di Cloud Runner!" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
} else {
    Write-Host "`nCatatan: Jika repo sudah pernah dibuat di GitHub, jalankan:" -ForegroundColor Yellow
    Write-Host "    git push -u origin main" -ForegroundColor White
}
