require 'mongo'
require 'time'
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

      FindTweetsResult = Struct.new(:tweets, :last_users_id)
      def find_tweets(count, from_users_id = nil, screen_name)
        condition = Hash.new
        screen_names = []
        last_id = nil
        if screen_name
          screen_names << screen_name.to_s
        else
          cnt = 0
          each_user_specs(from_users_id) do |user_spec|
            cnt += user_spec['tweet_count']
            if cnt > count
              break
            else
              last_id = user_spec['_id']
              screen_names << user_spec['name']
            end
          end
        end
        result = collection.find('user.screen_name': {'$in': screen_names}).sort(id: -1).limit(count.to_i)
        FindTweetsResult.new(result.map{|r| from_mongo_entry(r)}, last_id)
      end

      private
      
      def client
        @client ||= Mongo::Client.new(['localhost:27017'], database: 'tweet_reaction')
      end

      def collection
        @collection ||= client.database[:azunyan_escape_deduped]
      end

      def users_collection
        @users_collection ||= client.database[:azunyan_escape_users]
      end

      def each_user_specs(from_id = nil, &callback)
        cond = {}
        if from_id
          cond[:_id] = {'$gt': BSON::ObjectId.from_string(from_id.to_s)}
        end
        users_collection.find(cond).sort({min_id: -1}).each(&callback)
      end

      def from_mongo_entry(entry)
        Tweet.new(entry.deep_symbolize_keys)
      end
    end

    attr_reader :id, :text, :user, :timestamp, :is_blog_mention

    def initialize(hash)
      @id = hash[:id]
      @text = hash[:text].gsub(/&lt;/, '<').gsub(/&gt;/, '>').gsub(/&amp;/, '&')
      @user = User.from_mongo_entry(hash[:user])
      @timestamp = Time.parse(hash[:created_at])
      @is_blog_mention = hash[:entities][:urls].any?{|obj| obj[:expanded_url].index('osak.hatenablog.jp')}
    end

    def to_json(*args)
      {
        id: id,
        text: text,
        user: user,
        timestamp: timestamp.to_i,
        isBlogMention: is_blog_mention,
      }.to_json
    end
  end
end

