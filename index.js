const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
const wallRoutes = require('./src/routes/wallRoutes');
const imageRoutes = require('./src/routes/imageRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', wallRoutes);
app.use('/api', imageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
