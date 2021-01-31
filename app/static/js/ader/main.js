$(() => {
	/* ==== 点击按钮 添加页面的显示与隐藏 ==== */
	$("#jsOnFixed-addObject").on("click", "#jsBtn-objectAdd", function() {
		$("#jsBtn-objectAdd").hide();
		$("#jsPageFiexd-obj").hide();

		$("#jsBtn-fromAdd-back").show();
		$("#jsForm-adObjectNew").show();
	})
	$("#jsOnFixed-addObject").on("click", "#jsBtn-fromAdd-back", function() {
		$("#jsBtn-fromAdd-back").hide();
		$("#jsForm-adObjectNew").hide();

		$("#jsBtn-objectAdd").show();
		$("#jsPageFiexd-obj").show();
	})

	/* ================================ 更新数据 ================================ */
	$(".jsUpd-text").dblclick(function(e) {
		const target = $(e.target);
		const key = target.data("key");
		// $(".jsUpd-text-"+key).hide();
		$(".jsUpd-ipt-"+key).toggle();
	})
	$(".jsUpd-span").click(function(e) {
		const target = $(e.target);
		const key = target.data("key");
		// $(".jsUpd-text-"+key).hide();
		$(".jsUpd-ipt-"+key).toggle();
	})
	$(".jsUpd-ipt").keydown(function(e) {
		if (e.keyCode == 13) {  
			$(this).blur();
		}  
	});
	$(".jsUpd-ipt").blur(function(e) {
		const target = $(e.target);
		const key = target.data("key");		// 更改数据的名称 比如 photo code
		const url = target.data("url");		
		const id = target.data("id");
		const type = target.data("type");
		const orgVal = $(".jsUpd-org-"+key).val();
		const val = $(this).val();
		if(val != orgVal) {
			const data = "id="+id+"&key="+key+"&val="+val+"&type="+type;

			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 200) {
						$(".jsUpd-span-"+key).text(val);
						$(".jsUpd-org-"+key).val(val);
						$(".jsUpd-ipt-"+key).hide();
						if(type == "color") {
							$(".jsColor-"+key+"-"+id).css("background-color", "#"+val);
						}
					} else {
						alert(results.message)
					}
				}
			});
		} else {
			$(".jsUpd-ipt-"+key).hide();
		}
	})


	// 点击更改图片
	$(".jsChangeImgDiv").click(function(e) {
		const htmlId = $(this).attr("id");
		const field = htmlId.split('-')[1];
		const objId = htmlId.split('-')[2];
		// console.log(dest);
		$("#jsFileIpt-"+field+"-"+objId).click();
	})
	let orgPicSrc = "";
	$(".jsFileIpt").change(function(e) {
		try {
			const htmlId = $(this).attr("id");
			const field = htmlId.split('-')[1];
			const objId = htmlId.split('-')[2];
			const file = document.getElementById(htmlId).files[0];
			const src = window.URL.createObjectURL(file);
			orgPicSrc = document.getElementById('jsImg-'+field+'-'+objId).src;
			document.getElementById('jsImg-'+field+'-'+objId).src = src;
			$("#jsChangeImgDiv-"+field+"-"+objId).hide();
			$("#jsFileForm-"+field+"-"+objId).show();
		} catch(error) {
			console.log(error);
		}
	})
	$(".jsImgCancel").click(function(e) {
		const target = $(e.target);
		const objId = target.data("objid");
		const field = target.data("field");
		document.getElementById('jsImg-'+field+'-'+objId).src = orgPicSrc;
		$("#jsFileIpt-"+field+"-"+objId).val("")
		$("#jsFileForm-"+field+"-"+objId).hide();
		$("#jsChangeImgDiv-"+field+"-"+objId).show();
	})

	// 点击更改视频
	$(".jsChangeVideoDiv").click(function(e) {
		const htmlId = $(this).attr("id");
		const field = htmlId.split('-')[1];
		const objId = htmlId.split('-')[2];
		// console.log(dest);
		$("#jsChangeVideoDiv-"+field+"-"+objId).hide();
		$("#jsFileForm-"+field+"-"+objId).show();
	})
	$(".jsVideoCancel").click(function(e) {
		const target = $(e.target);
		const objId = target.data("objid");
		const field = target.data("field");
		$("#jsFileIpt-"+field+"-"+objId).val("")
		$("#jsFileForm-"+field+"-"+objId).hide();
		$("#jsChangeVideoDiv-"+field+"-"+objId).show();
	})
})