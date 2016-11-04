Name of Project: Task Management

Overview

A user can register or log in and enter his/her tasks. The site will show completed tasks and pending tasks with due dates and priority. The user can manage his/her task lists by grouping them and adding and removing them: creating new tasks with a group, grouping tasks by kinds, etc..

Data Model (just a draft)

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
var User = new mongoose.Schema({
  // username, password provided by plugin
  lists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

// a task
// * includes the due date of this task 
// * items past due date can be crossed off
// * also includes a prioty, higher prioty is placed front)
var Task = new mongoose.Schema({
  name: {type: String, required: true},
  due: {type: Number, min: 1, required: true},
  priority: {type: Number, min: 1, required: false},
  checked: {type: Boolean, default: false, required: true}
}, {
  _id: true
});

// a task list
// * each list must have a related user
// * a list can have 0 or more tasks
var List = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
  createdAt: {type: Date, required: true},
  tasks: [Task]
});

