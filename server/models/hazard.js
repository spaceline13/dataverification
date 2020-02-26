import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const hazardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});
export default mongoose.model('Hazard', hazardSchema);
