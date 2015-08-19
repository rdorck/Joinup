Parse.initialize("mg1qP8MFKOVjykmN3Aha6Q47L6XtuNQLIyVKFutU", "jbAhu3Txusmh2fpHCBjemv87emMIn99YtAu7fhq7");
// These two lines are required to initialize Express in Cloud Code.
 express = require('express');
 app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
app.use(express.methodOverride()); // Middleware for receiving HTTP delete & put

// // reading the request query string of HTTP GET request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });
// // reading the request body of HTTP POST request.
//app.post('/test', function(req, res) {
//    // POST http://example.parseapp.com/test (with request body "message=hello")
//    res.send(req.body.message);
// });

//app.get('/hello', function(req, res) {
//  res.render('hello', { title: "Hello Partner", username: req.body.username, password: req.body.password });
//});
//app.post('/hello', function(req, res) {
//    /*
//     * --> if in PostMan, select POST, Body section enter in
//     *          { "username" : "someUsername" }
//     * res.render is taking the 'value' from our JSON {key:value}
//     */
//    res.render('hello', {title: "Hello", username: req.body.username, password:req.body.password });
//});

app.get('/categories', function(req, res) {
    var Categories = Parse.Object.extend('Category');
    var query = new Parse.Query(Categories);
    //query.equalTo("categoryName", "Manager");
    query.find({
        success: function(results){
            // do something with the 'results'
            res.send(results);
        }, error: function(error){
            res.send(error.message);
        }
    });
});

// GET, render signUp page
app.get('/signup', function(req, res) {
    res.render('signup');
});
// signup new user
app.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var sex = req.body.sex;
    var email = req.body.email;
    var phone = req.body.phone;

    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set('firstName', firstName);
    user.set('lastName', lastName);
    user.set('sex', sex);
    user.set('email', email);
    user.set('phone', phone);

    user.signUp().then(function(user) {
        res.redirect('/');
    }, function(error) {
        res.render('signup', { flash: error.message });
    });
});


// GET, render login page
app.get('/login', function(req, res) {
    res.render('login');
});
app.post('/login', function(req, res) {
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
        res.redirect('/profile');
    }, function(error) {
        res.redirect('/');
    });
});


// GET, renders dashboard (the main focal point)
app.get('/dashboard', function(req, res) {
    res.render('dashboard');
});


// Routes for adding categories
app.get('/addCategory', function(req, res) {
    res.render('addCategory');
});
app.post('/addCategory', function(req, res) {
    var categoryName = req.body.categoryName;
    var categoryImg = req.body.CategoryImg;

    var Category = Parse.Object.extend('Category');
    var category = new Category();

    category.set('categoryName', categoryName);
    category.set('categoryImg', categoryImg);

    category.save().then(function(category) {
        res.redirect('/addSubCategory');
    }, function(error) {
        res.render('addCategory', { flash: error.message });
    });
});

// Routes for adding sub-categories
app.get('/addSubCategory', function(req, res) {
    res.render('addSubCategory');
});
app.post('/addSubCategory', function(req, res) {
    var categoryParent = req.body.categoryParent;
    var subCategoryName = req.body.subCategoryName;
    var subCategoryImg = req.body.subCategoryImg;

    var SubCategory = Parse.Object.extend('SubCategory');
    var subcategory = new SubCategory();

    subcategory.set('categoryParent', categoryParent);
    subcategory.set('subCategoryName', subCategoryName);
    subcategory.set('subCategoryImg', subCategoryImg);

    subcategory.save().then(function(subcategory) {
        res.redirect('/addQuestion');
    }, function(error) {
        res.render('addSubCategory', { flash: error.message });
    });
});

// Routes for adding questions
app.get('/addQuestion', function(req, res) {
    res.render('addQuestion');
});
app.post('/addQuestion', function(req, res) {
    var parentCategory = req.body.categoryParent;
    var parentSubCategory = req.body.subCategoryParent;
    var questionText = req.body.questionText;
    var optionA = req.body.optionA;
    var optionB = req.body.optionB;
    var optionC = req.body.optionC;
    var optionD = req.body.optionD;
    var answer = req.body.answer;

    var Question = Parse.Object.extend("Question");
    var question = new Question();

    question.set('parentCategory', parentCategory);
    question.set('parentSubCategory', parentSubCategory);
    question.set('questionText', questionText);

    // appends the options array
    question.addUnique('options', optionA);
    question.addUnique('options', optionB);
    question.addUnique('options', optionC);
    question.addUnique('options', optionD);

    question.set('answer', answer);

    question.save().then(function(question) {
        res.redirect('/addQuestion');
    }, function(error) {
        res.render('addQuestion', { flash: error.message });
    });
});


// Load Settings view
app.get('/settings', function(req, res) {
    res.render('settings');
});


// Load User Profile page, our Custom Hub
app.get('/profile', function(req, res) {

   res.render('profile');
});


// Routes for user logout
app.get('/logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
});
app.post('/logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
});


// Attach the Express app to Cloud Code.
app.listen();