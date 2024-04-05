module.exports = function searchCommentmiddleware(req, res, next) {
    res.locals._comment = {
        enabled: false,
    }

    if (req.query.hasOwnProperty('_comment')) {
        // res.locals._sort.enabled = true
        // res.locals._sort.type = req.query.type
        // res.locals._sort.column = req.query.column
        Object.assign(res.locals._type, {
            enabled: true,
            courseID: req.query.courseID,
            replyID: req.query.replyID,
            type: req.query.type,
            page: req.query.page,
        })
    }

    next()
}