const notFound = (req, res) => res.status(404).render('404',{
	pageTitle: '404 Not Found',
	msg: false,
})

module.exports = notFound
 