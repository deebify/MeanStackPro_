var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');
var UserSchema = new schema(
    {
        'username' : {type:String,required:1,index:{unique:1}},
        //index-unique to ensure no duplication in users name
        'password' : {type:String,required:1,select:0}
    }
);
//Configuring Schema ..
/**
 * initializing the user before saving into mongo db
 */
UserSchema.pre('save',function(next){

    //this mean that current user will be saved into db
    var user = this;


    //password has been changed
    if(!user.isModified('password'))
        return next();

    //generate the hashed password
    bcrypt.hash(user.password,null,null, function (err,hash) {
        if(err)
            next(err);
        else {
            user.password = hash;
            next();
        }
    });

});


//method to compare 2 hash password
UserSchema.method.compareHashPassword = function (password) {
    return bcrypt.compareSync(password,this.password)
};
var user_model = mongoose.model('User',UserSchema)

module.exports.user = user_model;