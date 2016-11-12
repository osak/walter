require 'json'

module Walter
  class User
    class << self
      def from_mongo_entry(entry)
        User.new(entry.symbolize_keys)
      end
    end

    attr_reader :id, :name, :screen_name, :profile_image_url

    def initialize(hash)
      @id = hash[:id]
      @name = hash[:name]
      @screen_name = hash[:screen_name]
      @profile_image_url = hash[:profile_image_url]
    end

    def to_json(*args)
      {
        id: id,
        name: name,
        screenName: screen_name,
        profileImageUrl: profile_image_url
      }.to_json
    end
  end
end

