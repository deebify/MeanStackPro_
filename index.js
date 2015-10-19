var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose');
/**
 * Setting up db
 */
mongoose.connect('mongodb://localhost:27017/meandb');
//Let app use the package

//Middleware
app.use(morgan('dev')); // the morgan console
//for body parser and post requests
app.use(bodyParser.urlencoded({extended:1}));
app.use(bodyParser.json());

//for CORS
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

//---------------------------------------------------
app.get('/',function(req,res){
    res.status(200).sendFile(path.join(__dirname+'/index.html'))
});

/**
 * My Routes and let app use it
 */
var api = require('./routes/api_routes.js').APIs_router;
app.use('/api',api);
/**
 * Calling and Configuring our package
 * App Configuration
 */


//Routes is to Sections the URLs in Application
//using Express Router ...
/**
 * you need to organize the Router --
 *      say u have a multiple section (Administration / Front-end ) sections ..
 *      each with multiple routes
 *      SO ---> use Express Router as mini application ..
 *
 *      Setting it up
 *          1-create a router instance.
 *          2-apply routes to the instance.
 *          3-let the app use this router
 */
//  #TODO 1-defining the router instance
var admin_r = express.Router();

/**
 * Route Middleware that will happen on every request
 * Router middleware -- some kind of do something before request is processed ..
 *          --> logging..
 *          --> check if user is authenticated ..
 *          Anything before split the information out to the users ..
 *
 *          HOW it works -- by add middleware to the Router instance
 *
 * Optionally Apply router middleware ..
 * will execute on every request..
 *
 * BUT it required for authentication resource before send it out
 */

//admin_r TODO route middleware
admin_r.use(function(req,res,next){
    console.log(req.method+" -- " +req.url);
    next();//continue work in routing
});

//  #TODO 2-Apply some routes to this router
admin_r.get('/',function(req,res){
    res.status(200).send('Admin section dashboard ..');
});
admin_r.get('/users',function(req,res){
    res.status(200).send('Here\'s list of all users inside the system');
});
admin_r.get('/posts',function(req,res){
    res.status(200).send('Here\'s all posts and linked to users');
});
// TODO -- define the route parameters
/**
 * Parameters Routers ..
 *          say /admin/users/deeb where 'deeb' is name of a user inside the system //
 *
 *          we need to pass username to URL to fetch its data from database for example
 *
 *          HOW it WORKS -- >
 *              #TODO - Validate the parameters by "param middleware" .param('param',validation_function_callback)
 *              #TODO - placed before the request processing
 *              #TODO validate a "tokens" and make sure the user is able to access your information.
 */
//      TODO -- Validation the param 'name'
admin_r.param('name',function(req,res,next,param) {
    // TODO -- do some validation ..
    console.log(param + ' is requested');
    req.username = param;
    next();
});
//      TODO -- Processes the route parameter after validation middleware
admin_r.get('/users/:name',function(req,res){
    /**
     *      req.params --> has all parameters about the request
     */
    res.status(200).send('Data about user -- '+req.username);
});

//  #TODO 3-Let App use this router
app.use('/admin',admin_r);



//--------------------------------------------------------------------------------------------------------------------

/**
 * TODO -- apply multiple action on single route endpoint such GET/POST/PUT/DELETE
 *  NO instantiation of express.Router() -- TODO use app.route('route_url')
 *  use can use the express instance (app)  app.route('url').get(),post().put().delete() as pipeline
 *
 */
// TODO ---   Multiple Actions (GET/POST/PUT/DELETE) to single endpoint router name

//validation TODO middleware
app.use(function(req,res,next){
    //Do some validation to the router.
    console.log('Route .. '+req.url);
    next();
});


app.route('/login')
    .get(function(req,res,next){
       res.status(200).send('Login to the System ...');
    })
    .post(function(req,res,next){
       res.status(200).send('Posted to the system ..');
    });


app.listen(8080);