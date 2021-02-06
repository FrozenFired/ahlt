let navdbFirs = [];
const init = () => {
	renderNavFirs_Func()
}


$(function() {
	init();
	$(".jsPageFiexd-navFirm").mouseenter(function(e) {
		$(".jsBox-navSec").hide();
		$(".navFir").removeClass("css-bg-bluMid")
	})
	// 右侧导航栏 鼠标进入
	$(".navRight").mouseenter(function(e) {
		const target = $(e.target);
		const nav = target.data('nav');

		// 子导航的显示
		$(".subsNav").hide();
		$(".subs-"+nav).show();

		// 当导航按钮触发后 当前导航按钮改变颜色
		$(".navRight").removeClass("css-bg-bluMid")
		$(this).addClass("css-bg-bluMid")
	})
	// 右侧导航栏 鼠标移出
	$(".navRight").mouseleave(function(e) {
		const target = $(e.target);
		const nav = target.data('nav');
		$(".subs-"+nav).hide();

		$(".navRight").removeClass("css-bg-bluMid")
		$(".navFir").removeClass("css-bg-bluMid")
	})

	// // 右侧二级导航按钮鼠标 进入
	// $(".navRsec").mouseenter(function(e) {
	// 	// 改变当前触发导航按钮的背景色
	// 	$(".navRsec").removeClass("css-bg-bluMid")
	// 	$(this).addClass("css-bg-bluMid")
	// })

	/* ====== 鼠标进入一级导航栏 显示二级导航 =====*/
	$(".navFirBox").on("mouseenter", '.navFir', function(e) {
		const target = $(e.target);
		const id = target.data('id');
		const navdbFir = arrGetNavdbFir_Func(id)

		// 一级导航被触发后改变背景色
		$(".navFir").removeClass("css-bg-bluMid")
		$(this).addClass("css-bg-bluMid")

		if(!navdbFir) {
			$(".jsBox-navSec").hide();
		} else if(navdbFir.navdbSecs) {
			$(".jsBox-navSec").show();
			$(".firSubs").hide();
			$(".firSubs-"+navdbFir._id).show();
		} else {
			renderNavSec_Func(navdbFir)
		}
	})
	$(".firsElem").on("click", ".navdbFirElem", function(e) {
		const target = $(e.target);
		const id = target.data("id");
		location.href = "/navdb/"+id;
	})
	/* ====== 隐藏效果隐藏 =====*/
	$(".jsBox-navSec").on("mouseover", ".css-coopHide-t80h600Sec", function(e) {
		$(".jsBox-navSec").hide();
		$(".navFir").removeClass("css-bg-bluMid")
	})

	/* ================== 鼠标进入二级导航栏按钮 =================*/
	$(".jsBox-navSec").on("mouseover", ".jsHref-navSec", function(e) {
		const target = $(e.target);
		const firid = target.data('firid');
		const id = target.data('id');

		// 获取二级导航的数据
		const navdbSec = arrGetNavdbSec_Func(firid, id)

		// 二级导航栏的描述 因为BOX已经添加了 只需要填充就可以
		$(".navdbSecDesp").remove();
		if(navdbSec.despTitle) {
			let elem = '<div class="navdbSecDesp">'
				elem += '<span class="text-info">'+navdbSec.cn+'</span> : '
				elem += navdbSec.despTitle
			elem +='</div>'
			$(".navdbSecDespBox-"+firid).append(elem)
		}

		// 给焦点二级导航按钮添加颜色 并去掉其他二级导航按钮的背景色
		$(".navSecCnBox").removeClass("css-bg-bluLight")
		$(".navSecCnBox-"+id).addClass("css-bg-bluLight")
		// 去掉及三级导航栏按钮的背景颜色
		$(".navThdLinkBox").removeClass("css-bg-bluLight")

		//  显示三级导航栏 
		if(navdbSec.navdbThds) {
			$(".secSub").hide();
			$(".secSub-"+id).show();
		} else {
			renderNavThd_Func(firid, navdbSec)
		}
	})

	/* ====== 鼠标进入三级导航栏 三级导航按钮变色 =====*/
	$(".jsBox-navSec").on("mouseover", ".navThd", function(e) {
		const target = $(e.target);
		const id = target.data('id');
		$(".navThdLinkBox").removeClass("css-bg-bluLight")
		$(".navThdLinkBox-"+id).addClass("css-bg-bluLight")
	})
})

