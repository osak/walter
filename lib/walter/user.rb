require 'json'

module Walter
  class User
    class << self
      def from_mongo_entry(entry)
        User.new(entry.symbolize_keys)
      end
    end

    attr_reader :id, :name, :screen_name

    def initialize(hash)
      @id = hash[:id]
      @name = hash[:name]
      @screen_name = hash[:screen_name]
    end

    def to_json(*args)
      {
        id: id,
        name: name,
        screenName: screen_name
      }.to_json
    end
  end
end

