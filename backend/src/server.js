require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/threatchronicle';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`[ThreatChronicle] Connected to MongoDB at ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`[ThreatChronicle Engine] Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[ThreatChronicle] MongoDB connection failure:', err);
    process.exit(1);
  });
