module Walter
  class Cursor
    class << self
      def decode(str)
        key, val = str.to_s.split('-')
        klass = impl[key]
        if klass
          klass.new(val)
        else
          raise InvalidCursorError, "Invalid cursor string: #{str}"
        end
      end

      def inherited(klass)
        add_impl(klass)
      end

      private

      def impl
        @@impl ||= @@impl_classes.reduce(Hash.new){|h, k| h[k.key] = k; h}
      end

      def add_impl(klass)
        @@impl_classes ||= []
        @@impl_classes << klass
        @@impl_hash = nil
      end
    end

    def encode
      "#{self.class.key}-#{payload}"
    end

    def to_json(*args)
      encode.to_json
    end

    module Decoder
      refine String do
        def to_cursor
          Walter::Cursor.decode(self)
        end
      end
    end
  end

  class TweetCursor < Cursor
    def self.key
      'tweet'
    end

    attr_reader :from_id

    def initialize(val)
      @from_id = val.to_i
    end

    protected

    def payload
      @from_id
    end
  end
end
