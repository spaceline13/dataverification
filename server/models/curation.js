import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const curationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
});
export default mongoose.model('Curation', curationSchema);
