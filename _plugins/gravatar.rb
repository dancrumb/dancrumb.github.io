require 'json'

class GravatarTag < Liquid::Tag
    def initialize(tag_name, input, tokens)
      super
      @input = input
    end
    def split_params(params)
      params.split("|")
    end
  
    def render(context)
      input_split = split_params(@input)
      email = input_split[0].strip.downcase
      name = input_split[1].strip
      size = (input_split[2] || "200").strip.to_i

      if( email.nil? || email.empty? )
        return ""
      end
      hash = Digest::MD5.hexdigest(email)
      url = "https://www.gravatar.com/avatar/#{hash}"
      output = <<-GRAVATAR
<img src="#{url}?s=#{size}" alt="#{name}" class="gravatar" itemprop="image"/>
GRAVATAR
      return output;
    end
  end

class HoverBoardTag < Liquid::Tag
  def render(context)
    return <<-HOVERBOARD
    <script src="https://www.gravatar.com/js/hovercards/hovercards.min.js"></script>
    <script>
      (function () {
        function init() {
          Gravatar.init();
        }
  
        if (document.readyState !== "loading") {
          init();
        } else {
          document.addEventListener("DOMContentLoaded", init);
        }
      })();
    </script>
HOVERBOARD

  end
end

Liquid::Template.register_tag('gravatar', GravatarTag)
Liquid::Template.register_tag('gravatar_hoverboard', HoverBoardTag)