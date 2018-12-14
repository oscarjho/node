const express = require('express');
const router = express.Router();

// Bring in Models
let Article = require ('../models/article');

// Edit Single Article
router.get('/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit_article', {
            title:'Edit Article',
            article:article
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}

    Article.update(query, article, function(err){
        if (err){
            console.log(err);
            return;
        } else { 
            req.flash('warning','Article Edited')
            res.redirect('/')
        }
        });
    });

// DELETE Article
router.delete('/:id', function(req, res){
    let query = {_id:req.params.id}
    Article.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
});

// Add Articles Route
router.get('/add', function(req, res){
    res.render('add_article', {
       title: 'Add Article' 
    });
  });

// Add Article POST route
const { check, validationResult } = require('express-validator/check');

router.post('/add', [
    check('title').isLength({min:1}).trim().withMessage('Title required'),
    check('author').isLength({min:1}).trim().withMessage('Author required'),
    check('body').isLength({min:1}).trim().withMessage('Body required')
] , (req, res, next) => {

    const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('add_article',
            { 
            article:article,
            errors: errors.mapped()
            });
        } else {

            let article = new Article();
            article.title = req.body.title;
            article.author = req.body.author;
            article.body = req.body.body;

            article.save(err=>{
            if(err)throw err;
            req.flash('success','Article Added');
            res.redirect('/');
            });
        }
    
});

// Get Single Article
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('article', {
            article:article
        });
    });
});

module.exports = router;