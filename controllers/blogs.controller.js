const Blog = require('../models/Blogs.model')
const Comment = require('../models/comments.model');

module.exports.Createblog = async (req, res) => {
    try {
        let data = new Blog({
            title: req.body.title,
            user: req.userId,
            body: req.body.body,
            category: req.body.category
        });
        const result = await data.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`Error when trying: ${error}`);
    }
}

module.exports.addcomment = async (req, res) => {
    try {
        let data = new Comment({
            user: req.userId,
            blog: req.body.blog,
            body: req.body.body
        });
        console.log(data)
        const comment = await data.save();
        const id = comment._id;
        const result = await Blog.findOneAndUpdate({ _id: req.body.blog },
            {
                $push: {
                    comments: id
                }
            }, { new: true })

        res.status(200).json({
            success: true,
            comment, 
            result
        });

    } catch (error) {
        console.log(error)
        res.status(400).send(`Error when trying: ${error}`);
    }
};

module.exports.getblogs = async (req, res) => {
    try {
        //{ title: { $regex: req.params.title , $options: 'xsi'} }
        const data = await Blog.find()
            .select(' title category user createdAt')
            .populate({ path: 'user', select: 'fullname email ' })
            .sort({ "createdAt": -1 })
        res.status(200).json(data);

    } catch (error) {
        console.log(error)
        res.status(400).send(error);

    }
}
module.exports.getblogById = async (req, res) => {
    try {
        const data = await Blog.findById({ _id: req.params.id })
            .populate({ path: 'user', select: 'fullname email ' })
        res.status(200).json(data);

    } catch (error) {
        console.log(error)
        res.status(400).send(error);

    }
}
module.exports.getblogsbyuserID = async (req, res) => {
    try {
        const data = await Blog.find({ user: req.params.id })
        .select('title category user createdAt')
        res.status(200).json(data);

    } catch (error) {
        console.log(error)
        res.status(400).send(error);

    }
}
module.exports.getcommentsbyBlogID = async (req, res) => {
    try {
        const data = await Comment.find({ blog: req.params.id }).populate({ path: 'user', select: 'fullname email ' })
        res.status(200).json(data);

    } catch (error) {
        console.log(error)
        res.status(400).send(error);

    }
}

module.exports.Updateblog = async (req, res) => {
    try {
        const title = req.body.title;
        const body = req.body.body;
        const category = req.body.category;
        const updatedAt = Date.now();

        const data = await Blog.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                title: title,
                category: category,
                body: body,
                createdAt: updatedAt
            }
        }, { new: true });

        if (data) {
            res.status(200).json({ data });
        }
    } catch (error) {
        res.status(400).send(`Error when trying: ${error}`);
    }
};


module.exports.DeleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete({ _id: req.params.id })
        
        if(blog ){
            res.status(200).json(blog);
        }        
    } catch (error) {
        return res.status(400).json({ error });
    }
}
