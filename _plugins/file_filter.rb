module Jekyll
    class FileFilter < Liquid::Tag
      def initialize(tag_name, directory, tokens)
        super
        @directory = directory.strip
      end
  
      def render(context)
        # 获取当前站点的根目录
        site = context.registers[:site]
  
        # 获取传入的路径，确保路径中没有重复的部分
        directory_path = File.join(site.source, @directory)
  
        # 如果目录不存在，返回提示
        unless File.exist?(directory_path) && File.directory?(directory_path)
          # puts "调试信息：目录不存在：#{@directory}"
          return "目录不存在：#{@directory}"
        end
  
        # 获取该目录下的所有 .md 文件，排除 index.md
        items = Dir.entries(directory_path).select do |entry|
          entry != '.' && entry != '..' && entry.end_with?('.md') && entry != 'index.md'
        end
  
        # 用于存储生成的HTML列表
        html_output = "<ul>"
  
        # 遍历所有符合条件的 .md 文件
        items.each do |item|
          # 去掉 .md 后缀，添加 .html 后缀
          item_without_extension = File.basename(item, '.md') + '.html'
  
          # 获取该文件的 Front Matter 中的 title
          file_path = File.join(directory_path, item)
  
          # 寻找当前页面对应的文件，确保我们获取到正确的页面
          # 改进路径匹配方式，去掉 `site.source` 部分，避免直接使用绝对路径
          page = site.pages.find { |p| p.relative_path == File.join(@directory, item).gsub(/^\//, '') }
  
          # 检查是否找到了匹配的页面
          if page
            # 如果找到了该页面，并且它包含了 title
            if page.data['title']
              title = page.data['title']
            else
              title = item_without_extension
            end
          else
            title = item_without_extension
          end
  
          # 构建条目的完整路径，去掉前面的 /
          item_url = "#{@directory}/#{item_without_extension}"
  
          # 为每个文件生成链接
          html_output += "<li><a href=\"#{item_url}\">#{title}</a></li>"
        end
  
        html_output += "</ul>"
  
        html_output
      end
    end
  end
  
  # 注册标签
  Liquid::Template.register_tag('file_filter', Jekyll::FileFilter)
  