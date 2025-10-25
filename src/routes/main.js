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
    // Find up to 2 related posts from the same category, excluding the current one
    const relatedPosts = blog.filter(
      p => p.category === post.category && p.id !== post.id
    ).slice(0, 2);

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const postUrl = `${baseUrl}${req.originalUrl}`;

    res.render('post', { title: post.title, post: post, relatedPosts: relatedPosts, postUrl: postUrl });
  } else {
    res.status(404).render('404', { title: 'Page Not Found' });
  }
});

module.exports = router;