import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});
export default mongoose.model('Product', productSchema);
