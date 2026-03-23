import os
from PIL import Image

def resize_icon(source_path, target_path, size):
    with Image.open(source_path) as img:
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        img.save(target_path)
        print(f"Saved {target_path} at {size}x{size}")

def main():
    source = "/tmp/file_attachments/colored-logo.png"
    base_res = "dashmeals55/android/app/src/main/res"

    icon_configs = [
        ("mipmap-mdpi", 48),
        ("mipmap-hdpi", 72),
        ("mipmap-xhdpi", 96),
        ("mipmap-xxhdpi", 144),
        ("mipmap-xxxhdpi", 192),
    ]

    for folder, size in icon_configs:
        folder_path = os.path.join(base_res, folder)
        os.makedirs(folder_path, exist_ok=True)

        # Replace ic_launcher.png
        resize_icon(source, os.path.join(folder_path, "ic_launcher.png"), size)
        # Replace ic_launcher_round.png
        resize_icon(source, os.path.join(folder_path, "ic_launcher_round.png"), size)
        # For simplicity, we can also use it for foreground (though usually they are different)
        resize_icon(source, os.path.join(folder_path, "ic_launcher_foreground.png"), size)

    # 512x512 icon for store/general
    os.makedirs(base_res, exist_ok=True)
    resize_icon(source, os.path.join(base_res, "playstore-icon.png"), 512)

if __name__ == "__main__":
    main()
