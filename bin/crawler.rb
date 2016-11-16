load File.expand_path('~/.twitter_token')
require 'twitter'
require 'pp'
require 'thread'
require 'mongo'
require 'active_support/time'

twitter = Twitter::REST::Client.new do |config|
  config.consumer_key = CONSUMER_KEY
  config.consumer_secret = CONSUMER_SECRET
  config.access_token = ACCESS_TOKEN
  config.access_token_secret = ACCESS_SECRET
end

mongo = Mongo::Client.new(['localhost:27017'], database: 'tweet_reaction')
collection = mongo[:azunyan_escape]
already_exists = collection.find({}, {'id' => 1}).reduce({}){|h,tw| h[tw['id'].to_i] = true; h}
p already_exists.size

BaseTweet = Struct.new(:user_id, :user_name, :tweet_id, :created)
queue = Queue.new

searcher = Thread.new do
  INITIAL_ID = 791336639951806466
  since_id = INITIAL_ID
  seen = {}
  loop do
    begin
      twitter.search('osa_k', since_id: since_id).each do |tw|
        since_id = tw.id if tw.id > since_id
        next if seen[tw.id]
        if tw.full_text.match(/osa_k’s diary/)
          queue << BaseTweet.new(tw.user.id, tw.user.screen_name, tw.id, tw.created_at)
          seen[tw.id] = true
        end
      end
    rescue Twitter::Error::TooManyRequests => e
      puts "Rate limit. Sleep 15 mins"
      sleep 60 * 15
    rescue => e
      puts "Error #{e}. Hope get well soon"
      sleep 60
    end
    sleep 10
  end
end

digger = Thread.new do
  seen = {}
  loop do
    base = queue.pop
    next if seen[base.tweet_id]
    if base.created > 5.minutes.ago
      puts "Too recent: requeue #{base.user_name} #{base.tweet_id}"
      queue << base
      next
    end
    begin
      reactions = twitter.user_timeline(base.user_id, since_id: base.tweet_id - 10, count: 200).reverse.take(4)
      reactions.each do |tw|
        puts "#{tw.user.screen_name}: #{tw.full_text}"
      end
      non_exists = reactions.reject{|tw| already_exists[tw.id]}.map(&:to_h)
      collection.insert_many(non_exists) if non_exists.size > 0
      seen[base.tweet_id] = true
    rescue Twitter::Error::TooManyRequests => e
      puts "Rate limit. Sleep 5 mins"
      queue << base
      sleep 60 * 5
    rescue Twitter::Error::Forbidden
      puts "Forbidden to see #{base.user_name} :("
    rescue => e
      puts "Error #{e}. Hope get well soon"
      queue << base
      sleep 60
    end
    sleep 1
  end
end

searcher.join
digger.join
