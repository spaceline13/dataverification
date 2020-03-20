import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    parents: {
        type: Array,
        required: false,
    },
    synonyms: {
        type: Array,
        required: false,
    }
});
export default mongoose.model('Product', productSchema);
