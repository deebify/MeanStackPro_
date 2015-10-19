var express  = require('express'),
    apiRouter = express.Router(),
    User = require('../models/User.js').user;
//Test User
var a = new User({
    username:'deeb',
    password:'deeb'
});

//TODO like middleware
apiRouter.use(function(req,res,next){
    console.log('Accessing : '+req.url);
    next();
});

//now the apiRouter is basics router get for testing purpose
apiRouter.get('/', function (req,res) {
    res.json(
        {status:200,message:'Welcome to Our APIs'}
    );
});
apiRouter.get('/fetch', function (req,res) {
   res.json(
       {status:200,message:'Fetching data from database',user:a}
   );
});
apiRouter.get('/save',function(req,res){
    a.save(function (err,data) {
        if(err)
            res.json({code:500,'message':err});
        else{
            res.json({code:'200',message:'Saved into DB',user:data});
        }
    });
});

/**
 * the following route for getting all users and creating user
 */

apiRouter.route('/users')
    .post(function (req, res) {
        var user = new User();

        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function (err, data) {
            if(err)
                res.json({code:500,message:err});
            else{
                res.json({code:200,message:data});
            }
        })

    })
    .get(function (req, res) {
        User.find(function (err, data) {
            if(err)
                res.json({'code':500,message:err});
            else{
                res.json({code:200,message:data});
            }
        })
    });

//Single route of specific route /api/users/:userid
apiRouter.route('/users/:username')
    .get(function (req, res) {
        User.findOne({'username':req.params.username}, function (err, data) {
            if(err)
                res.json({code:500,message:err});
            else{
                if(data != null)
                    res.json({code:200,message:data});
                else
                    res.json({code:500,message:'not in db'});

            }
        })
    })
    .put(function (req, res) {
       User.findOne({'username':req.params.username}, function (err,user) {
           if(err)
            res.json({code:500,message:err})
           else{
               if(req.body.username)
                user.username = req.body.username;
               if(req.body.password)
                user.password = req.body.password;

               user.save(function (err, data) {
                   if(err)
                    res.json({code:500,message:err});
                   else
                    res.json({code:200,message:data});
               })

           }
       })
    })
    .delete(function (req, res) {
        User.remove({'username':req.params.username}, function (err, user) {
            if(err)
                res.json({code:500,message:err});
            else{
                res.json({code:200,message:user});
            }
        })
    });

module.exports.APIs_router = apiRouter;