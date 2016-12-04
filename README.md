Name of Project: Story World

***** Important Note for Instructor and Graders *****
Currently the web app is running HW06 deployed on i6.cims.nyu.edu. Story World project is still under development. 
Also, the port assigned to me was used by someone else. Here I used a different port number to run this app.
In addition, the git hub repository I found under CSCI-UA.0480-001 contains some work probably by someone else as well. In any case, I created my own public git repository here to save my work.

***** Overview *****

  A user can writes stories and upload it (as an author), create a cover page for it, and bundle stories into story books (as a publisher). A user can also browse, search and read story books and stories created by other users. A user can also like stories. Ideally a user will be able to type the story or upload it locally or link it from the web. Also ideally the site will provide users' overall feedback to each story combine feedback to derive an overall feedback for story books. 

***** Data Model (just a draft) *****

  // users
  // * our site requires authentication...
  // * so users have a username and password
  // * they also can have 0 or more lists
  var User = new mongoose.Schema({
    // username, password provided by plugin
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
  });

  // a story
  // * includes the due date of this task 
  // * items past due date can be crossed off
  // * also includes a prioty, higher prioty is placed front)
  var Story = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: string, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  }, {
    _id: true
  });

  // a story book
  // * each book must have a publisher
  // * a list can have 0 or more tasks
  var Book = new mongoose.Schema({
    publisher: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    name: {type: String, required: true},
    createdAt: {type: Date, required: true},
    stories: {type: mongoose.Schema.Types.ObjectId, ref:'Story'},
  });

***** Wireframes *****

  /users/register
  register

  /users/login
  log in

  /users/stories
  list all stories created by this author (user)

  /users/likes
  list all stories liked by this user

  /users/publish
  allows the user to search stories and combine them into books

  /books
  list all books
  can search books

  /books/name-of-book/
  list all sotires within that book
  can search stories within that boook
  also allow the publisher (only the user that is the publisher of this book)
  to add and delete stories to this book

  /books/name-of-book/name-of-story/
  allows a user to read the story in detail, and like it

  /stories/search
  can search all stories

  /stories/create
  can create new stories

  /stories/name-of-story
  also allows a user to read the story in detail, and like it

***** Site Map *****

  Home page / with links to stories, books, and users (My Account, etc)
  Stories /stories
  Books /books
  Users /users

  Stories: 
    search stories /stories/search
    create stories /stories/create
    read a story /stories/name-of-story

  Books: 
    list all books /books
    go to one particular book /books/name-of-book
    go to one particular story in a book /books/name-of-book/name-of-story

  Users: 
    log in page /users/login
    register page /users/register
    show all created stories /users/stories
    show all liked stories (created by other users) /users/likes
    publish a book and put stories in it /users/publish

***** User Stories *****

  1. as a user, I can create stories
  2. as a user, I can like stories
  3. as a user, I can put stories together into a book and publish it
  4. as a user, I can edit books published by myself (add/delete stories)
  5. as a user, I can edit stories created by myself

***** Research Topics *****

  1. authenticatin (6 points)
    Basic requirement due to nature of the site. User discover others' stories.
  2. css framework throughout (2 points)
    Ease of development.
  3. functional testing (6 points)
    Ease of development, faster testing
  4. other API library and modules 
    Research in progress.

