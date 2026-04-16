const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const { sequelize } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev')); // logs requests to console

// use the routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    console.log('db connected successfully');
    app.listen(PORT, () => {
        console.log(`Server listning on port ${PORT}`);
    });
}).catch(err => {
    console.log('error connecting db: ', err);
});
