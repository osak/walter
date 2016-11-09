require 'mongo'
require_relative 'user'

module Walter
  class Tweet
    class << self
      def find_tweet(id)
        result = collection.find({id: id.to_i}).limit(1)
        if result.count > 0
          from_mongo_entry(result.first)
        else
          nil
        end
      end

      private
      
      def collection
        @client ||= Mongo::Client.new(['localhost:27017'], database: 'tweet_reaction')
        @collection ||= @client.database[:azunyan_escape]
      end

      def from_mongo_entry(entry)
        Tweet.new(entry.symbolize_keys)
      end
    end

    attr_reader :id, :text, :user

    def initialize(hash)
      @id = hash[:id]
      @text = hash[:text]
      @user = User.from_mongo_entry(hash[:user])
    end

    def to_json(*args)
      {
        id: id,
        text: text,
        user: user
      }.to_json
    end
  end
end

