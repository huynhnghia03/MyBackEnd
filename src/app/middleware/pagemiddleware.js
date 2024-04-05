module.exports = function pagemiddleware(req, res, next) {
    res.locals.page = {
        enabled: false,
    }

    if (req.query.hasOwnProperty('page')) {
        // res.locals._sort.enabled = true
        // res.locals._sort.type = req.query.type
        // res.locals._sort.column = req.query.column
        Object.assign(res.locals.page, {
            enabled: true,
            page: req.query.page,
        })
    }

    next()
}