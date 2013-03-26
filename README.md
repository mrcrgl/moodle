node-model
==========

## Install
```bash
$ npm install moodle
```

## Usage

### Create model (example file)
```javascript
var db    = require('your-mongo-instance');
var Model = require('moodle');

var User = new Model('User');

User.storage('mongodb')
    .connect(
        function() { 
            // Return your mongo instance with selected collection
            return db.users 
        }
    );

/**
 * Define attributes
 */
User.attr('_id', 'ObjectId');

User.attr('username', 'String')
    .required();

User.attr('permissions', 'Object');

User.attr('password', 'String')
    .required();

User.attr('last_login', 'Date')
    .default(null);

User.attr('status', 'Bool')
    .default(true)
    .required();

modules.export = User;

```

### Using the model
```javascript

var User = require('./models/user');

/**
 * Save new
 */
var user = new User();

user.owner("51223c75bb64ba8d60000000");
user.username("root");
user.password("secret");
user.permissions({
    wheel: true
});

user.save(function(err) {
    if (err) throw err;
    
    user._id(); // return the generated _id
    // _id
    
    console.log("saved!");
});

/**
 * Update model
 */
User.findOne({_id: "51519576d2381d38df000003"}, function(err, user) {
    if (err) throw err;
    
    user.last_login(new Date());
    user.save(function(err) {
        if (err) throw err;
    });
});

/**
 * Find multiple
 */
User.find({status:true}, function(err, users) {
    
    for (var user in users) {
        if (user instanceof User)
            // true
        
    }
    
});

```




