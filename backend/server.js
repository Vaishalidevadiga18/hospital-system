const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const tokenRoutes = require('./routes/tokens');
const otRoutes = require('./routes/ot');
const drugRoutes = require('./routes/drugs');

const Token = require('./models/Token');
const OT = require('./models/OT');
const Drug = require('./models/Drug');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/tokens', tokenRoutes);
app.use('/api/ot', otRoutes);
app.use('/api/drugs', drugRoutes);

const emitAll = async () => {
  const tokens = await Token.find().sort({ createdAt: 1 });
  const ots = await OT.find();
  const drugs = await Drug.find();
  io.emit('tokensUpdated', tokens);
  io.emit('otUpdated', ots);
  io.emit('pharmacyUpdated', drugs);
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('requestInitialData', emitAll);

  socket.on('addToken', async ({ patientName, department }) => {
    if (!patientName || !department) return;
    const newToken = new Token({ patientName, department });
    await newToken.save();
    if (department === 'ot') {
      const scheduledTime = new Date(Date.now() + 30 * 60000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const newOt = new OT({
        patientName,
        scheduledTime,
        status: 'scheduled',
      });
      await newOt.save();
    }
    emitAll();
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
