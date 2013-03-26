node-model
==========

## Install
```bash
$ npm install moodle
```

## Usage
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

User.attr('owner', 'ObjectId')
    .required();

User.attr('name', 'String')
    .required();

User.attr('icon', 'String');

User.attr('widgets', 'Object');

User.attr('columns', 'String')
    .required();

User.attr('priority', 'Integer')
    .default(1)
    .required();

User.attr('status', 'Bool')
    .default(true)
    .required();

modules.export = User;

```
