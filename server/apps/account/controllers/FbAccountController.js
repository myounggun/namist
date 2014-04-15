var Account = require('../model/Account'),
    appConfig = {
        clientID  : '236906433099932',
        clientSecret : '7c2dd36b4a71a1ab3d7500c8760538ae',
        callbackURL : 'http://localhost:3000/account/facebook/callback',
        passReqToCallback : true
    };

function onResponseFromFB (req, accessToken, refreshToken, profile, done) {
    if(!req.user){
        //new user
        registerNewUser(req, accessToken, refreshToken, profile, done);
    }else{
        //existing user
        updateExistingUser(req, accessToken, refreshToken, profile, done);
    }
};

function registerNewUser (req, accessToken, refreshToken, profile, done) {
    Account.findOne({'facebook.id' : profile.id}, function(err, user){
        if(err){
            return done(err);
        }

        if(user){
            //goto updateExistingUser
            return done(null, user);
        }
        else{
            var newUser = new Account();

            newUser.facebook.id = profile.id;
            newUser.facebook.token = accessToken;
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;

            newUser.username = profile.name.givenName;
            newUser.authentication = true;
            newUser.email = profile.emails[0].value;

            newUser.save(function(err){
                if(err){
                    throw err;
                }
                else{
                    //goto updateExistingUser
                    return done(null, newUser);
                }
            });
        }
    });
}

function updateExistingUser (req, accessToken, refreshToken, profile, done) {
    var user = req.user;

    user.facebook.id = profile.id;
    user.facebook.token = accessToken;
    user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
    user.facebook.email = profile.emails[0].value;

    user.username = profile.name.givenName;
    user.authentication = true;
    user.email = profile.emails[0].value;

    user.save(function(err){
        if(err){
            throw err;
        }
        else{
            return done(null, user);
        }
    });
}

exports.appConfig = appConfig;
exports.onResponseFromFB = onResponseFromFB;