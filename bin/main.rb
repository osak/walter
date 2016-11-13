#!/usr/bin/env ruby

require 'sinatra'
require 'sinatra/json'
require_relative '../lib/walter'

using Walter::Cursor::Decoder

set :public_folder, 'public'

get '/api/tweets' do
  count = params['count']&.to_i || 50
  cursor = params['cursor']&.to_cursor rescue nil
  user = params['user']
  result = Walter::Tweet.find_tweets(count, cursor&.from_id, user)
  if result.last_users_id
    next_cursor = Walter::TweetCursor.new(result.last_users_id)
  end
  json tweets: result.tweets, cursor: next_cursor
end

get '/api/tweets/:id' do |id_str|
  tw = Walter::Tweet.find_tweet(id_str)
  STDERR.puts(tw.to_json)
  json tw
end
