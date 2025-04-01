import re
import xml.etree.ElementTree as ET
import requests

def extract_sinaimg_links(xml_file):
    with open(xml_file, 'r', encoding='utf-8') as file:
        xml_content = file.read()
    
    # 解析 XML
    root = ET.fromstring(xml_content)
    
    # 正则表达式匹配 sinaimg.cn 图片链接
    pattern = re.compile(r'https?://[^\s]+?\.sinaimg\.cn/[^\s]+?\.jpg')
    
    # 提取所有匹配的链接
    matches = pattern.findall(xml_content)
    
    return matches

def download_images(links, save_dir="image"):
    import os
    os.makedirs(save_dir, exist_ok=True)
    
    for link in links:
        filename = os.path.join(save_dir, link.split("/")[-1])
        try:
            response = requests.get(link, stream=True)
            if response.status_code == 200:
                with open(filename, 'wb') as file:
                    for chunk in response.iter_content(1024):
                        file.write(chunk)
                print(f"Downloaded: {filename}")
            else:
                print(f"Failed to download: {link}")
        except Exception as e:
            print(f"Error downloading {link}: {e}")

if __name__ == "__main__":
    xml_file = "rss.xml"  # 替换成你的 XML 文件路径
    links = extract_sinaimg_links(xml_file)
    
    # 下载图片
    download_images(links)
