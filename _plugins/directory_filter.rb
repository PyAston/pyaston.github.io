module Jekyll
  class DirectoryFilter < Liquid::Tag
    def initialize(tag_name, directory, tokens)
      super
      # 去掉路径开头的斜杠
      @directory = directory.strip.sub(/^\/(.*)$/, '\1')  # 只去掉开头的斜杠
    end

    def render(context)
      # 获取当前站点的根目录
      site = context.registers[:site]

      # 获取传入的路径
      directory_path = File.join(site.source, @directory)

      # 如果目录不存在，返回提示
      unless File.exist?(directory_path) && File.directory?(directory_path)
        return "目录不存在：#{@directory}"
      end

      # 获取该目录下的所有文件和文件夹
      items = Dir.entries(directory_path).select { |entry| entry != '.' && entry != '..' && File.directory?(File.join(directory_path, entry)) }

      # 用于存储生成的HTML列表
      html_output = ""

      # 遍历所有文件夹
      items.each do |item|
        item_path = File.join(@directory, item)
        item_url = item_path.gsub(site.source, '')  # 转换为相对URL

        # 处理文件夹内的 index.md 文件
        index_file_path = File.join(directory_path, item, 'index.md')
        title = item  # 默认使用文件夹名称

        # 如果文件夹下有 index.md 文件
        if File.exist?(index_file_path)
          # 手动查找页面
          found_page = site.pages.find do |page|
            page.path == File.join(@directory, item, 'index.md')
          end
          
          if found_page
            title = found_page.data['title'] || item  # 如果没有 title，使用文件夹名
          end
        end

        # 在这里生成每个 li 标签
        html_output += "<ul><li><a href=\"/#{item_url}/index.html\">#{title}</a></li></ul>"
      end

      html_output
    end
  end
end

# 注册标签
Liquid::Template.register_tag('directory_filter', Jekyll::DirectoryFilter)
