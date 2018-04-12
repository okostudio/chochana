// init on load
window.addEventListener('load', init);
window.addEventListener('resize', resizeWindow);


let doc = {
	scroll: 0,
	heroButtonShowing: false,
	currentPage: 'home',
	campaignShowing: false,
	productShowing: false,
	previousPage: '',
	Title: 'CHOCHANA Swimwear',
	previousPage: {
		Title: 'CHOCHANA Swimwear',
		Url: '/'
	}
}

function init() {
	// initShop();

	// !!!! DEV MODE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	$('body').addClass('dev-mode')

	$.getJSON("/assets/data/data.json", function (data) {
		//first row "title" column
		doc.data = data;
		// console.log(data)
		populateShop(data);
		updateShopFilters();
		populateInstagram();

		console.log(">> INIT 3.02")
		initSlideShow('.hero .slideshow', 'slide');
		initSlideShow('.instagram .posts.large', 'fade');

		addListeners();
	});

	$.getJSON("/assets/data/campaign.json", function (data) {
		//first row "title" column
		doc.campaignData = data;
		console.log(data)
	});

	from('.promo', 0.3, { alpha: 0 }, 'in', 0.1);
	from('.nav', 0.3, { alpha: 0 }, 'in', 0.1);
	from('.hero', 0.5, { alpha: 0 }, 'in', 0.1);

	// from('section', 0.2, {alpha: 0}, 'in', 0.1)
	wait(0.1, function () {
		resizeWindow();
		onScroll();
		loadMapsApi();
		doc.scroll = window.pageYOffset;
		trace('window.pageYOffset: ' + window.pageYOffset)
		$('section.campaign').hide();
		$('section.shop').show();
		$('section.stores').show();
		$('section.instagram').show();
		$('section.footer').show();
		set('section.contact', {opacity: 0, display: 'none' })

		checkUrlQueries();
	});
}



//////////////////////////////////////////////////////////////////////
//
//	POPULATE SHOP
//
//////////////////////////////////////////////////////////////////////
function populateShop(data, filter = {}) {

	data.sort((a, b) => {
		if (a.Colour_Index < b.Colour_Index) return -1;
		if (a.Colour_Index > b.Colour_Index) return 1;
		return 0;
	});

	data.map((product, i) => {
		const name = product.Product_Name + " " + product.Product_Type + " " + product.Variant_Name;
		const id = product.Product_Name + '-' + product.Product_Id;
		// console.log(name)
		const html = `
			<div class="product" id="${id}" productIndex="${id}">
		        <div class="product-image" data="${id}">					      
		            <img class="product-image-0" src="/assets/images/sml/pose/${product.Front_Image_Url}"/>
		            <img class="hover" src="/assets/images/sml/product/${product.Product_Image_Url}"/>
		            <div class="hitarea"></div>
		        </div>
		        <div class="product-details">
		            <h2>${product.Product_Type} ${product.Product_Name} ${product.Variant_Name}</h2>
		            <h3 class="price">${'$' + product.Price}</h3>
		        </div>
		    </div>`;
		// if(product.Hidden != "TRUE"){
		$('#shop-items').append(html);
		// }
	})

	$('.product-image').mouseover(productHover)
	$('.product-image').mouseout(productOut)
	$('.product-image').click(productClick)


	//-------------------------------------
	// Populate Shop filters
	//-------------------------------------
	// make an array of all colors
	doc.colors = [];
	data.map(product => {
		let colors = product.Colour.split(',').map(color => {
			let colorExists = false;
			doc.colors.map(COLOR => {
				if (COLOR == color) colorExists = true;
			})
			if (!colorExists) {
				doc.colors.push(color);
				$('.shop .filters .colour').append(`
					<div class="select">${color}</div>
				`);
			}
		})
	})
}




