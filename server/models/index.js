import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV == 'TEST') {
    mongoose.connect(process.env.TEST_DB_URI);
} else {
    mongoose.connect('mongodb://localhost/twilio2fawebtest_db');
}
const newMongoose = mongoose
export {newMongoose as mongoose};