require 'mongo'
require 'set'

client = Mongo::Client.new(['localhost:27017'], database: 'tweet_reaction')
db = client.database
collection = db[:azunyan_escape_deduped]
user_ordered = db[:azunyan_escape_users]

collection.aggregate([
  {
    '$group': {_id: '$user.screen_name', min_id: {'$min': '$id'}, tweet_count: {'$sum': 1}}
  },
  {
    '$sort': {min_id: -1}
  }
]).each do |user_spec|
  user_spec['name'] = user_spec['_id']
  user_spec.delete('_id')
  user_ordered.insert_one(user_spec)
end
