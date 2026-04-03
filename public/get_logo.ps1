Add-Type -AssemblyName System.Windows.Forms
$OpenFileDialog = New-Object System.Windows.Forms.OpenFileDialog
$OpenFileDialog.Title = "Select your Yamato Logo image"
$OpenFileDialog.Filter = "Image Files (*.png; *.jpg; *.jpeg; *.webp)|*.png;*.jpg;*.jpeg;*.webp|All Files (*.*)|*.*"
$OpenFileDialog.InitialDirectory = [Environment]::GetFolderPath('Desktop')
$OpenFileDialog.Multiselect = $false

$result = $OpenFileDialog.ShowDialog()
if ($result -eq 'OK') {
    # Destination is explicitly the public folder of the next.js project
    $dest = Join-Path -Path $PWD -ChildPath "public\logo.png"
    Copy-Item -Path $OpenFileDialog.FileName -Destination $dest -Force
    Write-Host "Success! Uploaded logo from $($OpenFileDialog.FileName) to $dest"
} else {
    Write-Host "Action cancelled by user."
}
