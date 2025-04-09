import os
import re
from bs4 import BeautifulSoup

# 文件夹路径
article_dir = "article"
page_dir = "page"
output_dir = "output_pages"  # 输出目录（可选）

# 创建输出目录
os.makedirs(output_dir, exist_ok=True)

# 定义 card 模板
card_template = '''
<div class="box">
    <div class="box_abstract" style="text-align:center;">
        <a href="/alithefox/iieii-old/article/{articlename}.html">
            <div style="height:27px; line-height:27px; overflow:hidden;">
                &nbsp;<font class="top"></font>
                <font style="font-weight:bold;">{title}</font>
            </div>
            <img src="{imglink}" />
        </a>
    </div>
    <div class="box_ps">
        <p style="margin:2px 5px; padding:0px;">
            <a href="/alithefox/iieii-old/article/{articlename}.html">分享({sharenum})</a> &nbsp;
        </p>
    </div>
</div>
'''

# 填充内容头尾
content_wrapper = '''
<div class="blank" style="height:10px;"></div>
{cards}
<div class="clear" style="height:7px;"></div>
'''

# 获取所有 post-x.html 文件（按 x 数字升序排序）
post_files = sorted(
    [f for f in os.listdir(article_dir) if f.startswith("post-") and f.endswith(".html")],
    key=lambda name: int(re.findall(r'post-(\d+)', name)[0])
)

cards_all = []

# 提取卡片数据
for post_file in post_files:
    with open(os.path.join(article_dir, post_file), "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")

    # title
    title_tag = soup.find("div", class_="title")
    title = title_tag.h2.get_text(strip=True) if title_tag else "无标题"

    # articlename
    articlename = os.path.splitext(post_file)[0]

    # imglink
    img_match = re.search(r'(https?://[^"]*360buyimg\.com[^"]*|/alithefox/iieii-old/image/[^"]+)', html)
    imglink = img_match.group(1) if img_match else "/assets/img/Logo.svg"

    # sharenum
    share_match = re.search(r'分享\((\d+)\)', html)
    sharenum = share_match.group(1) if share_match else "0"

    # 组装 card
    card = card_template.format(
        articlename=articlename,
        title=title,
        imglink=imglink,
        sharenum=sharenum
    )

    cards_all.append(card)

# 拆分为每 21 个一组
card_groups = [cards_all[i:i+21] for i in range(0, len(cards_all), 21)]

# 替换到 page-x.html 中
for idx, group in enumerate(card_groups):
    page_num = idx + 1
    page_filename = f"page-{page_num}.html"
    page_path = os.path.join(page_dir, page_filename)

    if not os.path.exists(page_path):
        print(f"⚠️ 跳过：{page_path} 不存在")
        continue

    with open(page_path, "r", encoding="utf-8") as f:
        page_html = f.read()

    full_content = content_wrapper.format(cards='\n'.join(group))
    updated_html = page_html.replace("{content}", full_content)

    # 写入新文件
    with open(os.path.join(output_dir, page_filename), "w", encoding="utf-8") as f:
        f.write(updated_html)

    print(f"✅ 已填充 {page_filename}")

