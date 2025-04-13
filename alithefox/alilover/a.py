import re

# 读取 replace.txt 并构建一个字典：文件名 -> 图片链接
replace_map = {}
with open("replace.txt", "r", encoding="utf-8") as f:
    for line in f:
        match = re.match(r'!\[([^\]]+)\]\((https?://[^\)]+)\)', line.strip())
        if match:
            filename, url = match.groups()
            replace_map[filename] = url

# 读取 HTML 文件
with open("index3.html", "r", encoding="utf-8") as f:
    html_content = f.read()

# 替换函数
def replace_img_src(match):
    prefix, filename, suffix = match.groups()
    if filename.lower().endswith('.gif'):
        return match.group(0)  # 不替换 gif
    if filename in replace_map:
        return f'{prefix}{replace_map[filename]}{suffix}'
    else:
        return match.group(0)  # 找不到对应项也不替换

# 替换 <img> 标签中的 src="img/xxx.xxx"
updated_content = re.sub(
    r'(<img[^>]*src=["\'])img/([^"\']+)(["\'])',
    replace_img_src,
    html_content
)

# 保存替换后的内容
with open("ali_updated.html", "w", encoding="utf-8") as f:
    f.write(updated_content)

print("替换完成，输出文件为 ali_updated.html")
