from PIL import Image
import os

# 设置路径
input_folder = './'
output_folder = './output'
target_width = 2400

# 确保输出目录存在
os.makedirs(output_folder, exist_ok=True)

for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.webp', '.tiff')):
        filepath = os.path.join(input_folder, filename)
        img = Image.open(filepath)
        width, height = img.size

        if width <= target_width:
            # 跳过无需缩小的图片
            img.save(os.path.join(output_folder, filename))
            continue

        # 等比例缩放
        new_height = int((target_width / width) * height)
        resized_img = img.resize((target_width, new_height), Image.LANCZOS)

        # 保存
        resized_img.save(os.path.join(output_folder, filename))
        print(f'Processed: {filename}')
