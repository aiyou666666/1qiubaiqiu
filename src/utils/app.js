var current_user = {}
var _gaq = []
var emojis = [
	'ฅ(• - •)ฅ',
	'(●｀･(ｴ)･´●)',
	'(๑و•̀ω•́)',
	'۶(๑•̀ω•́๑)۶',
	'( • ̀ϖ•́ )✧',
	'(๑•̀ुᴗ-)و ̑̑',
	'(๑´ڡ`๑)',
	'٩(๑•̀ω•́๑)۶',
	'(｡•ˇ‸ˇ•｡)',
	'( ˘•㉨•˘ )✧',
	'(•́⌄•́๑)૭✧',
	'ฅ( ̳• ◡ • ̳)ฅ',
	'(●･̆⍛･̆●)',
	'(๑•॒̀ ູ॒•́๑)',
	'（◍›◡ु‹◍)☆',
	'(๑•́ ₃ •̀๑)'
]
var wechatHideItem = false
var wechatData = {
	imgURL: 'http://jiantuapp.com/assets/images/favicon(512px).png',
	link: window.location.origin + window.location.pathname + '?from=share', // second time sharing
	title: document.title.match('的照片') === null ? document.title : document.title + ' 快来抢！',
	desc: (function(){
		return '←戳　　　　　  　　　　\n  ' + emojis[Math.floor(emojis.length * Math.random())]

	}())
}

var _$ = function(selector){
	if (document.querySelectorAll !== undefined) {
		return document.querySelectorAll(selector)
	} else if (selector.match(/^\./) !== null) {
		return document._$ementsByClassName(selector)
	} else if (selector.match(/^\#/) !== null) {
		return document._$ementByID(selector)
	}
}

var isUploadToShare = false

var bindEvent = function(el, event, callback){
	if (el === undefined || el.length === 0) {
		return
	} else if (el.length > 0) {
		for (var i = 0; i < el.length; i++) {
			el[i].addEventListener(event, callback, false)
		}
	} else {
		el.addEventListener(event, callback, false)
	}
}

var addClass = function(el, className) {
	if (el === undefined) {
		return
	} else {
		el.classList.add(className)
	}
}

var removeClass = function(el ,className) {
	if (el === undefined) {
		return
	} else {
		el.classList.remove(className)
	}
}

var toggleClass = function(el ,className) {
	if (el === undefined) {
		return
	} else {
		el.classList.toggle(className)
	}
}

var hasClass = function(el, className) {
	if (el === undefined) {
		return
	} else {
		for (var i = 0; i < el.classList.length; i ++) {
  		if (el.classList[i] === className) {
  			return true
  		}
  	}
  	return false
	}
}

var goToSharePage = function(){
	window.location.hash = 'share'
	window.document.title = '我的照片'

	var iframe = document.createElement('iframe')
	var iframeEventListener = function(){
		setTimeout(function() {
			iframe.removeEventListener('load', iframeEventListener)
			if (iframe.parentNode) {
			  iframe.parentNode.removeChild(iframe);
			}
	  }, 0)
	}
	
  //iframe.setAttribute('src', '')
  iframe.setAttribute('style', 'display: none;')
	document.body.appendChild(iframe)
	iframe.addEventListener('load', iframeEventListener) 
	
	// hide danmu
	$('.danmus').addClass('hidden')
	removeClass(_$('.upload-page')[0], 'active')
	removeClass(_$('.photo-page')[0], 'active')
	removeClass(_$('.rank-page')[0], 'active')
	addClass(_$('.share-page')[0], 'active')
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}

var goToUploadPage = function(){
	addClass(_$('.upload-page')[0], 'active')
	addClass(_$('.photo-page')[0], 'active')
  removeClass(_$('.share-page')[0], 'active')
	removeClass(_$('.upload-section')[0], 'loading')
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}

var loadSharePage = function(){
	goToSharePage()

	// set local storage
  if (!(typeof window.localStorage == 'undefined')) {
  	//alert(localStorage.getItem('jiantu_weixin_photo'))
  	_$('.photo')[0].src = localStorage.getItem('jiantu_weixin_photo')
  }
}

var detectSharePage = function(){
	if (window.location.hash === '#share' && !_$('.share-page')[0].classList.contains('active')) {
		// alert(localStorage.getItem('jiantu_weixin_photo') !== null)
		loadSharePage()
	}

	// if (window.location.hash === '#share' && !_$('.share-page')[0].classList.contains('active') && localStorage.getItem('jiantu_weixin_photo') !== null) {
	// 	loadSharePage()
	// } else if (window.location.hash === '') {
	// 	goToUploadPage()
	// }
}

/**
 * Detecting vertical squash in loaded image.
 * Fixes a bug which squash image vertically while drawing into canvas for some images.
 * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
 * 
 */
var detectVerticalSquash = function(img) {
  var iw = img.naturalWidth, ih = img.naturalHeight;
  var canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = ih;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  var data = ctx.getImageData(0, 0, 1, ih).data;
  // search image edge pixel position in case it is squashed vertically.
  var sy = 0;
  var ey = ih;
  var py = ih;
  while (py > sy) {
    var alpha = data[(py - 1) * 4 + 3];
    if (alpha === 0) {
        ey = py;
    } else {
        sy = py;
    }
    py = (ey + sy) >> 1;
  }
  var ratio = (py / ih);
  return (ratio===0)?1:ratio;
}

/**
 * A replacement for context.drawImage
 * (args are for source and destination).
 */
var drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
	var vertSquashRatio = detectVerticalSquash(img);
	// Works only if whole image is displayed:
	// ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
	// The following works correct also when only a part of the image is displayed:
	ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio, 
	                   sw * vertSquashRatio, sh * vertSquashRatio, 
	                   dx, dy, dw, dh );
}

