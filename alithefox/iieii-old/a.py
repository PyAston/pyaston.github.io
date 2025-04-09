import os
import re

def list_files_title_without_phrase(directory, pattern):
    files_without_phrase = []
    regex_title = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)
    regex_phrase = re.compile(pattern)

    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)

        if os.path.isfile(file_path) and filename.endswith(".html"):
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

                # 提取 title 内容
                title_match = regex_title.search(content)
                if title_match:
                    title_text = title_match.group(1).strip()
                    
                    # 如果 title 中不包含 "第x封"，则记录文件
                    if not regex_phrase.search(title_text):
                        files_without_phrase.append(filename)
                else:
                    # 没有 title 标签也算不包含
                    files_without_phrase.append(filename)

    return files_without_phrase

# 匹配“第...封”
pattern = r"第.*?封"
article_directory = "article" # 文章目录
# 调用函数并打印结果
result = list_files_title_without_phrase(article_directory, pattern)

for file in result:
    print(file)
