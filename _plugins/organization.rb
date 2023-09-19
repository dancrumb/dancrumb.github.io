require 'json'

class OrganizationTag < Liquid::Tag
    def initialize(tag_name, input, tokens)
      super
      @input = input
    end

    def parse_params()
      begin
          if( !@input.nil? && !@input.empty? )
            return JSON.parse(@input)
          end
          return Hash.new
        rescue
          return Hash.new
        end
    end
  
    def render(context)
      params = self.parse_params()
      name = params['name']
      url = params['url']
      if( name.nil? || name.empty? )
        return ""
      end
      output = <<-ORG
<li itemscope itemtype="https://schema.org/Organization" itemprop="memberOf">
  <a href="#{url}" itemprop="url">
    <span itemprop="name">#{name}</span>
  </a>
</li>
ORG
      return output;
    end
  end
  Liquid::Template.register_tag('organization', OrganizationTag)