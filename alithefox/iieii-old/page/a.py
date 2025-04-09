import os

# 模板文件名
template_file = "model.html"
# 生成页面的范围
start_page = 5
end_page = 34
# 总页数（用于尾页跳转等）
max_page = 38

# 读取模板内容
with open(template_file, "r", encoding="utf-8") as f:
    template_content = f.read()

# 循环生成每一页
for page in range(start_page, end_page + 1):
    current = page
    lastpage = max(current - 1, 1)
    lastpage1 = max(current - 1, 1)
    lastpage2 = max(current - 2, 1)
    lastpage3 = max(current - 3, 1)
    nextpage = min(current + 1, max_page)
    nextpage1 = min(current + 1, max_page)
    nextpage2 = min(current + 2, max_page)
    nextpage3 = min(current + 3, max_page)

    new_content = template_content
    new_content = new_content.replace("{currentpage}", str(current))
    new_content = new_content.replace("{lastpage}", str(lastpage))
    new_content = new_content.replace("{lastpage1}", str(lastpage1))
    new_content = new_content.replace("{lastpage2}", str(lastpage2))
    new_content = new_content.replace("{lastpage3}", str(lastpage3))
    new_content = new_content.replace("{nextpage}", str(nextpage))
    new_content = new_content.replace("{nextpage1}", str(nextpage1))
    new_content = new_content.replace("{nextpage2}", str(nextpage2))
    new_content = new_content.replace("{nextpage3}", str(nextpage3))

    output_filename = f"page-{current}.html"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ 生成: {output_filename}")
