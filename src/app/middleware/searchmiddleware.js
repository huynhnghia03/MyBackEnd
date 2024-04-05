module.exports = function searchmiddleware(req, res, next) {
    res.locals.search = {
        enabled: false,
    }

    if (req.query.hasOwnProperty('q')) {
        // res.locals._sort.enabled = true
        // res.locals._sort.type = req.query.type
        // res.locals._sort.column = req.query.column
        Object.assign(res.locals.search, {
            enabled: true,
            search: req.query.search,
        })
    }

    next()
}