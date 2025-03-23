import re
import json

# 定义正则表达式
pattern = r'"hitokoto":\s*"([^"]+)"'

# 存储所有提取的结果
hitokoto_list = []

# 读取当前目录的 a.json 文件
with open('i.json', 'r', encoding='utf-8') as file:
    # 逐行读取文件
    for line in file:
        # 查找每一行中的 "hitokoto" 字段
        match = re.search(pattern, line)
        if match:
            # 提取并保存 "hitokoto" 的内容
            hitokoto_list.append(match.group(1))

# 将提取的结果保存到 hitokoto.json 文件
with open('hitokoto.json', 'w', encoding='utf-8') as output_file:
    # 将列表写入为 JSON 格式
    json.dump(hitokoto_list, output_file, ensure_ascii=False, indent=4)

print("提取完成，结果已保存到 hitokoto.json")
