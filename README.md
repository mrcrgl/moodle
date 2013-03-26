node-model
==========

## Install
```bash
$ npm install moodle
```

## Usage
```javascript
var Model = require('moodle');

var Dashboard = new Model('Dashboard');

Dashboard.storage('mongodb')
    .connect(function() { return db.dashboards });

Dashboard.attr('_id', 'ObjectId');

Dashboard.attr('owner', 'ObjectId')
    .required();

Dashboard.attr('name', 'String')
    .required();

Dashboard.attr('icon', 'String');

Dashboard.attr('widgets', 'Object');

Dashboard.attr('columns', 'String')
    .required();


Dashboard.attr('priority', 'Integer')
    .default(1)
    .required();

Dashboard.attr('status', 'Bool')
    .default(true)
    .required();

```