var compressImage = function(source_img_obj, orientation, output_format){
	var mime_type = "image/jpeg",
			max_width = 720,
			cvs = document.createElement('canvas'), w, h, ctx

	if(output_format!=undefined && output_format=="png"){
	  mime_type = "image/png"
	}

	cvs.width = max_width

	if (orientation === 6 || orientation === 8) {
		cvs.height = max_width * source_img_obj.naturalWidth / source_img_obj.naturalHeight
		ctx = cvs.getContext("2d")

		w = cvs.height
		h = cvs.width

		if (orientation === 6) {
			ctx.translate(cvs.width, 0)
			ctx.rotate(Math.PI/2)
		} else {
			ctx.translate(0, cvs.height)
			ctx.rotate(6*Math.PI/4)
		}
		// if (front) {
		// 	ctx.translate(0, cvs.width);
		// 	ctx.scale(1, -1);
		// }
	} else if (orientation === 1 || orientation === 3) {
		cvs.height = max_width * source_img_obj.naturalHeight / source_img_obj.naturalWidth
		ctx = cvs.getContext("2d")

		w = cvs.width
		h = cvs.height

		if (orientation === 3) {
			ctx.translate(cvs.width, cvs.height)
			ctx.rotate(Math.PI)
		}
		// if (front) {
		// 	ctx.translate(cvs.width, 0);
		// 	ctx.scale(-1, 1);
		// }
	} else {
		cvs.height = max_width * source_img_obj.naturalHeight / source_img_obj.naturalWidth
		ctx = cvs.getContext("2d")
		w = cvs.width
		h = cvs.height
	}
	
	drawImageIOSFix(ctx, source_img_obj, 0, 0, source_img_obj.naturalWidth, source_img_obj.naturalHeight, 0, 0, w, h)

	var newImageData = cvs.toDataURL(mime_type)
	var result_image_obj = new Image();
	result_image_obj.src = newImageData;
	return result_image_obj;
}

var applyMyReactions = function(reactionName) {
	var el = _$('.my-reactions'), form, xhr

	for (var i = 0; i < el.length; i ++) {
		removeClass(el[i], 'love')
		removeClass(el[i], 'smile')
		removeClass(el[i], 'bye')
		removeClass(el[i], 'shit')
		removeClass(el[i], 'cry')
		removeClass(el[i], 'cute')
		removeClass(el[i], 'misc')
		addClass(el[i], reactionName)
	}

	// send request
	form = new FormData()
	form.append("reaction", reactionName)
	xhr = new XMLHttpRequest()
	xhr.open("post", window.location.origin + window.location.pathname + "/react", true)
	xhr.send(form)

	_gaq.push(['_trackEvent', 'Post', 'Reply with emoji', reactionName])
}

