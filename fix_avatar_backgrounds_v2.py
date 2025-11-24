from PIL import Image
import numpy as np
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
    
    # Convert to RGB if needed
    if img.mode == 'RGBA':
        # Create white background
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Convert to numpy array for pixel manipulation
    img_array = np.array(img)
    
    # Replace any light pixels (near-white) with pure white
    # This catches off-white, light gray, etc.
    # Pixels with R, G, B all > 240 will become pure white
    light_pixels = (img_array[:, :, 0] > 240) & (img_array[:, :, 1] > 240) & (img_array[:, :, 2] > 240)
    img_array[light_pixels] = [255, 255, 255]
    
    # Convert back to image
    final_img = Image.fromarray(img_array)
    
    # Save with pure white background
    final_img.save(img_path, 'PNG', quality=100, optimize=False)
    print(f"✓ Processed {img_name} - replaced light pixels with pure white (#FFFFFF)")

print("\n✓ All avatar images processed successfully!")
print("All light gray/off-white backgrounds converted to pure white.")
