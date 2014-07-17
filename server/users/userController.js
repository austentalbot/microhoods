var settings = require('../config/settings.js');  

String.prototype.supplant = function(o) {
  return this.replace(/{([^{}]*)}/g,
    function (a, b) {
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
};

var addTag=function(user, tag, coord) {
  //coordinates passed in as array of [lat, lng]
  client.query("INSERT INTO TAGS (user_id, tag, coordinates) VALUES( \
    (SELECT user_id FROM USERS \
    WHERE username='{userName}'), \
    '{tagName}', \
    '{coordinates})');".supplant({userName: user, tagName: tag, coordinates: coord})
  );
}

module.exports = { 
  index: { 
    handler: function(request, reply) { 
      reply.file(settings.root + '/www/index.html');
    }
  }, 
  addTag: {
    handler: function(request, reply) {
      console.log(request.payload);
      //loop over each coordinate
      for (var coord in request.payload) {
        //loop over each tag
        for (var i=0; i<request.payload[coord].length; i++) {
          //add tag
          addTag('Forest', request.payload[coord][i], coord);
          console.log('saved!');
        }
      }
    }, 
    payload: {
      parse: true
    }

    // handler: function(request, reply) {
    //   function(userName, tagName, coordinates) {
    //     //coordinates passed in as array of [lat, lng]
        // client.query('INSERT INTO TAGS (user_id, tag, coordinates) VALUES( \
        //   (SELECT user_id FROM USERS \
        //   WHERE username="{userName}"), \
        //   "{tagName}", \
        //   "{coordinates})");'.supplant({
        //     // userName: userName, 
        //     userName: 'Forest', 
        //     tagName: tagName, 
        //     coordinates: coordinates
    //     }));
    //   }
    // }
  }
};