/* ========================== 添加二级导航栏 ========================== */
const renderNavSec_Func = async(navdbFir) => {
	try {
		const navdbSecs = await getNavdbs_Func("/api/navdbs?sup="+navdbFir._id);	// 获取所触发的一级导航按钮下的所有二级导航数据库信息
		navdbFir.navdbSecs = navdbSecs;												// 存入当前数据, 以便下次调用
		// 添加二级导航的面板
		let elem = '';
		elem += '<div class="row firSubs firSubs-'+navdbFir._id+'">';		// 所属一级导航的二级面板
			//  二级导航栏的数据按钮
			elem += '<div class="col-3 mt-4 pl-5 secElem" style="height: 560px; border-right: 3px solid #dee2e6;">';
				elem += '<div class="navSecCnsBox navSecCnsBox-'+navdbFir._id+'" style="height: 340px">'
					for(let secNb=0; secNb<navdbSecs.length; secNb++) {
						const navdbSec = navdbSecs[secNb];
						elem += '<div class="rounded p-2 navSecCnBox navSecCnBox-'+navdbSec._id+'">'
							elem += '<a class="jsHref-navSec text-dark" href="/navdb/'+navdbSec._id+'" data-firid='+navdbFir._id+' data-id='+navdbSec._id+'>'+navdbSec.cn+'</a>';
						elem += '</div>'
					}
				elem += '</div>'
				elem += '<div class="mt-5 navdbSecDespBox navdbSecDespBox-'+navdbFir._id+'" style="display:block">'
					elem += '<hr/>'
				elem += '</div>'
			elem += '</div>';

			// 三级导航 此一级导航栏下 所有二级导航栏的下级目标 div
			elem += '<div class="col-3 mt-4 pl-5">';
				for(let secNb=0; secNb<navdbSecs.length; secNb++) {
					const navdbSec = navdbSecs[secNb];
					elem += '<div class="secSub secSub-'+navdbSec._id+'" style="display: none">';
					elem += '</div>';
				}
			elem += '</div>';

			// 右侧 媒体展示
			elem += '<div class="col-6 text-right mediaFir mediaFir-'+navdbFir._id+'">';
				if(navdbFir.photo && navdbFir.photo.length > 3) {
					elem += '<img class="js-click-imgEnlarge" src='+navdbFir.photo+' height="600px" />'
				}
			elem += '</div>';

			elem += '<div class="col-12"><div class="css-coopHide-t80h600Sec"></div></div>';
		elem += '</div>';

		$(".firSubs-"+navdbFir._id).remove();	// 防止系统出错, 即便系统出错, 最多只是再写一次, 不会重复加载同样的面板
		$(".jsBox-navSec").append(elem);		// 在二导航面板下添加新的二级目录面板
		$(".jsBox-navSec").show();				// 显示二级导航

		$(".firSubs").hide();				// 隐藏其他 一级导航下的二级面板
		$(".firSubs-"+navdbFir._id).show();	// 只显示本次所触发的一级导航下的二级面板
	} catch(error) {
		console.log(error);
	}
}

const renderNavThd_Func = async(firid, navdbSec) => {
	try {
		const navdbThds = await getNavdbs_Func("/api/navdbs?sup="+navdbSec._id);
		navdbSec.navdbThds = navdbThds;
		let elem = '';
		// 三级导航栏的数据按钮
		for(let thdNb=0; thdNb<navdbThds.length; thdNb++) {
			const navdbThd = navdbThds[thdNb];
			elem += '<div class="rounded p-2 navThdLinkBox navThdLinkBox-'+navdbThd._id+'">'
				elem += '<a class="navThd text-dark" href="/navdb/'+navdbThd._id+'" data-id='+navdbThd._id+'>'+navdbThd.cn+'</a>';
			elem += '</div>'
		}
		$(".secSub-"+navdbSec._id).append(elem)

		$(".secSub").hide();
		$(".secSub-"+navdbSec._id).show();
	} catch(error) {
		console.log(error);
	}
}

/* ========================== 添加一级导航栏 ========================== */
const renderNavFirs_Func = async() => {
	try {
		navdbFirs = await getNavdbs_Func("/api/navdbs");
		// 在导航栏添加4个一级导航区域
		let elem = '';
		for(let firNb=0; firNb<navdbFirs.length; firNb++) {
			if(firNb == 4) break;
			let browserWidthClass="col-lg-4 col-xxl-3";
			if(firNb == 3) {
				browserWidthClass="col-xxl-3 d-none d-xxl-block"
			}
			const navdbFir = navdbFirs[firNb];
			elem += '<div class="'+browserWidthClass+' rounded navFir navdbFirElem" data-id='+navdbFir._id+'>';
				elem += '<a class="text-white" href="/navdb/'+navdbFir._id+'">'+navdbFir.cn+'</a>';
			elem += '</div>';
		}
		$(".navdbFirElem").remove();	// 防止右边导航栏消失
		$(".firsElem").append(elem)
	} catch(error) {
		console.log(error);
	}
}

const getNavdbs_Func = (url) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "GET",
			url: url,
			success: (result)=> {
				if(result.status == 200) {
					resolve(result.data.navdbs);
				} else {
					resolve(result.message);
				}
			}
		});
	})
}

const arrGetNavdbFir_Func = id => {
	for(let i=0; i<navdbFirs.length; i++) {
		if(String(id) == String(navdbFirs[i]._id)) {
			return navdbFirs[i];
		}
	}
	return null;
}
const arrGetNavdbSec_Func = (firid, id) => {
	for(let i=0; i<navdbFirs.length; i++) {
		const navdbFir = navdbFirs[i];
		if(String(firid) == String(navdbFir._id)) {
			for(let j=0; j<navdbFir.navdbSecs.length; j++) {
				const navdbSec = navdbFir.navdbSecs[j];
				if(String(id) == String(navdbSec._id)) {
					return navdbSec;
				}
			}
		}
	}
	return null;
}