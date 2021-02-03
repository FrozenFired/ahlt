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
		return res.render('./front/firm/detail', {title: '关于公司' });
	} catch(error) {
		return res.redirect('/error?info=adNavdbs,Error&error='+error)
	}
}

exports.internet = async(req, res) => {
	try{
		return res.render('./front/internet/detail', {title: '互联网基础' });
	} catch(error) {
		return res.redirect('/error?info=adNavdbs,Error&error='+error)
	}
}

exports.invest = async(req, res) => {
	try{
		res.render('./front/invest/detail', {title: "投资人页面"})
	} catch(error) {
		return res.redirect('/error?info=invest,Error&error='+error)
	}
}

exports.navdb = async(req, res) => {
	// console.log('/navdb:id');
	try{
		const id = req.params.id;
		const navdb = await Navdb.findOne({"_id": id})
		.populate("sup", "cn")
		.populate({path: "subs", select: "cn photo", options: {sort: {weight: -1}}})

		// 子模块表格
		let subsCol = 3;
		if(navdb.subsCol) subsCol = parseInt(navdb.subsCol);
		let subsTable = [];
		if(navdb.showSubsTbNum > 0 && navdb.subs && navdb.subs.length > 0) {
			const subs = navdb.subs;

			let len = navdb.showSubsTbNum;		// 显示子模块的数量
			if(subs.length < navdb.showSubsTbNum) len = subs.length;

			let tr = -1;	// 行数 此处为-1，以后会自加 初始为0
			for(let i=0; i<len; i++) {
				if(parseInt(i%subsCol) == 0) {	// 每当填充好一排后 行标+1
					tr++;
					subsTable[tr] = [];
				}
				subsTable[tr].push(navdb.subs[i]);
			}
			if(len%subsCol !=0 ) {
				const fillTab = subsCol-len%subsCol;
				for(let i=0; i<fillTab; i++) {
					subsTable[tr].push(new Object())
				}
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