var shareSuccessCallback = function(label, data){
	form = new FormData()
	form.append(label, data)
	xhr = new XMLHttpRequest()
	xhr.open("post", window.location.origin + '/photo/share/' + update_photo_id + "/update", true)
    update_photo_id=null
	xhr.send(form)
}

var assignShareData = function(){
    if(wechatHideItem==false){
        wx.showAllNonBaseMenuItem();
    }
    else{
        wx.hideAllNonBaseMenuItem();
    }
	wx.onMenuShareTimeline({
		title: '← ' + wechatData.title + '     ' + emojis[Math.floor(emojis.length * Math.random())],
		link: wechatData.link,
		imgUrl: wechatData.imgURL,
		success: function () {
			if (isUploadToShare) {
		    shareSuccessCallback("share_status", "success_to_timeline")
				_gaq.push(['_trackEvent', 'Post', 'Post photo', 'To timeline'])
			}
		},
		cancel: function () { 
	    // 用户取消分享后执行的回调函数
		}
	})

	wx.onMenuShareAppMessage({
	    title: wechatData.title,
	    desc: wechatData.desc,
	    link: wechatData.link,
	    imgUrl: wechatData.imgURL,
	    success: function () { 
    		if (isUploadToShare) {
    	    shareSuccessCallback("share_status", "success_to_chat")
					_gaq.push(['_trackEvent', 'Post', 'Post photo', 'To group chats'])
    		}
      },
	    cancel: function () { 
        // 用户取消分享后执行的回调函数
	    }
	});
}

window.onhashchange = detectSharePage

// danmu
var container_height = 0
var danmu_margin = 5
var calculate_container_height = function(){
	container_height = $('.danmu-item-wrap').length * danmu_margin
	$('.danmu-item-wrap').each(function(){
		container_height += $(this).height()
	})
}


var inititeDanmu = function(danmu_content){
	var height_sum = 0
	var $danmu_inner = $('.danmus-inner')
	var max_danmu_num = 5
	var danmu_interval_time = 600
	var apply_height = function(offset){
		$danmu_inner.css('bottom', offset + 'px')
	}
	calculate_container_height()
	$('.danmu-item-wrap').eq(-1).addClass('danmu-first')
	height_sum = $('.danmus').height()
	apply_height(height_sum)
	danmu_playing = true

	window.setInterval(function(){
		if($('.danmus-inner').height() > 0) {
			var $danmu_first = $('.danmu-first')

			if ($danmu_first.hasClass('danmu-display') && $danmu_first.is(':first-child')) {
				danmu_playing = false
			} else {
				danmu_playing = true
	  		height_sum -= ($('.danmu-first').height() + danmu_margin)

				$danmu_first.addClass('danmu-display')
				if ($danmu_first.prev().length > 0) {
					$danmu_first.removeClass('danmu-first').prev().addClass('danmu-first')
				}
				apply_height(height_sum)
			}
		}
	}, danmu_interval_time)

	// make them dissapear
	window.setInterval(function(){
		var $el = $('.danmu-display').not('.danmu-hidden').not('.about-to-dissappear').eq(-1)
		if (!$el.hasClass('about-to-dissappear')) {
			$el.addClass('about-to-dissappear')
			var temp = window.setTimeout(function(){
				$el.addClass('danmu-hidden').removeClass('about-to-dissappear')
				window.clearTimeout(temp)
			}, 3000)
		}
	}, danmu_interval_time)
}

var changeShareTitle = function(){
	var currentHour = (new Date()).getHours(),
			minHour = 18,
			maxHour = 24

	if (currentHour >= minHour && currentHour <= maxHour) {
		// change share title here
		var previousUrl = $('.icon-share-title').css('background-image')
		$('.icon-share-title').css('background-image', previousUrl.slice(0, -12) + '.png)')
	}
}

