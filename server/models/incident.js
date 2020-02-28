import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const incidentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
        dropDups: true,
    },
    user: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    products: {
        type: Array,
        required: true,
    },
    hazards: {
        type: Array,
        required: true,
    },
    country: {
        type: Array,
        required: false,
    },
    supplier: {
        type: Array,
        required: false,
    },
});
export default mongoose.model('Incident', incidentSchema);
