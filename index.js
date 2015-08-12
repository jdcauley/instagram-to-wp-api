var express = require('express'),
    request = require('request'),
    passport = require('passport'),
    InstagramStrategy = require('passport-instagram').Strategy,
    ig = require('instagram-node').instagram(),
    app = express(),
    baseUrl = 'http://localhost:3001',
    clientId = '',
    clientSecret = '',
    userData = new Object;

ig.use({
  client_id: clientId,
  client_secret: '64644aa19021421b9c300400ddf1cc6c'
});


passport.use(new InstagramStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: baseUrl + "/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    var user = {
      token: accessToken,
      refreshToken: refreshToken,
      profile: profile
    };
    return done(null, user);
  }
));

app.get('/', function(req, res){
  if(userData && userData.profile && userData.profile.username){
    console.log(userData);
    res.json({currentUser: userData.profile.username})
  } else {
    res.json({currentUser: 'none'})
  }
});

app.get('/auth/instagram', passport.authorize('instagram'));

app.get('/auth/instagram/callback', passport.authorize('instagram', { failureRedirect: '/login' }), function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.account);

    userData = req.account;
    // console.log(res);
    res.redirect('/');
});

app.get('/subscribe', function(req, res){
  var params = req.params;
  console.log(params);

  ig.add_user_subscription('http://instagram.cuberis.ultrahook.com', [userData.token], function(err, result, remaining, limit){
    if(err){
      console.log(err);
      res.jsonp(err);
    }
    if(result){
      console.log(result);
      res.jsonp(result);
    }
    if(remaining){
      console.log(remaining)
    }
    if(limit){
      console.log(limit);
    }

  });


});

app.get('inbound', function(req, res){
  var params = req.params;
  console.log(params);
  if(req.query['hub.challenge']){
    res.jsonp(req.query['hub.challenge']);
  } else {
    res.jsonp({ok: 200});
  }

});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;
});
