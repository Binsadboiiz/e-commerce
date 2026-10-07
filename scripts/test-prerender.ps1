# =========================================================
# Prerender.io & Dynamic Rendering Verification Script
# =========================================================

param (
    [string]$TargetUrl = "https://localhost:5269"
)

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " Testing Prerender.io & SEO Dynamic Rendering Endpoint " -ForegroundColor Cyan
Write-Host " Target URL: $TargetUrl" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Disable SSL validation for localhost testing if needed
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}

# 1. Test Robots.txt
Write-Host "[1/5] Testing Robots.txt endpoint..." -ForegroundColor Yellow
try {
    $robotsResp = Invoke-WebRequest -Uri "$TargetUrl/robots.txt" -UseBasicParsing -SkipCertificateCheck
    Write-Host " -> Status: $($robotsResp.StatusCode)" -ForegroundColor Green
    Write-Host " -> Content Preview:" -ForegroundColor Gray
    Write-Host ($robotsResp.Content -split "`n" | Select-Object -First 6 | Out-String) -ForegroundColor Gray
} catch {
    Write-Host " -> Failed: $_" -ForegroundColor Red
}

# 2. Test Sitemap.xml
Write-Host "[2/5] Testing Sitemap.xml endpoint..." -ForegroundColor Yellow
try {
    $sitemapResp = Invoke-WebRequest -Uri "$TargetUrl/sitemap.xml" -UseBasicParsing -SkipCertificateCheck
    Write-Host " -> Status: $($sitemapResp.StatusCode)" -ForegroundColor Green
    Write-Host " -> Content Type: $($sitemapResp.Headers['Content-Type'])" -ForegroundColor Gray
    Write-Host " -> XML Preview:" -ForegroundColor Gray
    Write-Host ($sitemapResp.Content -split "`n" | Select-Object -First 8 | Out-String) -ForegroundColor Gray
} catch {
    Write-Host " -> Failed: $_" -ForegroundColor Red
}

# 3. Test Human Browser Request (Chrome User-Agent)
Write-Host "[3/5] Testing Human Browser Request (Should NOT trigger Prerender)..." -ForegroundColor Yellow
try {
    $humanResp = Invoke-WebRequest -Uri "$TargetUrl/products" -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -UseBasicParsing -SkipCertificateCheck
    $prerenderHeader = $humanResp.Headers["X-Prerender-Cache"]
    if ($null -eq $prerenderHeader) {
        Write-Host " -> PASSED: Human request did NOT trigger Prerender middleware." -ForegroundColor Green
    } else {
        Write-Host " -> WARNING: Human request returned Prerender header: $prerenderHeader" -ForegroundColor Yellow
    }
} catch {
    Write-Host " -> Request error: $_" -ForegroundColor Red
}

# 4. Test Googlebot Request (Should Trigger Prerender)
Write-Host "[4/5] Testing Googlebot Crawler Request..." -ForegroundColor Yellow
try {
    $botResp = Invoke-WebRequest -Uri "$TargetUrl/products" -UserAgent "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" -UseBasicParsing -SkipCertificateCheck
    $cacheHeader = $botResp.Headers["X-Prerender-Cache"]
    Write-Host " -> Status: $($botResp.StatusCode)" -ForegroundColor Green
    Write-Host " -> X-Prerender-Cache: $cacheHeader" -ForegroundColor Cyan
} catch {
    Write-Host " -> Note: Prerender.io remote call requires valid Token in appsettings.json or internet access. Error: $_" -ForegroundColor DarkYellow
}

# 5. Test Forced Prerender Flag (?prerender=true)
Write-Host "[5/5] Testing Forced Flag (?prerender=true)..." -ForegroundColor Yellow
try {
    $forcedResp = Invoke-WebRequest -Uri "$TargetUrl/products?prerender=true" -UseBasicParsing -SkipCertificateCheck
    $forcedCacheHeader = $forcedResp.Headers["X-Prerender-Cache"]
    Write-Host " -> Status: $($forcedResp.StatusCode)" -ForegroundColor Green
    Write-Host " -> X-Prerender-Cache: $forcedCacheHeader" -ForegroundColor Cyan
} catch {
    Write-Host " -> Note: Prerender.io remote call requires valid Token in appsettings.json or internet access. Error: $_" -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " SEO & Prerender Verification Completed " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
