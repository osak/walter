cd /app
bundle --path=vendor
mongod &
bundle exec ruby bin/main.rb
