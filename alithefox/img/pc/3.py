import os

# 设置图片目录路径
image_folder = './'  # ← 这里换成你的目录

# 支持的图片后缀
image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.webp']

# 获取目录下所有图片文件（保留原扩展名）
images = [f for f in os.listdir(image_folder)
          if os.path.splitext(f)[1].lower() in image_extensions]

# 排序（可选：按文件名排序，也可以按修改时间）
images.sort()  # 默认按文件名排序

# 重命名
for idx, old_name in enumerate(images, start=1):
    old_path = os.path.join(image_folder, old_name)
    ext = os.path.splitext(old_name)[1].lower()
    new_name = f"{idx}{ext}"
    new_path = os.path.join(image_folder, new_name)

    # 如果目标文件已存在，先改临时名避免冲突
    if os.path.exists(new_path):
        temp_path = os.path.join(image_folder, f"temp_{idx}{ext}")
        os.rename(old_path, temp_path)
    else:
        os.rename(old_path, new_path)

# 第二轮重命名（如果中间用了临时名）
for f in os.listdir(image_folder):
    if f.startswith("temp_"):
        idx = int(f.split('_')[1].split('.')[0])
        ext = os.path.splitext(f)[1]
        final_name = f"{idx}{ext}"
        os.rename(os.path.join(image_folder, f), os.path.join(image_folder, final_name))

print("重命名完成！")
