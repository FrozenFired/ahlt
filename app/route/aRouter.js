const Index = require('../controllers/front/index');

module.exports = function(app){
	app.get('/', Index.home);
	app.get('/firm', Index.firm);
	app.get('/navdb/:id', Index.navdb);

	app.get('/error', (req, res) => {
		const info = req.query.info; const error = req.query.error;
		res.render('./index/error', {title: 'Error', info, error, });
	})
	/* api ---------------------- api ---------------------------------- */
	app.get('/api/navdbs', Index.api_navdbs)
};