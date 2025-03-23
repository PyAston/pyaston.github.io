import os
from bs4 import BeautifulSoup
import re

def process_templates():
    # 读取模板文件
    with open('model.html', 'r', encoding='utf-8') as f:
        template = f.read()

    # 读取包含文章的index文件
    with open('ali.html', 'r', encoding='utf-8') as f:
        index_content = f.read()

    # 使用BeautifulSoup解析HTML
    soup = BeautifulSoup(index_content, 'html.parser')
    
    # 查找所有文章片段
    articles = soup.find_all('div', class_='article')
    
    # 确保article文件夹存在
    output_dir = 'article'
    os.makedirs(output_dir, exist_ok=True)

    for article in articles:
        # 提取文章中的链接
        link_tag = article.find('a', class_='mdui-text-color-theme', href=True)
        if not link_tag:
            continue
            
        # 从链接中提取post编号
        href = link_tag['href']
        match = re.search(r'post-(\d+)\.html', href)
        if not match:
            continue
            
        post_number = match.group(1)
        
        # 生成文件名，保存到article文件夹
        filename = os.path.join(output_dir, f"post-{post_number}.html")
        
        # 替换模板中的内容
        article_content = str(article)
        processed_content = template.replace('{content}', article_content)
        
        # 保存文件
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(processed_content)
        
        print(f"已生成文件：{filename}")

if __name__ == '__main__':
    process_templates()
    print("处理完成！")