//////////////////////////////////////////////////////////////////////
//
//	URL QUERY HANDLER
//
//////////////////////////////////////////////////////////////////////
function checkUrlQueries() {
	let queryString = window.location.search.substring(1).split("&");
	let queries = {};
	queryString.map(query => {
		queries[query.split('=')[0]] = query.split('=')[1];
	});

	if (queries.page == "shop" || queries.page == "stores" || queries.page == "instagram") {
		scrollPageTo('.' + queries.page, 0);
		from('section.' + queries.page, 0.5, { alpha: 0 }, 'in')
	};

	if (queries.page == "contact") {
		toggleContact();
	};

	if (queries.id) {
		if (doc.productShowing) {
			console.log('> hide product page')
			toggleProductPage();
		} else {
			console.log('> show product page')
			toggleProductPage(queries.id);
		}
	};
}



//////////////////////////////////////////////////////////////////////
//
//	FILTER PRODUCTS 
//
//////////////////////////////////////////////////////////////////////
function updateShopFilters() {
	let filters = {
		Product_Type: [],
		Colour: [],
		Size: []
	}
	let filtered = [];
	doc.data.map(product => filtered.push(product));

	function pushFilters(filter, target) {
		Array.from($('.shop .' + filter + ' .selected')).map(result => {
			filters[target].push($(result).text().toLowerCase());
		})
	}
	pushFilters('type', 'Product_Type');
	pushFilters('colour', 'Colour');
	pushFilters('size', 'Size');


	if (filters.Product_Type.length > 0) {
		filtered = doc.data.filter(product => filters.Product_Type.indexOf(product.Product_Type) > -1);
	}

	function testForColorMatch(product) {
		let colorExists = false;
		let productColors = product.Colour.split(',');
		productColors.map(color => {
			filters.Colour.map(COLOR => {
				if (COLOR.toLowerCase() == color.toLowerCase()) colorExists = true;
			})
		});
		return (colorExists);
	}
	if (filters.Colour.length > 0) {
		filtered = filtered.filter(testForColorMatch);
	}

	$('.product').hide();
	filtered.map((product) => $('#' + product.Product_Name + '-' + product.Product_Id).show());

	// Get number of results
	let resultsCount = 0;
	const products = Array.from($('.shop .product')).map((product) => {
		if (product.style.display != 'none') resultsCount++;
	})
	$('.results-count').html('Results: ' + resultsCount);
}

function shopFilterSelect(e) {
	console.log(e)
	this.classList.toggle("selected");
	updateShopFilters();
	scrollPageTo('.shop', 0.4, { ease: Power3.easeOut });
}




//////////////////////////////////////////////////////////////////////
//
//	Product Mouse Actions
//
//////////////////////////////////////////////////////////////////////
function productHover(e) {
	to($(this).find('.hover'), 0.5, { alpha: 1 }, 'out');
}

function productOut(e) {
	to($(this).find('.hover'), 0.5, { alpha: 0 }, 'out');
}

function productClick(e) {
	console.log(this.getAttribute('data'))
	toggleProductPage(this.getAttribute('data'))
}



//////////////////////////////////////////////////////////////////////
//
//	SLIDESHOW CONTROLS
//
//////////////////////////////////////////////////////////////////////
function initSlideShow(el, transition) {
	if (!transition) transition = 'slide';
	let slideShow = {
		container: $(el),
		target: $(el + ' .slide'),
		length: $(el + ' .slide').length,
		current: 1,
		previous: 1,
		transition: transition
	}
	console.log(slideShow)

	if (slideShow.transition == "slide") {
		$(el + ' .slide').hide();
		set($(el + ' .slide'), { x: 0 })
		$($(el + ' .slide')[slideShow.current - 1]).show();
	}
	if (slideShow.transition == "fade") {
		set(slideShow.target, { alpha: 0 })
		set($(slideShow.target[0]), { alpha: 1 });
	}

	function changeSlide() {
		// update previous slide n
		slideShow.previous = slideShow.current;
		if (slideShow.current < slideShow.length) {
			slideShow.current++
		} else {
			slideShow.current = 1;
		}

		// define current and previous slides
		const newSlide = slideShow.target[slideShow.current - 1];
		const oldSlide = slideShow.target[slideShow.previous - 1];
		
		
		// if Sliding in from side
		if (slideShow.transition == "slide") {
			const slideWidth = $(el + ' .slide').width();

			set(newSlide, { x: 0 })
			from(newSlide, 1.0, { x: slideWidth }, 'inOut')
			to(oldSlide, 1.0, { x: -slideWidth }, 'inOut')
		}

		// if Fading in / out
		if (slideShow.transition == "fade") {
			set(el + ' .slide', { alpha: 0 })
			set(newSlide, { alpha: 1 })
			set(oldSlide, { alpha: 1 })

			if (slideShow.current == 1) {
				to(oldSlide, 1.0, { alpha: 0 }, 'in')
			} else {
				from(newSlide, 1.0, { alpha: 0 }, 'in')
			};
		}

		wait(3, changeSlide)
	}
	wait(3, changeSlide)
}

