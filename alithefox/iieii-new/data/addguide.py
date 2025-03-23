import os
import re

# 假设所有的 HTML 文件都在一个目录中
directory = 'article'

# 获取所有文件，并过滤出符合 post-xxx.html 格式的文件
def get_post_files(directory):
    files = []
    for file in os.listdir(directory):
        if file.startswith('post-') and file.endswith('.html'):
            # 提取数字部分
            match = re.match(r'post-(\d+).html', file)
            if match:
                files.append((int(match.group(1)), file))
    # 按照文件中的数字部分进行排序
    files.sort()
    return files

# 读取文件内容
def read_file_content(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

# 提取“第x封”的内容（假设内容是“第x封”形式）
def extract_section_title(content):
    match = re.search(r'第(\S+)封', content)
    if match:
        return match.group(0)  # 返回完整的“第x封”
    return None

# 替换占位符的函数
def replace_placeholders(content, lastlink, nextlink, lastname, nextname):
    content = content.replace('{lastlink}', lastlink)
    content = content.replace('{nextlink}', nextlink)
    content = content.replace('{lastname}', lastname)
    content = content.replace('{nextname}', nextname)
    return content

# 主操作逻辑
def process_files(directory):
    # 获取排序后的文件列表
    files = get_post_files(directory)

    # 遍历文件并处理
    for i in range(1, len(files) - 1):  # 从第二个文件到倒数第二个文件
        prev_file = files[i - 1]
        current_file = files[i]
        next_file = files[i + 1]

        prev_file_path = os.path.join(directory, prev_file[1])
        current_file_path = os.path.join(directory, current_file[1])
        next_file_path = os.path.join(directory, next_file[1])

        # 读取当前文件内容
        current_content = read_file_content(current_file_path)

        # 获取 {lastlink}, {nextlink}
        lastlink = f"/alithefox/iieii-new/article/{prev_file[1]}"
        nextlink = f"/alithefox/iieii-new/article/{next_file[1]}"

        # 从 post-aaa.html 和 post-bbb.html 中提取“第x封”
        last_file_content = read_file_content(prev_file_path)
        next_file_content = read_file_content(next_file_path)

        lastname = extract_section_title(last_file_content)
        nextname = extract_section_title(next_file_content)

        # 如果提取不到“第x封”，则跳过替换
        if not lastname or not nextname:
            print(f"Warning: Could not find '第x封' in {prev_file[1]} or {next_file[1]}")
            continue

        # 替换当前文件中的占位符
        updated_content = replace_placeholders(current_content, lastlink, nextlink, lastname, nextname)

        # 保存替换后的内容
        with open(current_file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)

# 执行
process_files(directory)
