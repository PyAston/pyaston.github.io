module Jekyll
  class DirectoryFilter < Liquid::Tag
    def initialize(tag_name, directory_path, tokens)
      super
      @directory_path = directory_path.strip
    end

    def render(context)
      # 获取站点的根路径
      site_path = context.registers[:site].config['source']
      full_path = File.join(site_path, @directory_path)

      # 检查目录是否存在
      if !Dir.exist?(full_path)
        return "目录 #{@directory_path} 不存在"
      end

      # 获取目录中的文件夹
      folders = Dir.entries(full_path).select { |entry| File.directory?(File.join(full_path, entry)) && !(entry == '.' || entry == '..') }

      # 如果没有文件夹，返回相应消息
      if folders.empty?
        return "该目录下没有文件夹"
      end

      # 生成每个文件夹的 <ul><li><a href="...">...</a></li></ul> 结构
      folders_html = folders.map do |folder|
        folder_path = File.join(@directory_path, folder)
        "<ul><li><a href=\"#{folder_path}\">#{folder}</a></li></ul>"
      end.join("\n")

      folders_html
    end
  end
end

# 注册插件
Liquid::Template.register_tag('directory_filter', Jekyll::DirectoryFilter)