function checkUrlForTags() {

	var urlTags = window.location.href.split('#');
	if (urlTags.length > 1) {
		if (urlTags[1] == "thanks") {
			scrollPageTo('.thanks')
			$('.email-confirmation').show();
			from('.thanks', 0.5, {
				y: 20,
				alpha: 0
			}, 'out', 0.33);
		}
	}
}



//////////////////////////////////////////////////////////////////////
//
//	NAV FUCNTOINS AND LISTENERS
//
//////////////////////////////////////////////////////////////////////
function addListeners() {

	$(document).scroll(onScroll)

	$('.nav li').mouseover(navOver);
	$('.nav li').mouseout(navOut);
	$('.nav li').click(navSelect);
	$('.nav .logo').click(navSelect);
	$('.hero .button .hitarea').click(navSelect);
	$('.nav ul').click(toggleNav);
	$('.filters .select').click(shopFilterSelect);
	$('.contact .close').click(toggleContact);
	$('.product-page .close').click(hideProductPage);

	$('.footer .facebook').click(function () {
		gotoPage('https://www.facebook.com/chochanaswim/');
	});

	$('.footer .instagram').click(function () {
		gotoPage('https://www.instagram.com/chochana_swimwear/');
	});
	$('.instagram h1').click(function () {
		gotoPage('https://www.instagram.com/chochana_swimwear/');
	});

	// on hash change ( on URL change )
	window.onhashchange = locationHashChanged;
}

function locationHashChanged() {
	console.log(window.location.href)
}

// -- Update Browser History / Url ---------------------------
function ChangeUrl(title, url) {

	if (typeof (history.pushState) != "undefined") {
		if (doc.previousPage.Title != title && doc.previousPage.Url != url) {
			doc.previousPage.Title = title;
			doc.previousPage.Url = url;
		}
		var obj = {
			Title: title,
			Url: url
		};
		history.pushState(obj, obj.Title, obj.Url);
	} else {
		alert("Browser does not support HTML5.");
	}
}

function toggleNav(e) {
	if (doc.mobile) {
		if (!doc.navToggled) {
			navExpand();
		} else {
			navCollapse();
		}
	}
}

function navExpand(e) {
	$('.nav').addClass('navShadow')
	var navHeight = $('.nav ul li').length * parseInt($('.nav ul li').css('height'));
	to('.nav ul', 0.4, {
		height: navHeight
	}, 'inOut');
	doc.navToggled = true;
}

function navCollapse(e) {
	to('.nav ul', 0.3, {
		height: 0,
		onComplete: function () {
			doc.navToggled = false;
			$('.nav').removeClass('navShadow')
		}
	}, 'inOut');
}

function scrollPageTo(el, time = 0.5, vars = {}) {
	if (!vars.scrollDelay) vars.scrollDelay = 0;
	if (!vars.ease) vars.ease = Power3.easeInOut;
	// if(delay) ease = Power3.easeOut;
	wait(vars.scrollDelay, function () {
		doc.scroll = $(document).scrollTop();
		let offsetY = 0;
		if ($.isNumeric(el)) {
			offsetY = el;
		} else {
			offsetY = doc.scroll + $(el)[0].getBoundingClientRect().top - 100;
		}
		TweenLite.to(doc, time, {
			scroll: Math.round(offsetY),
			ease: vars.ease,
			onUpdate: function () {
				$(document).scrollTop(doc.scroll)
			}
		})
	})
}

