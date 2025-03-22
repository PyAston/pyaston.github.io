import os
import re

# 1. 读取 replace.txt，构建旧图片名到新链接的映射
replace_dict = {}
with open("replace.txt", "r", encoding="utf-8") as f:
    for line in f:
        match = re.match(r"!\[(.*?)\]\((.*?)\)", line.strip())
        if match:
            old_name, new_link = match.groups()
            replace_dict[old_name] = new_link

# 2. 处理 artical 文件夹下的所有 HTML 文件
html_dir = "artical"

for filename in os.listdir(html_dir):
    if filename.endswith(".html"):
        html_path = os.path.join(html_dir, filename)
        
        with open(html_path, "r", encoding="utf-8") as f:
            content = f.read()

        # 3. 替换 HTML 中的 <img> 标签
        def replace_img(match):
            old_url = match.group(1)  # 原始链接
            old_name = os.path.basename(old_url)  # 获取图片名
            if old_name in replace_dict:
                new_link = replace_dict[old_name]
                return f'<img alt="{old_name}" src="{new_link}" />'
            return match.group(0)  # 如果没找到，保持原样

        new_content = re.sub(r'<img [^>]*?src="(http[^"]+)"', replace_img, content)

        # 4. 覆盖原 HTML 文件
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(new_content)

print("✅ 替换完成！所有 HTML 文件已更新！")
