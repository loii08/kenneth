require('dotenv').config();
const express = require('express');
const path = require('path');
const mainRoutes = require('./routes/main');
const apiRoutes = require('./routes/api');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y'
}));

app.use('/', mainRoutes);
app.use('/api', apiRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio running on http://localhost:${PORT}`);
  });
}

module.exports = app;