function navSelect(e) {

	let page = $(e.target).attr('page');
	navCollapse();

	let scrollDelay = 0;

	if (page != 'campaign' && page != 'contact' && doc.campaignShowing) {
		trace('not campaign??')
		hideCampaign(page);
		scrollDelay = 0.12;
	}

	if (doc.contactShowing && page != 'contact') {
		toggleContact();
	}

	if (doc.productShowing) {
		hideProductPage();
	}

	switch (page) {
		case 'home':
			ChangeUrl(doc.Title + '', '/');
			to('.nav .underline', 0.3, {
				width: 0
			}, 'out')
			scrollPageTo(0, 0.5);
			break;
		case 'shop':
			scrollPageTo('.shop', 0.5, {
				scrollDelay: scrollDelay
			});
			ChangeUrl(doc.Title + ' : Shop', '/?page=' + page)
			break;
		case 'stores':
			scrollPageTo('.stores', 0.5, {
				scrollDelay: scrollDelay
			});
			ChangeUrl(doc.Title + ' : Locales', '/?page=stores')
			break;
		case 'campaign':
			showCampaign();
			break;
		case 'contact':
			toggleContact();
			break;
		default:
			break;
	}
}

// show hide contact form
function toggleContact() {
	if (doc.contactShowing) {
		ChangeUrl(doc.Title + '', '/')
		doc.contactShowing = false;
		to('.contact', 0.4, {
			opacity: 0
		}, 'out')
		to('.contact .container', 0.4, {
			y: '-100%',
			onComplete: () => {
				set('.contact', {
					display: 'none'
				})
			}
		}, 'out')
	} else {
		ChangeUrl(doc.Title + ' : Contact', '/?page=contact')
		doc.contactShowing = true;
		set('.contact', {
			opacity: 1,
			display: 'block'
		})
		set('.contact .container', {
			y: "0%"
		})
		from('.contact', 0.4, {
			opacity: 0
		}, 'out')
		from('.contact .container', 0.4, {
			y: '-100%'
		}, 'out')
	}
}

function hideProductPage() {
	ChangeUrl(doc.Title, '/')
	doc.productShowing = false;
	to('.product-page', 0.2, {
		opacity: 0
	}, 'in')
	to('.product-page .container', 0.2, {
		y: '-33%',
		onComplete: () => {
			set('.product-page', {
				display: 'none'
			});
			set('.product-page .hitarea', {
				display: 'none'
			});
		}
	}, 'in')
}

function toggleProductPage(productId) {
	if (doc.productShowing && !productId) {
		hideProductPage();
	} else {
		if (productId) {
			ChangeUrl(doc.Title + ' : Product', '/?page=product&id=' + productId)
			populateProductPage(productId);
		}
		set('.product-page', {
			opacity: 1,
			display: 'block'
		})
		set('.product-page .container', {
			y: "0%"
		})

		if (!doc.productShowing) {
			from('.product-page', 0.4, {
				opacity: 0
			}, 'out')
			from('.product-page .container', 0.4, {
				y: '20%'
			}, 'out')
		}
		doc.productShowing = true;
		verticallyCenterProductPage();
		wait(0.5, function () {
			$('.product-page .hitarea').show();
		})
	}
}

