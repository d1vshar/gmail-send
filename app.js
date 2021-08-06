const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const mailRouter = require('./routes/mail');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/mail', mailRouter);

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.json(error);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
