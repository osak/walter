require 'mongo'
require 'set'

client = Mongo::Client.new(['localhost:27017'], database: 'tweet_reaction')
db = client.database
collection = db[:azunyan_escape]
deduped = db[:azunyan_escape_deduped]

seen = Set.new
collection.find({}).each do |tw|
  next if seen.include?(tw['id'])
  seen << tw['id']
  deduped.insert_one(tw)
end
