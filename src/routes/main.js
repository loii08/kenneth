const express = require('express');
const path = require('path');
const router = express.Router();

const projects = require('../data/projects.json');
const testimonials = require('../data/testimonials.json');
const blog = require('../data/blog.json');

router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Kenneth Irvin Butad | Professional Virtual Assistant',
    projects: projects,
    testimonials: testimonials,
    blog: blog,
    currentYear: new Date().getFullYear()
  });
});

module.exports = router;