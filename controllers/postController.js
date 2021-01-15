import mongoose from 'mongoose';
import slug from 'slug';
const Post = mongoose.model('Post');

const postController = {
    add: (req, res) => {
        const dados = {
            titulo: 'Adicionar Post'
        };

        res.render('postAdd', dados);
    },
    addAction: async (req, res) => {
        req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
        req.body.author = req.user._id;
        const post = new Post(req.body);
        
        try {
            await post.save();
        } catch (error) {
            req.flash('error', `Erro: ${error.message}`);
            return res.redirect('/post/add');
        }

        req.flash('success', 'Post added successfully!');
        res.redirect('/');
    },
    edit: async (req, res) => {
        const post = await Post.findOne({slug: req.params.slug});

        res.render('postEdit', {post})
    },
    editAction: async (req, res) => {
        req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
        req.body.slug = slug(req.body.title, {lower: true});

        try {
            const post = await Post.findOneAndUpdate(
                {slug: req.params.slug},
                req.body,
                {new: true, runValidators: true}
            );
        } catch (error) {
            req.flash('error', `Erro: ${error.message}`);
            return res.redirect(`/post/${req.params.slug}/edit`);
        }

        req.flash('success', 'Post updated successfully');
        res.redirect('/');
    },
    view: async (req, res) => {
        const post = await Post.findOne({slug: req.params.slug});

        res.render('postView', {post})
    }
};

export default postController;