function populateProductPage(productId) {

	var product = doc.data.filter(result => {
		if (result.Product_Name + '-' + result.Product_Id == productId) {
			return (true);
		}
	})[0];
	console.log(product);

	var sameColourProducts = doc.data.filter(result => {
		if (result.Product_Type == product.Product_Type && result.Product_Name == product.Product_Name) {
			if (result !== product) return (true);
		}
	});


	// POPULATE PRODUCT =======================
	// -- slideshow image ---
	$('.product-page .slideshow .image').css({
		backgroundImage: `url(/assets/images/pose/${product.Front_Image_Url})`
	})
	$('.product-page .slideshow .zoom').css({
		backgroundImage: `url(/assets/images/pose/${product.Front_Image_Url})`
	})
	// -- check for other slideshow images -------
	if (product.Product_Image_Url.length > 1) {

	}
	if (product.Back_Image_Url.length > 1) {

	}

	// enable zoom;
	$('.product-page .slideshow .hitarea').mousemove(moveZoom)
	$('.product-page .slideshow .hitarea').mouseover(zoomOver)
	$('.product-page .slideshow .hitarea').mouseout(zoomOut)


	$('.product-page .description').html(`
		<div class="product-name"><h1>${product.Product_Type}, ${product.Product_Name}, ${product.Variant_Name}</h1></div>
		<div class="product-price"><h2>${'$' + product.Price}</h2></div>
		<div class="product-in-stock"><h2>FUERA DE STOCK :(</h2></div>
		<div class="product-code">Product code: ${product.Product_Id}</div>
		<div class="product-shipping-info">Env&iacute;os a todo el pa&iacute;s <strong>sin costo!</strong>*</div>
		<div class="otherColours"></div>
	`);

	// create a list of links to the same product with a different colour
	if (sameColourProducts.length > 0) $('.product-page .description .otherColours').append(`<p>Other Colours:</p>`);
	sameColourProducts.map((match, i) => {
		const id = match.Product_Name + '-' + match.Product_Id;
		$('.product-page .description .otherColours').append(`<div class="colour-option" data="${id}"></div>`);
		$($('.product-page .description .otherColours .colour-option')[i]).css({
			backgroundImage: 'url(/assets/images/pose/' + match.Front_Image_Url + ')',
			left: (i * 61) + 'px'
		});
	})
	$('.product-page .description .otherColours .colour-option').click(productClick)
}

function moveZoom(e) {
	const x = e.offsetX;
	const y = e.offsetY;
	const imgWidth = $('.product-page .hitarea').width();
	const imgHeight = $('.product-page .hitarea').height();
	const zWidth = $('.product-page .zoom').width();
	const zHeight = $('.product-page .zoom').height();

	const xDifference = zWidth - imgWidth;
	const yDifference = zHeight - imgHeight;


	let offset = {
		x: (x / imgWidth),
		y: (y / imgHeight)
	}

	offset.x = -(offset.x * xDifference)
	offset.y = -(offset.y * yDifference)

	to('.zoom', 0.4, {
		x: offset.x,
		y: offset.y
	}, 'out')

	console.log("gaASDF")
}

function zoomOver() {
	to('.zoom', 0.6, {
		alpha: 1
	}, 'in')
}

function zoomOut() {
	to('.zoom', 0.6, {
		alpha: 0
	}, 'in')
}



function gotoPage(url) {
	var win = window.open(url, '_blank');
	win.focus();
}

function navOver(e) {
	if (doc.mobile) {

	} else {
		kill('.nav .underline');
		let width = $(e.target).width(),
			x = $(e.target).offset().left,
			xContainer = $('.container').offset().left;
		to('.nav .underline', 0.3, {
			x: x - xContainer,
			width: width
		}, 'backOut')
	}
}

function navOut(e) {
	if (doc.mobile) {

	} else {
		let width = $(e.target).width(),
			x = $(e.target).offset().left,
			xContainer = $('.container').offset().left;
		to('.nav .underline', 0.2, {
			x: x - xContainer + (width * 0.5),
			width: 0
		}, 'in', 0.2);
	}
}





//////////////////////////////////////////////////////////////////////
//
//	SHOW CAMPAIGN
//
//////////////////////////////////////////////////////////////////////
function showCampaign() {

	if (!doc.campaignShowing) {
		trace('show campaign')
		doc.campaignShowing = true;
		$('.campaign').show();
		doc.campaignHeight = $('.campaign').height();

		$('.campaign').css({
			height: 'auto',
			opacity: 1
		})
		from('.campaign', 0.2, {
			alpha: 0
		}, 'in')
		from('.campaign', 0.5, {
			height: 0
		}, 'inOut')
		to('.campaign img', 0.5, {
			alpha: 1
		}, 'in', 0.1)
	} else {
		// trace('MAYBE')
	}
}

