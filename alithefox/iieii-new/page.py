import os
import re
from bs4 import BeautifulSoup

# 文章和分页文件的路径
article_dir = 'article'
page_dir = 'page'

# 获取所有的文章文件
def get_article_files():
    files = []
    for filename in os.listdir(article_dir):
        if filename == "ali.html" or filename.startswith("post-"):
            files.append(filename)
    # 排序文件，确保按顺序排列
    return sorted(files, key=lambda x: int(re.search(r'(\d+)', x).group(0)) if re.search(r'(\d+)', x) else 0)

# 提取文章信息（标题、图片链接）
def extract_article_info(article_file):
    with open(os.path.join(article_dir, article_file), 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        # 提取标题
        title_tag = soup.find('a', class_='mdui-text-color-theme')
        title = title_tag.text.strip() if title_tag else "未找到标题"
        # 提取图片链接
        img_tag = soup.find('a', href=re.compile(r'https?://[^/]+\.360buyimg\.com(/[^/]+)+\.(jpg|jpeg|png|gif)'))

        img_url = img_tag.find('img')['src'] if img_tag else '/assets/img/Logo.svg'
        return title, img_url

# 生成卡片HTML模板
def generate_card_html(post_link, post_img, post_title):
    card_html = f'''
    <div class="mdui-card mdui-shadow-0" style="height: 207px; width: 180px; border: 1px solid #D8D8D8; position: relative; padding-top: 10px;">
        <a href="{post_link}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;"></a>
        <div class="mdui-card-media" style="overflow: hidden; display: flex; justify-content: center;">
            <img src="{post_img}" style="height: 157px; width: auto; object-fit: contain;" />
        </div>
        <div class="mdui-card-content" style="height: 12px; display: flex; justify-content: center; align-items: center;">
            <span class="mdui-typo-title" style="font-weight: bold; text-align: center; display: block; font-size: 15px;">
                {post_title}
            </span>
        </div>
    </div>
    '''
    return card_html

# 生成分页文件HTML
def generate_page_file(page_num, card_list, page_links, total_pages):
    # 读取模板文件
    with open('pagemodel.html', 'r', encoding='utf-8') as template_file:
        template = template_file.read()

    # 生成卡片部分
    cards_html = ''.join(card_list)

    # 生成分页链接部分
    pagination_html = f'''
    <div class="pagination">
        {page_links}
    </div>
    '''

    # 生成上一页和下一页链接
    last_page = f"page-{page_num - 1}.html" if page_num > 1 else "#"
    next_page = f"page-{page_num + 1}.html" if page_num < total_pages else "#"

    # 替换模板中的占位符
    final_html = template.replace("{cards}", cards_html)
    final_html = final_html.replace("{pagination}", pagination_html)
    
    # 填充 {page_link_x} 和 {page_num_x} 占位符
    for i in range(1, total_pages + 1):
        final_html = final_html.replace(f'{{page_link_{i}}}', f'page-{i}.html')
        final_html = final_html.replace(f'{{page_num_{i}}}', str(i))

    # 替换上一页和下一页链接
    final_html = final_html.replace("{last_page}", last_page)
    final_html = final_html.replace("{next_page}", next_page)

    # 输出生成的HTML
    with open(os.path.join(page_dir, f'page-{page_num}.html'), 'w', encoding='utf-8') as output_file:
        output_file.write(final_html)

    print(f"Page {page_num} generated with pagination links: {page_links}")


# 生成分页链接（根据当前页动态调整页码）
def generate_pagination_links(current_page, total_pages):
    page_links = []
    # 设置显示页码的范围，前后各显示3页
    start_page = max(1, current_page - 3)  # 起始页码
    end_page = min(total_pages, current_page + 3)  # 结束页码

    # 如果起始页小于1，则将结束页码的范围推向前面
    if start_page > 1:
        page_links.append(f'<a href="page-1.html" class="mdui-btn mdui-btn-dense mdui-ripple mdui-color-theme">1</a>')

    # 显示前置省略页码
    if start_page > 2:
        page_links.append('...')

    # 添加页码链接
    for i in range(start_page, end_page + 1):
        if i == current_page:
            page_links.append(f'<a href="page-{i}.html" class="mdui-btn mdui-btn-dense mdui-ripple mdui-color-theme mdui-color-theme-accent">{i}</a>')
        else:
            page_links.append(f'<a href="page-{i}.html" class="mdui-btn mdui-btn-dense mdui-ripple mdui-color-theme">{i}</a>')

    # 显示后置省略页码
    if end_page < total_pages - 1:
        page_links.append('...')

    # 如果结束页大于总页数，则显示总页数
    if end_page < total_pages:
        page_links.append(f'<a href="page-{total_pages}.html" class="mdui-btn mdui-btn-dense mdui-ripple mdui-color-theme">{total_pages}</a>')

    return ' | '.join(page_links)


# 主程序：读取文章文件并生成分页
def main():
    articles = get_article_files()
    cards_per_page = 16  # 每页显示8个卡片
    total_pages = (len(articles) + cards_per_page - 1) // cards_per_page  # 计算总页数

    all_card_html = []
    for article_file in articles:
        post_title, post_img = extract_article_info(article_file)
        post_link = f"/alithefox/iieii-new/article/{article_file}"
        card_html = generate_card_html(post_link, post_img, post_title)
        all_card_html.append(card_html)

    # 生成分页文件
    for page_num in range(1, total_pages + 1):
        start_index = (page_num - 1) * cards_per_page
        end_index = min(page_num * cards_per_page, len(all_card_html))
        card_list = all_card_html[start_index:end_index]

        # 生成分页链接
        page_links = generate_pagination_links(page_num, total_pages)

        # 生成并保存分页HTML文件，传入 total_pages 参数
        generate_page_file(page_num, card_list, page_links, total_pages)

        print(f"Page {page_num} generated with pagination links: {page_links}")


if __name__ == "__main__":
    main()
