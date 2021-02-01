const _ = require('underscore');

const Home = require('../../models/home');
const Navdb = require('../../models/navdb');

exports.home = async(req, res) => {
	try{
		const home = await Home.findOne();
		if(!home) return res.render("/error?info=请联系管理员,公司主页出现问题");
		return res.render('./front/index/home', {title: 'Holartec', home, node_layout_footer: 1});
	} catch(error) {
		return res.redirect('/error?info=adNavdbs,Error&error='+error)
	}
}

exports.firm = async(req, res) => {
	try{
		return res.render('./front/firm/detail', {title: 'Holartec' });
	} catch(error) {
		return res.redirect('/error?info=adNavdbs,Error&error='+error)
	}
}
exports.navdb = async(req, res) => {
	// console.log('/navdb:id');
	try{
		const id = req.params.id;
		const navdb = await Navdb.findOne({"_id": id})
		.populate("sup", "cn")
		.populate({path: "subs", select: "cn photo", options: {sort: {weight: -1}}})
		let subsTable = [];
		if(navdb.showSubsTbNum > 0 && navdb.subs && navdb.subs.length > 0) {
			const subs = navdb.subs;
			const len = subs.length;
			const showSubsTbNum = navdb.showSubsTbNum + (3-parseInt(navdb.showSubsTbNum%3));
			let tr = -1;
			for(let i=0; i<len; i++) {
				if(i == showSubsTbNum) break;
				if(parseInt(i%3) == 0) {
					tr++;
					subsTable[tr] = [];
				}
				subsTable[tr].push(navdb.subs[i]);
			}
			// console.log(subsTable)
		}
		return res.render('./front/navdb/detail', {title: 'Holartec', navdb, subsTable});
	} catch(error) {
		return res.redirect('/error?info=navdb,Error&error='+error)
	}
}
exports.api_navdbs = async(req, res) => {
	try{
		const param = {shelf: 1};
		if(req.query.sup) {
			param["sup"] = req.query.sup;
		} else {
			param["level"] = 1;
		}

		const navdbs = await Navdb
		.find(param) .sort({'weight': -1}).limit(15)
		return res.json({status: 200, data: {navdbs}})
	} catch(error) {
		return res.json({status: 500, message: "/api/adNavdbs"})
		return res.redirect('/error?info=api_navdbs,Error&error='+error)
	}
}