document.addEventListener("DOMContentLoaded", function() {

	// document loaded
	FastClick.attach(document.body);

	// handling browser back
	detectSharePage()

	// getting photo thumbnail
	if (_$('#photo_thumbnail').length > 0) {
		wechatData.imgURL = _$('#photo_thumbnail')[0].src
	}

  var onUpload = function(e){
  	var file = this.files[0],
  			imgSrc, form, viewer_limit,

  			sendRequest = function(form){
  				var photo_url, data, img
							xhr = new XMLHttpRequest()

					xhr.onload = function() {
				    // console.log("Upload complete.")
				    if (this.status !== 200) {
				    	removeClass(_$('.upload-section')[0], 'loading')
				    	alert('😭 照片上传失败，请重试')

				    	return false
				    }
				    data = JSON.parse(this.response)
				    photo_url = data.photo_url

				    _$('.share-page .photo')[0].src = photo_url

				    wechatData.link = data.share_url
				    wechatData.imgURL = data.thumbnail_url
                    //data.js_config.debug=true
                    //data.js_config.jsApiList=['onMenuShareTimeline', 'onMenuShareAppMessage']
                    //wx.config(data.js_config)
                    wechatHideItem = false
				    wx.config(js_config(data.js_ticket, data.app_id))

				    // load thumbnail
				    img = new Image()
				    img.src = wechatData.imgURL
				    img.onload = function() {
				    	goToSharePage()
				    	isUploadToShare = true
				    }

				    // set share title
				    if (data.owner_name.match(/^[a-zA-Z0-9].*[a-zA-Z0-9]$/) === null) {
				    	wechatData.title = data.owner_name + '的这张照片只有前 ' + data.limit + ' 个人能看到，快来抢！'
				    } else {
				    	wechatData.title = data.owner_name + ' 的这张照片只有前 ' + data.limit + ' 个人能看到，快来抢！'
				    }
                    update_photo_id = data.photo_id
				    assignShareData()
				    // set local storage
				    if (!(typeof(window.localStorage) === 'undefined')) {
				    	localStorage.setItem('jiantu_weixin_photo', photo_url)
				    }				    
					}

					xhr.open("post", "/photo/upload", true)
					xhr.send(form)
  			}

  	// dev environment?
  	if (window.location.origin.match('hammer') !== null) {
  		// addClass(_$('.upload-section')[0], 'loading')
  		goToSharePage()
  		return
  	}

  	// loading effect
  	$('.upload-section').addClass('loading')

  	//// upload GA
		//_gaq.push(['_trackEvent', 'Post', 'Upload File'])

  	viewer_limit = parseInt(_$('.viewer-limit-item.active')[0].getAttribute('data-value')) || 5

  	if (typeof(FileReader) === 'undefined') {
  		// upload raw file
  		// need testing?
	  	form = new FormData()
			form.append("limit", viewer_limit)
			addClass(_$('.viewer-limits-wrap')[0], 'disabled')
			form.append("photo", file)
			sendRequest(form)
  	}

		EXIF.getData(file, function(){
			var fr, 
					orientation = EXIF.getTag(this, "Orientation") | 'none'
					// front = EXIF.getTag(this, "LensModel").indexOf('front') === -1 ? false : true

			fr = new FileReader()
		  fr.onload = function() {
		  	var compressedSrc,
		  			img = new Image()

		  	img.src = fr.result
		  	img.onload = function(){
		  		// console.log(img.src)

			  	compressedSrc = compressImage(img, orientation).src

					// console.log(compressedSrc)

			  	// set form data
			  	form = new FormData()
					form.append("limit", viewer_limit)
					addClass(_$('.viewer-limits-wrap')[0], 'disabled')
					// form.append("photo", file)
					form.append("photo_base64", compressedSrc.slice(compressedSrc.indexOf('base64') + 6))

					// send xhr
					sendRequest(form)
		  	} 	
		  }
		  fr.readAsDataURL(file)
    })
  }

  // test environment?
  if (window.location.origin.match('alpha') !== null) {
  	window.document.title = '！！！测试环境！！！'
  	var iframe = document.createElement('iframe')
  	var iframeEventListener = function(){
  		setTimeout(function() {
  			iframe.removeEventListener('load', iframeEventListener)
  			if (iframe.parentNode) {
  			  iframe.parentNode.removeChild(iframe);
  			}
  	  }, 0)
  	}
    iframe.setAttribute('style', 'display: none;')
  	document.body.appendChild(iframe)
  	iframe.addEventListener('load', iframeEventListener)
  }

  window.setTimeout(function(){
  	var el = _$('.reactions-dd'),
  			emojiNotPosted = hasClass(_$('.my-reactions')[0], 'default') // hack to detect emoji posted
  			
  	if (el.length > 0 && emojiNotPosted) {
  		addClass(el[0], 'active')
  	}
  }, 1000)

  if (navigator.userAgent.match(/MI/i)) {
  	addClass(document.body, 'xiaomi')
  }

  //changeShareTitle()

  $('.upload-btn').change(onUpload)

  function uploadPopup() {
  	removeClass(_$('.banner')[0], 'active')
  	removeClass(_$('.reactions-dd')[0], 'active')
  	addClass(_$('.photo-page-upload')[0], 'active')
  }

  function submitDanmu(){
		if (!$('.comment-input').val()) {
			alert('什么都没写让我怎么弹！')
		} else if($('.comment-input').val().length > 40) {
			alert('太长了，短一点好吗！')
		} else {
			var commentContent = $('.comment-input').val()
			$('.comment-input').val('')

			// send request here
			form = new FormData()
			form.append("content", commentContent)
			xhr = new XMLHttpRequest()
			xhr.open("post", window.location.origin + window.location.pathname + "/comment", true)
			xhr.send(form)

			// banner
			$('.success-banner').addClass('active')
			window.setTimeout(function(){
				$('.success-banner').removeClass('active')
			}, 1000)

			$('.comments-dd').removeClass('active')

			// add danmu HTML
      if (current_user.nickname && current_user.headimgurl){
        var comment_item_html = '<a href="javascript:;" class="comment-item clearfix"><img src="' + current_user.headimgurl + '" class="avatar"><div class="comment-content"><h3 class="comment-author">' + current_user.nickname + '</h3><p class="comment-text">' + commentContent + '</p></div></a>'
        commentContent = '💬' + current_user.nickname + '：' + commentContent

        $(comment_item_html).appendTo('.comment-items-wrap')
      }

			var danmu_item_html = '<div class="danmu-item-wrap mine"><div class="danmu-item"><div class="danmu-item-content"><p class="danmu-text">' + commentContent + '</p></div></div></div>'

			$first_danmu = $('.danmu-first')

	 		if ($first_danmu.is(':first-child')) {
		 		$(danmu_item_html).insertBefore($first_danmu)
		 		$first_danmu.removeClass('danmu-first').prev().addClass('danmu-first')
			} else {
				$(danmu_item_html).insertBefore($first_danmu)
			}
		}
  }

	// post danmu
	$('.comment-input-form').submit(function(){
		submitDanmu()
		//_gaq.push(['_trackEvent', 'Post', 'Post comment', 'From keyboard button'])
		return false
	})

	$('.comment-send').click(function(){
		submitDanmu()
		//_gaq.push(['_trackEvent', 'Post', 'Post comment', 'From send button'])
 		return false
	})

	$('.comments-post-link').click(function(e){
		$('.comments-dd').toggleClass('active')
		$('.comment-input').focus()
		$('.reactions-dd').removeClass('active')
		//_gaq.push(['_trackEvent', 'Nav', 'Open comments input popup'])
		return false
	})

	$('.reactions-wrap').click(function(e){
		$('.reactions-dd').toggleClass('active')
		$('.comments-dd').removeClass('active')
		//_gaq.push(['_trackEvent', 'Nav', 'Open reactions popup'])
		return false
	})

	$('.cover-link, .js-share-photo, .top-banner').click(function(){
		var source = 'From image cover'

		if ($(this).hasClass('js-share-photo')) {
			source = 'From bottom banner'
			//_gaq.push(['_trackEvent', 'Nav', 'Open photo upload popup', source])
		} else if ($(this).hasClass('top-banner')) {
			source = 'From top banner'
			//_gaq.push(['_trackEvent', 'Nav', 'Open photo upload popup', source])
			return true
		}

		uploadPopup()
		
		return false
	})

	$('.viewer-limit-item').click(function(){
		if (!$(this).hasClass('active')) {
			$('.viewer-limit-item.active').removeClass('active')
			$(this).addClass('active')
		}
		return false
	})

  $('.viewer-item, .comment-item').click(function(){
  	var viewerName, viewerAvatarUrl

  	if ($(this).hasClass('more')) {
  		return false
  	} else if ($(this).hasClass('viewer-item')) {
  		viewerName = $(this).find('.name')[0].innerHTML
  		_gaq.push(['_trackEvent', 'Nav', 'Open profile popup', 'From viewer'])
  	} else {
  		viewerName = $(this).find('.comment-author')[0].innerHTML
  		_gaq.push(['_trackEvent', 'Nav', 'Open profile popup', 'From comment'])
  	}

		viewerAvatarUrl = $(this).find('.avatar')[0].src
  	$('.popup-cover-bg')[0].setAttribute('style', 'background-image:url(' + $(this).find('.avatar')[0].src + ')')
  	$('.popup-avatar')[0].src = viewerAvatarUrl
  	$('.popup-name')[0].innerHTML = viewerName
  	$('.popup-wrap').addClass('active')

  	return false
  })

  bindEvent(_$('.popup-wrap'), 'click', function(e){
  	if (e.target !== _$('.popup')[0]) {
  		removeClass(_$('.popup-wrap')[0], 'active')
  		e.stopPropagation()
  	}
  })

  $('.popup-dl').click(function(e){
  	_gaq.push(['_trackEvent', 'Nav', 'Click download link', 'From profile popup'])
  	e.stopPropagation()
  })

  $('.now-dl-link').click(function(e){
  	_gaq.push(['_trackEvent', 'Nav', 'Click download link', 'From viewers banner'])
  	e.stopPropagation()
  })

  bindEvent(_$('.close-page')[0], 'click', function(e){
  	removeClass(_$('.photo-page-upload')[0], 'active')
		removeClass(_$('.upload-section')[0], 'loading')
  	addClass(_$('.banner')[0], 'active')
  	e.stopPropagation()
  })

  bindEvent(_$('.share-prompt')[0], 'click', function(e){
  	toggleClass(_$('.rank-share-prompt-wrap')[0], 'active')
  	e.stopPropagation()
  })

  bindEvent(_$('.photo-wrapper')[0], 'click', function(e){
  	toggleClass(_$('.meta')[0], 'friendly-hidden')
  	e.stopPropagation()
  })

  // reply emoji
  $('.react').click(function(){
  	var reactionName = $(this).data('reaction'),
  			timeoutID

  	applyMyReactions(reactionName)
  	$('.reactions').eq(0).addClass('active')
  	$('.reaction-afterglow').addClass('active ' + reactionName)
  	
  	var timeoutID = window.setTimeout(function(){
  		$('.reaction-afterglow').removeClass('active ' + reactionName)
  		window.clearTimeout(timeoutID)
  	}, 600)

  	$('.reactions-dd').removeClass('active')

		window.setTimeout(function(){
			$('.comments-dd').addClass('active')
			$('.reactions-dd').removeClass('active')
		}, 1000)

  	return false
  })

}, false)


wx.error(function(res){
	alert(res.errMsg)
})

wx.ready(function(){
	assignShareData()
})

var random_str = function(){
    var length = 8;
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

var js_config = function(js_ticket, app_id){
    var noncestr = random_str()
    var timestamp = Date.parse(new Date())
    var url = location.href.split('#')[0]
    var tmp = 'jsapi_ticket='+js_ticket+'&noncestr='+noncestr+'&timestamp='+timestamp+'&url='+url
    var config = {
        debug: false,
        appId: app_id,
        timestamp: timestamp,
        nonceStr: noncestr,
        signature: hex_sha1(tmp),
        jsApiList: [
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'hideMenuItems',
            'showMenuItems',
            'onMenuShareTimeline',
            'onMenuShareAppMessage']
    }
    return config
}