function hideCampaign(page) {

	trace('hide campaign')
	if (doc.campaignShowing) {
		doc.campaignShowing = false;
		to('.campaign', 0.1, {
			height: 0,
			onComplete: function () {
				$('.campaign').hide();
			}
		}, 'in')
		to('.campaign img', 0.1, {
			alpha: 0
		}, 'out')
	}
}

//////////////////////////////////////////////////////////////////////
//
//	POPULATE INSTAGRAM
//
//////////////////////////////////////////////////////////////////////
function populateInstagram() {
	console.log(">> POPULATING INSTA FEED")

	// List of large instagram posts, for slideshow
	let large = [{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/258396f4aaa97e8d4319b33131c0de3f/5B4EB9E0/t51.2885-15/e35/14487234_181259058980118_9038199817582411776_n.jpg',
			post: 'https://www.instagram.com/p/BK6oeIwjamo/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/90e2c2bf3f2ed815a3f27cc64d3427c9/5B70984E/t51.2885-15/e35/14719704_166423530489267_407969941195587584_n.jpg',
			post: 'https://www.instagram.com/p/BMZK0hrD0TN/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/b7ab96dd207c104844a719f5352dc964/5B576C33/t51.2885-15/e35/14712281_1025396677582182_2537946903065133056_n.jpg',
			post: 'https://www.instagram.com/p/BMPVC5zDFwl/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/3a99e155fc21b3d26ce3dd898c578994/5B655A9C/t51.2885-15/e35/14583294_2092760477615696_9005267928207065088_n.jpg',
			post: 'https://www.instagram.com/p/BLKYsbhjzxh/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/add78b6267183f79ae14a4997108a70b/5B5A3AF6/t51.2885-15/e35/14474028_607885652726079_929269045537013760_n.jpg',
			post: 'https://www.instagram.com/p/BLAGDG5Dxiy/'
		}
	]

	// Populate large instagram slideshow
	large.map(function (post) {
		newInstagramPost(
			'section.instagram .posts.large',
			post.img,
			post.post);
	});


	// List of small instagram posts, for slideshow
	let posts = [{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/38e75874ee23edd2899efd3bfae1ae68/5B6B37FA/t51.2885-15/e35/14145555_1178984125550101_8647239076455383040_n.jpg',
			post: 'https://instagram.com/p/BNSq_MZDFfe/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/e52614c7a6c18e822b44d11dc5c49613/5B5828C5/t51.2885-15/e35/15056642_1647048678927273_4948511243703943168_n.jpg',
			post: 'https://instagram.com/p/BM4uZoGDPUh/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/5224e6b1c59547b0c4d9fcade6032206/5B57109E/t51.2885-15/e35/15259003_153711855029898_5326076398446575616_n.jpg',
			post: 'https://instagram.com/p/BNej41fjj-E/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/8114e2c1bba304fb5a2109460a9aa0e7/5B62E183/t51.2885-15/e35/15624296_397513947253049_2372544740378804224_n.jpg',
			post: 'https://instagram.com/p/BOvMsAODr9z/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/a303e538b56c27c0d0804538368ec7b3/5B4F2D8F/t51.2885-15/e35/14504870_210467946037943_3850949488130654208_n.jpg',
			post: 'https://instagram.com/p/BK1gQWtDbJ6/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/53c8702a6e5b941969870c0d20dec0e9/5B4F4F6D/t51.2885-15/e35/14565075_1692234221104601_8694974644358217728_n.jpg',
			post: 'https://instagram.com/p/BL9UsLlD3iD/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/785f155069e69eeb046224e7ec6491da/5B59CF77/t51.2885-15/e35/14730611_331474910544676_6085342830157365248_n.jpg',
			post: 'https://instagram.com/p/BL6PF7ijiAk/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/71e331aaeb0c26b7369539a23dbfd8da/5B4F7BC9/t51.2885-15/e35/14704928_360859850916679_6705240721323982848_n.jpg',
			post: 'https://instagram.com/p/BM2FwHujxKq/'
		},
		{
			img: 'https://instagram.fsyd3-1.fna.fbcdn.net/vp/a79f5074c2e13dc494b6d7eafd130c70/5AD18E05/t51.2885-15/e15/14736181_189624161486237_1789865837503447040_n.jpg',
			post: 'https://instagram.com/p/BMRQPX5DNZR/'
		}
	];

	// Populate small instagram posts
	posts.map(function (post) {
		newInstagramPost(
			'section.instagram .posts.small',
			post.img,
			post.post);
	});
}

