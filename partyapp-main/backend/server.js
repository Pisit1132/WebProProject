const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://yun12348:Yun051245@cluster0.xyrqju1.mongodb.net/User?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
}, { collection: 'User' });

const User = mongoose.model('User', UserSchema);

const SurveySchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    question: String,
    answer: String
});

const Survey = mongoose.model('Survey', SurveySchema);

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventId: String,
    amount: Number,
    specialRequest: String,
    date: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', BookingSchema);

const EventSchema = new mongoose.Schema({
    name: String,
    match: Number,
    status: String,
    image: String,
    location: String
});

const Event = mongoose.model('Event', EventSchema);

const JWT_SECRET = '1234';

app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send('User created');
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/survey', async (req, res) => {
    const { question, answer } = req.body;
    const survey = new Survey({ userId: req.userId, question, answer });
    await survey.save();
    
    await User.updateOne({ _id: req.userId }, { surveyCompleted: true }); // Update surveyCompleted flag
    res.status(201).send('Survey stored');
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      const surveyCompleted = await Survey.findOne({ userId: user._id }) !== null;
      res.json({ token, surveyCompleted });
    } else {
      res.status(400).send('Invalid credentials');
    }
  });
  

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.userId = verified.userId;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).send('Invalid Token');
    }
};

app.get('/events', verifyToken, async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        console.error('Fetch events error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});
app.get('/events/:id', verifyToken, async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Fetch event details error:', error);
        res.status(500).json({ error: 'Failed to fetch event details' });
    }
});
app.post('/book', verifyToken, async (req, res) => {
    try {
        const { eventId, amount, specialRequest } = req.body;

        const booking = new Booking({
            userId: req.userId,
            eventId,
            amount,
            specialRequest,
            date: new Date()
        });

        await booking.save();

        res.status(201).send('Booking confirmed');
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).send('Failed to confirm booking');
    }
});

// Fetch user history
app.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await Booking.find({ userId: req.userId });
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error); // Log the error
    res.status(500).send('Failed to fetch history');
  }
});

// Fetch user profile
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ profile: user });
  } catch (error) {
    console.error('Error fetching profile:', error); // Log the error
    res.status(500).send('Failed to fetch profile');
  }
});

// Update user profile
app.put('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    res.json({ profile: user });
  } catch (error) {
    console.error('Error updating profile:', error); // Log the error
    res.status(500).send('Failed to update profile');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
