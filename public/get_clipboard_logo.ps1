Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

if ([System.Windows.Forms.Clipboard]::ContainsImage()) {
    $img = [System.Windows.Forms.Clipboard]::GetImage()
    $dest = Join-Path -Path $PWD -ChildPath "public\logo.png"
    $img.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "SUCCESS: Saved clipboard image to $dest"
} else {
    Write-Host "ERROR: No image found in the clipboard!"
}
