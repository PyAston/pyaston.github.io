import os
import re
from bs4 import BeautifulSoup

# 文件夹路径
article_dir = "article"
output_file = "all_posts.html"  # 输出文件名

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
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>所有文章</title>
</head>
<body>
<div class="container">
<div class="blank" style="height:10px;"></div>
{cards}
<div class="clear" style="height:7px;"></div>
</div>
</body>
</html>
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

# 将所有卡片组合成一个HTML文件
full_content = content_wrapper.format(cards='\n'.join(cards_all))

# 写入新文件
with open(output_file, "w", encoding="utf-8") as f:
    f.write(full_content)

print(f"✅ 已将所有 {len(cards_all)} 篇文章写入 {output_file}")