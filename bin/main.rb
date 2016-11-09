#!/usr/bin/env ruby

require 'sinatra'
require 'sinatra/json'
require_relative '../lib/walter'

get '/api/tweet/:id' do |id_str|
  tw = Walter::Tweet.find_tweet(id_str)
  STDERR.puts(tw.to_json)
  json tw
end

