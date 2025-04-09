import os
import re
from bs4 import BeautifulSoup
from collections import defaultdict

# 配置路径
article_dir = "article"
template_file = "model.html"
output_dir = "monthly_archives"
os.makedirs(output_dir, exist_ok=True)

# 卡片模板（与之前相同）
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

# 加载模板文件
with open(template_file, "r", encoding="utf-8") as f:
    template_html = f.read()

# 存储按月分类的文章
monthly_posts = defaultdict(list)

# 处理所有文章文件
post_files = sorted(
    [f for f in os.listdir(article_dir) if f.startswith("post-") and f.endswith(".html")],
    key=lambda x: int(x.split("-")[1].split(".")[0])
)

for post_file in post_files:
    with open(os.path.join(article_dir, post_file), "r", encoding="utf-8") as f:
        html = f.read()
    
    soup = BeautifulSoup(html, "html.parser")
    
    # 提取发布日期（假设格式为 YYYY-MM-DD）
    date_match = re.search(r'(\d{4})-(\d{1,2})-(\d{1,2})', html)
    if not date_match:
        print(f"⚠️ 跳过 {post_file}：未找到日期")
        continue
    
    year, month, _ = date_match.groups()
    month_key = f"{year}{int(month):02d}"  # 格式化为 2020-03
    
    # 提取文章信息
    title = soup.find("div", class_="title").h2.get_text(strip=True) if soup.find("div", class_="title") else "无标题"
    img_match = re.search(r'(https?://[^"]*360buyimg\.com[^"]*|/alithefox/iieii-old/image/[^"]+)', html)
    imglink = img_match.group(1) if img_match else "/assets/img/Logo.svg"
    sharenum = re.search(r'分享\((\d+)\)', html).group(1) if re.search(r'分享\((\d+)\)', html) else "0"
    
    # 生成卡片
    card = card_template.format(
        articlename=os.path.splitext(post_file)[0],
        title=title,
        imglink=imglink,
        sharenum=sharenum
    )
    
    monthly_posts[month_key].append(card)

# 为每个月生成文件
for month, cards in monthly_posts.items():
    # 替换模板中的内容
    output_html = template_html.replace(
        "{content}",  # 假设模板中有 {content} 占位符
        f'<h2>{month}月文章</h2>\n' + '\n'.join(cards)
    )
    
    # 保存文件
    output_path = os.path.join(output_dir, f"{month}.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(output_html)
    
    print(f"✅ 已生成 {month}.html（{len(cards)} 篇文章）")

print(f"\n🎉 归档完成！共生成 {len(monthly_posts)} 个月份文件")