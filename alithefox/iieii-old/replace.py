import re
import xml.etree.ElementTree as ET

def extract_sinaimg_links(xml_file):
    with open(xml_file, 'r', encoding='utf-8') as file:
        xml_content = file.read()
    
    # 解析 XML
    root = ET.fromstring(xml_content)
    
    # 正则表达式匹配 sinaimg.cn 图片链接
    pattern = re.compile(r'https?://[^/]+\.sinaimg\.cn/large/([^\s]+?\.jpg)')
    
    # 提取所有匹配的链接和对应的文件名
    matches = {match.group(0): match.group(1) for match in pattern.finditer(xml_content)}
    
    return matches, xml_content

def load_replacement_map(replace_file):
    replacement_map = {}
    with open(replace_file, 'r', encoding='utf-8') as file:
        for line in file:
            match = re.match(r'!\[(.*?)\]\((.*?)\)', line.strip())
            if match:
                replacement_map[match.group(1)] = match.group(2)
    return replacement_map

def replace_links_in_xml(xml_content, matches, replacement_map):
    for original_link, filename in matches.items():
        if filename in replacement_map:
            new_link = replacement_map[filename]
            xml_content = xml_content.replace(original_link, new_link)
            print(f"Replaced: {original_link} -> {new_link}")
        else:
            print(f"No replacement found for: {filename}")
    return xml_content

if __name__ == "__main__":
    xml_file = "rss.xml"  # 替换成你的 XML 文件路径
    replace_file = "replace.txt"  # 替换成你的替换文件路径
    
    matches, xml_content = extract_sinaimg_links(xml_file)
    replacement_map = load_replacement_map(replace_file)
    updated_xml_content = replace_links_in_xml(xml_content, matches, replacement_map)
    
    # 保存更新后的 XML 文件
    with open("updated_" + xml_file, "w", encoding="utf-8") as file:
        file.write(updated_xml_content)
    
    print("Replacement complete. Updated XML saved as updated_" + xml_file)
