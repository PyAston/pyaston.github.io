import re
import os
import xml.etree.ElementTree as ET

def extract_sinaimg_links(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 正则表达式匹配 sinaimg.cn 图片链接
    pattern = re.compile(r'https?://[^/]+\.sinaimg\.cn/large/([^\s]+?\.jpg)')
    
    # 提取所有匹配的链接和对应的文件名
    matches = {match.group(0): match.group(1) for match in pattern.finditer(content)}
    
    return matches, content

def load_replacement_map(replace_file):
    replacement_map = {}
    with open(replace_file, 'r', encoding='utf-8') as file:
        for line in file:
            match = re.match(r'!\[(.*?)\]\((.*?)\)', line.strip())
            if match:
                replacement_map[match.group(1)] = match.group(2)
    return replacement_map

def replace_links_in_content(content, matches, replacement_map):
    for original_link, filename in matches.items():
        if filename in replacement_map:
            new_link = replacement_map[filename]
            content = content.replace(original_link, new_link)
            print(f"Replaced: {original_link} -> {new_link}")
        else:
            print(f"No replacement found for: {filename}")
    return content

def process_html_files(directory, replace_file):
    replacement_map = load_replacement_map(replace_file)
    
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            file_path = os.path.join(directory, filename)
            matches, content = extract_sinaimg_links(file_path)
            updated_content = replace_links_in_content(content, matches, replacement_map)
            
            # 保存更新后的 HTML 文件
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(updated_content)
            
            print(f"Processed: {filename}")

if __name__ == "__main__":
    current_directory = "./"  # 当前目录
    replace_file = "replace.txt"  # 替换文件
    
    process_html_files(current_directory, replace_file)
    print("Replacement complete.")
