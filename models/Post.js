import mongoose from 'mongoose';
import slug from 'slug';

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
    photo: String,
    title: {
        type: String,
        trim: true,
        required: 'O post precisa de um título'
    },
    slug: String,
    body: {
        type: String,
        trim: true
    },
    tags: [String],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

postSchema.pre('save', async function(next) {
    if (this.isModified('title')) {
        this.slug = slug(this.title, {lower: true});

        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,})?)$`, 'i');
        const postsWithSlug = await this.constructor.find({slug: slugRegex});
        
        if (postsWithSlug.length > 0) {
            this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
        }
    }

    next();
});

postSchema.statics.getTagList = function() {
    return this.aggregate([
        {$unwind: '$tags'},
        {$group: {_id: '$tags', count: {$sum: 1}}},
        {$sort: {count: -1}}
    ]);
};

postSchema.statics.findPosts = function(filter = {}) {
    return this.find(filter).populate('author');

    // return this.aggregate([
    //     {$match: filter},
    //     {$lookup: {
    //         from: 'users',
    //         let: {'author': '$author'},
    //         pipeline: [
    //             {$match: {
    //                 $expr: {
    //                     $eq: ['$$author', '$_id']}
    //                 }
    //             },
    //             {$limit: 1}
    //         ],
    //         as: 'author'
    //     }},
    //     {$addFields: {
    //         'author': {$arrayElemAt: ['$author', 0]}
    //     }}
    // ]);
};

const Post = mongoose.model('Post', postSchema);

export default Post;