function newInstagramPost(target, imgUrl, postUrl) {
	const html = `<div class="post slide" style="background-image: url(${imgUrl})">
		<a href="${postUrl}" target="_blank"></a>
	</div>`;
	$(target).append(html);
}



//////////////////////////////////////////////////////////////////////
//
//	WINDOW RESIZE & SCROLL
//
//////////////////////////////////////////////////////////////////////
function resizeWindow() {
	if ($(window).width() < 980) {
		doc.mobile = true;
		to('.nav .underline', 0.2, {
			width: 0
		}, 'out');
		$('body').addClass('mobile')

	} else {
		doc.mobile = false;
		$('body').removeClass('mobile')
	}

	// set hero to fill window
	$('.hero').height(Math.round($(window).height() - 100));
	$('.shop').css({
		marginTop: Math.round($(window).height())
	})

	function centerElement(el, offset = {
		x: 0,
		y: 0
	}) {
		const $el = $(el);
		const $parent = $el.parent();
		const x = ($parent.width() - $el.outerWidth()) * 0.5 + offset.x;
		const y = ($parent.height() - $el.outerHeight()) * 0.5 + offset.y;

		$el.css({
			left: Math.round(x) + 'px',
			top: Math.round(y) + 'px'
		})
		trace('top: ' + y)
		trace('left: ' + x)
	}

	// campaign quick fix
	if (doc.campaignShowing) {
		$('.campaign').css('height', 'auto')
	}

	if (doc.productShowing) {
		verticallyCenterProductPage();
	}

	const instaPostWidth = $('.col2').width();
	$('section.instagram .posts.small').height(instaPostWidth);
	$('section.instagram .posts.small .post').width(Math.floor(instaPostWidth * 0.33333))
	$('section.instagram .posts.small .post').height(Math.floor(instaPostWidth * 0.33333))
	$('section.instagram .posts.large .post').width(instaPostWidth);
	$('section.instagram .posts.large .post').height(Math.floor(instaPostWidth * 0.33333) * 3);
	$('section.instagram .posts.large').height(Math.floor(instaPostWidth * 0.33333) * 3);
	// centerElement('.hero .button')
	// centerElement('.mobile .hero .button', {x: 0, y: 125})
}


function verticallyCenterProductPage() {
	const containerHeight = $('.product-page .container').height();
	const windowHeight = $(window).height() - 100;
	const offset = (windowHeight - containerHeight) * 0.5 + 100;
	$('.product-page .container').css({
		top: offset + "px"
	})
}

function onScroll(e) {
	// console.log(e)
	// trace(window.pageYOffset)
	// let offsetY = window.pageYOffset;
	const offsetY = $(window).scrollTop();
	const shopTop = $('.shop').offset().top;
	const shopHeight = $('.shop').height();
	const filtersHeight = $('.shop .filters').height();

	// Keep store filters in view
	if (offsetY < shopTop) {
		set('.shop .filters', {
			y: 0
		})
	}
	if (offsetY > shopTop) {
		if (offsetY < shopTop + shopHeight - filtersHeight - 100) {
			set('.shop .filters', {
				y: offsetY - shopTop
			})
		}
	}

	if (offsetY > shopTop + 100) {
		$('.hero').hide();
	} else {
		$('.hero').show();
		set('.hero', {
			y: offsetY * -0.4
		})
	}
}
