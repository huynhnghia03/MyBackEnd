module.exports = function searchTakeNotemiddleware(req, res, next) {
    res.locals._type = {
        enabled: false,
    }

    if (req.query.hasOwnProperty('_type')) {
        // res.locals._sort.enabled = true
        // res.locals._sort.type = req.query.type
        // res.locals._sort.column = req.query.column
        Object.assign(res.locals._type, {
            enabled: true,
            topicID: req.query.topic,
            courseID: req.query.course,
            type: req.query.type,
        })
    }

    next()
}