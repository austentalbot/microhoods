var settings = require('../config/settings.js'); 

module.exports = {  
  index: {
    handler: function(request, reply) {
      client.query(' \
        WITH tagCounts AS \
        ( \
          SELECT coordinates, tag, COUNT(*) As tagCount \
          FROM TAGS \
          GROUP BY tag, coordinates \
        ), \
        tagMax AS \
        ( \
          SELECT coordinates, MAX(tagCount) As maxTagCount \
          FROM tagCounts \
          GROUP BY coordinates \
        ) \
        SELECT c.coordinates, MAX(tag) as tag \
        FROM tagCounts AS c \
        INNER JOIN tagMax AS m on m.coordinates=c.coordinates AND c.tagCount = m.maxTagCount \
        GROUP BY c.coordinates;',
        function(err, results) {
          if (err) {
            throw err;
          }

          console.log(results.rows);
          reply(JSON.stringify(results.rows));
        }
      );
    }
  }
};
