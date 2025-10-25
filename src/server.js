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
  maxAge: '1y' // Cache static assets for 1 year
}));

app.use('/', mainRoutes);
app.use('/api', apiRoutes);

// This block will only run when you start the server locally (e.g., with `npm run dev`)
// It will not run when deployed on Vercel.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio running on http://localhost:${PORT}`);
  });
}

module.exports = app;