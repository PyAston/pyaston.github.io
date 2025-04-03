import os

def list_files_without_warning(directory):
    files_without_warning = []
    
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        
        if os.path.isfile(file_path):
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
                if "评论(0)" not in content:
                    files_without_warning.append(filename)
    
    return files_without_warning

# 设定 article 目录
article_directory = "./"
result = list_files_without_warning(article_directory)

# 输出结果
for file in result:
    print(file)
