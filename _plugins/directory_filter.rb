module Jekyll
    class DirectoryFilter < Liquid::Tag
      def initialize(tag_name, text, tokens)
        super
      end
  
      def render(context)
        # 目录路径，直接从 _ham 获取根目录
        directory_path = File.join(Dir.pwd, '_ham')
  
        # 调试信息：打印当前目录路径
        puts "DEBUG: Rendering directory for: #{directory_path}"
  
        # 获取目录中的文件和子目录
        items = Dir.entries(directory_path).reject { |entry| entry.start_with?('.') }
  
        # 调试信息：打印找到的文件和目录
        puts "DEBUG: Items found in directory: #{items}"
  
        html = ""
  
        items.each do |item|
          item_path = File.join('_ham', item)
  
          # 如果是文件夹，生成一个独立的 ul 和 li
          if File.directory?(File.join(directory_path, item))
            html += "<ul><li><a href='/ham/#{item}/'>#{item}</a></li></ul>"
          elsif item.end_with?('.md')
            # 查找与 md 文件相应的页面，使用 permalink 查找
            page = context.registers[:site].pages.find { |p| p.data['permalink'] == "/ham/#{item.sub('.md', '')}" }
  
            if page
              html += "<ul><li><a href='#{page.data['permalink']}'>#{page.data['title']}</a></li></ul>"
            else
              puts "DEBUG: Page not found for #{item}"
            end
          end
        end
  
        html
      end
    end
  end
  
  Liquid::Template.register_tag('directory', Jekyll::DirectoryFilter)
  