const Index = require('../controllers/front/index');

module.exports = function(app){
	app.get('/', Index.home);
	app.get('/navdb/:id', Index.navdb);

	app.get('/firm', Index.firm);
	app.get('/internet', Index.internet);
	app.get('/invest', Index.invest);

	app.get('/error', (req, res) => {
		const info = req.query.info; const error = req.query.error;
		res.render('./error', {title: 'Error', info, error, });
	})
	/* api ---------------------- api ---------------------------------- */
	app.get('/api/navdbs', Index.api_navdbs)
};