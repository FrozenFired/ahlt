$(() => {
	$(".td-js-card").mouseenter(function(e) {
		// $(".td-js-card").removeClass("css-bg-td")
		$(this).addClass("css-bg-td")
	})
	// 右侧导航栏 鼠标移出
	$(".td-js-card").mouseleave(function(e) {
		$(this).removeClass("css-bg-td")
	})
})