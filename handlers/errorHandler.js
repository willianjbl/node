const errorHandler = {
    notFound: (req, res, next) => {
        res.status(404);
        res.render('404');
    }
};

export default errorHandler;
