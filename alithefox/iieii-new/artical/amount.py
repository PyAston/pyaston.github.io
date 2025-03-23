import re

# 读取 index.html 文件
with open('input.html', 'r', encoding='utf-8') as file:
    content = file.read()

# 使用正则表达式提取所有 >第x封< 的内容
pattern = r">第(.*?)封<"
matches = re.findall(pattern, content)

# 将提取到的结果写入到 amount.txt 文件
with open('amount.txt', 'w', encoding='utf-8') as output_file:
    for match in matches:
        output_file.write(match + '\n')

print("提取完成，结果已保存到 amount.txt")
