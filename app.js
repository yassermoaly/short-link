const express = require('express');
const db = require('./models');

const app = express();
const port = process.env.port || 3000;
const mainController = require('./controllers/main');

app.use(express.json());
app.use('/', mainController);




app.use(express.static('public'))


// app.get('/admin', (req, res) => {
//   res.redirect('index.html');
// });



db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
});

