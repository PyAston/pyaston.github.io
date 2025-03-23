from bs4 import BeautifulSoup
import os

# 读取原始 HTML 文件
with open('input.html', 'r', encoding='utf-8') as f:
    original_html = f.read()

# 解析 HTML 文件
soup = BeautifulSoup(original_html, 'html.parser')

# 找到所有的 <div class="article"> 标签
articles = soup.find_all('div', class_='article')

# 读取模板文件
with open('model.html', 'r', encoding='utf-8') as template_file:
    template_html = template_file.read()

# 提取每个 article 内容并插入模板
for article in articles:
    # 提取链接中的 post-xxx.html，获取 xxx 部分
    link = article.find('a', href=True)
    if link and 'post-' in link['href']:
        post_name = link['href'].split('/')[-1]  # 获取 post-xxx.html
        post_id = post_name.split('-')[1].split('.')[0]  # 提取 xxx 部分

        # 替换模板中的 {content} 为该 article 内容
        article_content = str(article)
        new_html = template_html.replace('{content}', article_content)

        # 保存为新的 HTML 文件
        output_filename = f'article_{post_id}.html'
        with open(os.path.join('output', output_filename), 'w', encoding='utf-8') as output_file:
            output_file.write(new_html)

        print(f'Generated {output_filename}')
