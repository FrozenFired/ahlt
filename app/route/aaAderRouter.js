const Index = require('../controllers/ader/index');

const Ader = require('../controllers/ader/ader'); // ct control
const Navdb = require('../controllers/ader/navdb');
const Home = require('../controllers/ader/home');

const MdFiles = require('../middle/filesLocal');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	/* index --------------- Ader 首页 登录页面 登录 登出---------------------- */
	app.get('/ader', Index.aderHome);
	app.get('/aderLogin', Index.aderLogin);
	app.post('/loginAder', Index.loginAder);
	app.get('/aderLogout', Index.aderLogout);

	/* index -------------------- 添加删除(后期要关闭) ----------------------------- */
	app.get('/aderAdd', Ader.aderAdd);
	app.post('/aderNew', Ader.aderNew);
	app.get('/aderDel/:id', aderIsLogin, Ader.aderDel);

	app.get('/aders', aderIsLogin, Ader.aders);
	app.get('/ader/:id', aderIsLogin, Ader.ader);

	/* navdb ---------------------- navdb ---------------------------------- */
	app.get('/adHomeSet', aderIsLogin, Home.adHomeSet);
	app.post('/adHomeUpdAjax', aderIsLogin, Home.adHomeUpdAjax);
	app.post('/adHomeUpdFile', aderIsLogin, postForm, MdFiles.newFile, Home.adHomeUpdFile);

	/* navdb ---------------------- navdb ---------------------------------- */
	app.get('/adNavdbs', aderIsLogin, Navdb.adNavdbs);
	app.get('/adNavdb/:id', aderIsLogin, Navdb.adNavdb);
	app.get('/adNavdbDel/:id', aderIsLogin, Navdb.adNavdbDel);
	app.post('/adNavdbNew', aderIsLogin, Navdb.adNavdbNew);
	app.post('/adNavdbUpdAjax', aderIsLogin, Navdb.adNavdbUpdAjax);
	app.post('/adNavdbUpdFile', aderIsLogin, postForm, MdFiles.newFile, Navdb.adNavdbUpdFile);
}

const aderIsLogin = function(req, res, next) {
	let crAder = req.session.crAder;
	if(!crAder) {
		return res.redirect('/error?info=需要您的Administrator账户');
	} else {
		next();
	}
};