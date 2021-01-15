import { response } from 'express';
import mongoose from 'mongoose';
const Post = mongoose.model('Post');

const homeController = {
    index: async (req, res) => {
        let dados = {
            titulo: 'Home',
            posts: [],
            tags: [],
            tag: ''
        };

        dados.tag = req.query.t;
        const postFilter = dados.tag ? {tags: dados.tag} : {};

        const tagsPromise = Post.getTagList();
        const postsPromise = Post.findPosts(postFilter);

        const [tags, posts] = await Promise.all([tagsPromise, postsPromise]);

        for (let i in tags) {
            if (tags[i]._id == dados.tag) {
                tags[i].class = 'selected';
            }
        }

        dados.tags = tags;
        dados.posts = posts;
    
        res.render('home', dados);
    }
}

export default homeController;
