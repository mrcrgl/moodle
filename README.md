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

## Supported storages

* MongoDB (Tested with [node-mongodb-native](https://github.com/mongodb/node-mongodb-native))
* MySQL (Tested with [node-mysql](https://github.com/felixge/node-mysql))

## Supported attribute types

* String
* Integer
* Bool
* Enum
* Id
* ObjectId
* Object
* Array
* Date

## API

### Attribute API

#### .alias()

Set an alias name for this attribute. It will be used for the error messages.

Returns the Attribute object for chaining.

#### .required(/* bool */)

Set this attribute as requirement. If a field is not required and not undefined, it will be validated.
Otherwise, if it's required, it will be validated in every case.

Returns the Attribute object for chaining.

#### .validator(/* function(self, value) {} */)

Add your own function to validate a field. This function is called with two parameters,
the current attribute instance and the value. Errors have to be pushed to self.errors.

Example:
```javascript
function(self, v) {
    if (!v instanceof Array) {
        self.errors.push("Not a valid array: "+v);
    }
}
```

Returns the Attribute object for chaining.

#### .default(/* mixed */)

Set the default value of this attribute. If a value is undefined, the default value is used.

Returns the Attribute object for chaining.

#### .option(/* string */) -> only for "Enum"

Adds a possible option to this attribute. Only added options were validated.

Returns the Attribute object for chaining.
