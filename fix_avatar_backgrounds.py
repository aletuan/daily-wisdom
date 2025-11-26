from PIL import Image
import os

# Process avatar images to ensure pure white background
avatar_dir = 'assets/avatars'
images = ['soren-kierkegaard.png', 'marcus-aurelius.png', 'placeholder-avatar.png']

for img_name in images:
    img_path = os.path.join(avatar_dir, img_name)
    
    if not os.path.exists(img_path):
        print(f"Skipping {img_name} - file not found")
        continue
    
    # Open image
    img = Image.open(img_path)
    
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Create a new image with pure white background
    white_bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
    
    # Composite the image onto white background
    white_bg.paste(img, (0, 0), img)
    
    # Convert back to RGB (remove alpha channel)
    final_img = white_bg.convert('RGB')
    
    # Save with pure white background
    final_img.save(img_path, 'PNG', quality=95)
    print(f"Processed {img_name} - ensured pure white background")

print("All avatar images processed successfully!")
