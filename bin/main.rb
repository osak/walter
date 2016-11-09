#!/usr/bin/env ruby

require 'sinatra'
require 'sinatra/json'
require_relative '../lib/walter'

using Walter::Cursor::Decoder

get '/api/tweets' do
  count = params['count']&.to_i || 50
  cursor = params['cursor']&.to_cursor
  tweets = Walter::Tweet.find_tweets(count, cursor&.from_id)
  if tweets.size == count
    next_cursor = Walter::TweetCursor.new(tweets.last.id)
  end
  json tweets: tweets, cursor: next_cursor
end

get '/api/tweets/:id' do |id_str|
  tw = Walter::Tweet.find_tweet(id_str)
  STDERR.puts(tw.to_json)
  json tw
end
