const express = require('express');
const path = require('path');
const router = express.Router();

const projects = require('../data/projects.json');
// const testimonials = require('../data/testimonials.json');
const blog = require('../data/blog.json');

router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Kenneth Irvin Butad | Professional Virtual Assistant',
    projects: projects,
    // testimonials: testimonials,
    blog: blog,
    currentYear: new Date().getFullYear()
  });
});

router.get('/blog/:slug', (req, res) => {
  const post = blog.find(p => p.slug === req.params.slug);
  if (post) {
    res.render('post', { title: post.title, post: post });
  } else {
    res.status(404).render('404', { title: 'Page Not Found' });
  }
});

module.exports = router;