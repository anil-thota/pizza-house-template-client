"use strict";

(function () {
	// Global variables
	var userAgent = navigator.userAgent.toLowerCase(),
			initialDate = new Date(),

			$document = $(document),
			$window = $(window),
			$html = $("html"),
			$body = $("body"),

			isDesktop = $html.hasClass("desktop"),
			isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			windowReady = false,
			isNoviBuilder = false,
			loaderTimeoutId,
			plugins = {
				bootstrapTooltip: $("[data-toggle='tooltip']"),
				bootstrapTabs: $(".tabs-custom"),
				rdNavbar: $(".rd-navbar"),
				materialParallax: $(".parallax-container"),
				rdMailForm: $(".rd-mailform"),
				rdInputLabel: $(".form-label"),
				regula: $("[data-constraints]"),
				selectFilter: $("select"),
				wow: $(".wow"),
				owl: $(".owl-carousel"),
				swiper: $(".swiper-slider"),
				slick: $('.slick-slider'),
				isotope: $(".isotope"),
				radio: $("input[type='radio']"),
				checkbox: $("input[type='checkbox']"),
				preloader: $(".preloader"),
				captcha: $('.recaptcha'),
				scroller: $(".scroll-wrap"),
				lightGallery:            $( '[data-lightgallery="group"]' ),
				lightGalleryItem:        $( '[data-lightgallery="item"]' ),
				lightDynamicGalleryItem: $( '[data-lightgallery="dynamic"]' ),
				copyrightYear: $(".copyright-year"),
				buttonWinona: $('.button-winona'),
				multitoggle: document.querySelectorAll('[data-multitoggle]')
			};

			

	// Initialize scripts that require a loaded page
	$window.on('load', function () {
		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				page: $('.page'),
				animDelay: 500,
				animDuration: 500,
				animIn: 'fadeIn',
				animOut: 'fadeOut',
				conditions: function (event, link) {
					return !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
				},
				onReady: function () {
					clearTimeout(loaderTimeoutId);
					plugins.preloader.addClass('loaded');
					windowReady = true;
				}
			});
		}



		// Isotope
		if (plugins.isotope.length) {
			for (var i = 0; i < plugins.isotope.length; i++) {
				var isotopeItem = plugins.isotope[i];
				isotopeItem.isotope.layout();

				window.addEventListener('resize', function () {
					setTimeout(function () {
						isotopeItem.isotope.layout();
					}, 2000);
				});
			}
		}
	});

	var PROJECTID = "";

			// Document ready (DOMContentLoaded) function
			document.addEventListener("DOMContentLoaded", function () {
				const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds
				const storedProjectId = localStorage.getItem('projectId');
				const projectIdTimestamp = localStorage.getItem('projectIdTimestamp');
				const now = new Date().getTime();
			
				if (storedProjectId && projectIdTimestamp) {
					const timeDiff = now - projectIdTimestamp;
					if (timeDiff < THIRTY_MINUTES) {
						PROJECTID = storedProjectId;
						console.log("Valid session found, PROJECTID:", PROJECTID);
						document.getElementById('projectIdModal').style.display = 'none';
						document.getElementById('mainContent').style.display = 'block';
						applyUpdates();
					} else {
						localStorage.removeItem('projectId');
						localStorage.removeItem('projectIdTimestamp');
						console.log("Session expired, clearing stored data.");
					}
				}
			
				document.getElementById('submitProjectId').addEventListener('click', function (event) {
					event.preventDefault();
					const projectId = document.getElementById('projectIdInput').value;
					if (!projectId) {
						alert("Please enter a Project ID");
						return;
					}
			
					fetch('http://localhost:3001/project')
						.then(response => response.json())
						.then(data => {
							const projects = data.projects;
							console.log("Projects data fetched:", projects);
							const project = projects.find(proj => proj._id === projectId);
			
							if (project) {
								localStorage.setItem('projectId', projectId);
								localStorage.setItem('projectIdTimestamp', new Date().getTime());
								PROJECTID = projectId;
								document.getElementById('projectIdModal').style.display = 'none';
								document.getElementById('mainContent').style.display = 'block';
								applyUpdates();
							} else {
								alert("Please enter a valid Project ID");
							}
						})
						.catch(error => {
							console.error('Error fetching project data:', error);
							alert('There was an error fetching project data.');
						});
				});
			});
			
			function applyUpdates() {
				updateLogo();
				updateCarouselSlides();
				updateAddressDetails();
				updateAboutSection();
				
				fetchAndDisplayGalleryProducts();
				updateAboutUsBanner();
				updateContactsBanner();
				updateTypographyBAnner();
				updateProductDetails();
				
			   
			}
			
			
			function updateLogo() {
				// Select all elements with the class 'dynamicLogo'
				const logoElements = document.getElementsByClassName('dynamicLogo');
				console.log(logoElements)
				
				// Check if elements exist
				if (logoElements.length === 0) {
				  console.error("No logo elements found");
				  return;
				}
			  
				// Fetch the logo data from the API using the project ID
				fetch(`http://localhost:3001/properties/${PROJECTID}/logo`)
				  .then(response => response.json())
				  .then(data => {
					console.log("API Response:", data);
			  
					// Check if the response contains a logo URL
					if (data.logo) {
					  // Loop through all logo elements and update their src attribute
					  Array.from(logoElements).forEach(logoElement => {
						logoElement.src = data.logo;
					  });
					} else {
					  console.error('Logo URL not found in the response');
					}
				  })
				  .catch(error => {
					console.error('Error fetching the logo:', error);
				  });
			}
			
			function updateAddressDetails() {
				fetch(`http://localhost:3001/properties/${PROJECTID}/address`)
					.then(response => response.json())
					.then(data => {
						if (data) {
							// Log the address details for debugging
							console.log('Address details:', data);
			
							// Update phone number
							var phoneElements = document.querySelectorAll('.link-phone');
							phoneElements.forEach(element => {
								element.textContent = data.contactNo;
								element.href = `tel:${data.contactNo}`;
							});
			
							// Update email
							var emailElements = document.querySelectorAll('.link-aemail');
							emailElements.forEach(element => {
								element.textContent = data.emailId;
								element.href = `mailto:${data.emailId}`;
							});
			
							// Update location
							var locationElements = document.querySelectorAll('.link-location');
							locationElements.forEach(element => {
								element.textContent = `${data.street}, ${data.city}, ${data.state}, ${data.pincode}`;
							});
						} else {
							console.error('No address details found in the response');
						}
					})
					.catch(error => {
						console.error('Error fetching the address details:', error);
					});
			}
			
			function updateAboutSection() {
				// Fetching API data for the About Us section
				fetch(`http://localhost:3001/properties/${PROJECTID}/about`)
					.then(response => response.json())
					
					.then(data => {
						console.log("About Section ",data)
						// Assuming the response data is an array with a single object
						const aboutData = data[0];
			
						// Update the About Us image
						const aboutImageElement = document.querySelector('.dynamicAboutUsImage');
						aboutImageElement.src = aboutData.image;
						aboutImageElement.alt = aboutData.title;
			
						// Update the About Us heading
						const aboutHeadingElement = document.querySelector('.dynamicAboutUsHead');
						aboutHeadingElement.textContent = aboutData.title;
			
						// Update the About Us paragraph
						const aboutParagraphElement = document.querySelector('.dynamicAboutUsPara');
						aboutParagraphElement.textContent = aboutData.description;
						
						// Optionally, adjust image dimensions (if necessary)
						aboutImageElement.style.width = '300px';
						aboutImageElement.style.height = '300px';
					})
					.catch(error => console.error('Error fetching about data:', error));
			}
			
			let swiperInstance = null;
			
			
			
			
			function updateCarouselSlides() {
				fetch(`http://localhost:3001/properties/${PROJECTID}/banner`)
				  .then(response => response.json())
				  .then(data => {
					if (data.banners && data.banners.length > 0) {
					  const swiperWrapper = document.querySelector('.swiper-wrapper');
					  swiperWrapper.innerHTML = ''; // Clear existing slides
			  
					  data.banners.forEach((banner, index) => {
						const slide = document.createElement('div');
						slide.className = 'swiper-slide';
						slide.style.backgroundImage = `url(${banner.image})`; // Set the background image
			  
						// Basic slide structure without complex HTML
						slide.innerHTML = `
						  <div class="slide-content">
							<h2 class="slide-title">${banner.heading}</h2>
							<p class="slide-subheading">${banner.subHeading}</p>
							<a href="${banner.link || '#'}" class="slide-button">${banner.buttonText || 'Learn More'}</a>
						  </div>
						`;
			  
						swiperWrapper.appendChild(slide);
					  });
			  
					  if (swiperInstance) {
						swiperInstance.update(); // Update Swiper if it is already initialized
					  } else {
						initializeSwiper(); // Initialize Swiper if not yet initialized
					  }
					} else {
					  console.error('No banners found in the response');
					}
				  })
				  .catch(error => {
					console.error('Error fetching the banners:', error);
				  });
			  }
			  
			  
			
			

			function updateAboutUsBanner() {
				const apiUrl = `http://localhost:3001/properties/${PROJECTID}/banner`;
			
				// Fetch banner data from the API using Fetch
				fetch(apiUrl)
				  .then(response => {
					// Check if the response is ok (status in the range 200-299)
					if (!response.ok) {
					  throw new Error(`HTTP error! status: ${response.status}`);
					}
					return response.json(); // Parse the JSON from the response
				  })
				  .then(data => {
					// Log the response data
					console.log('API Response:', data);
			
					// Find the banner with heading "Aboutus"
					const aboutUsBanner = data.categoryBanners.find(banner => 
					  banner.heading.toLowerCase() === "aboutus"
					);
			
					// Check if the banner exists and has a valid image URL
					if (aboutUsBanner && aboutUsBanner.image) {
					  // Log the image URL
					  console.log('About Us Banner Image URL:', aboutUsBanner.image);
			
					  // Select the section where the background image needs to be applied
					  const aboutUsSection = document.querySelector('.breadcrumbs-01');
			
					  // Log the aboutUsSection to confirm it's selected correctly
					  console.log('About Us Section:', aboutUsSection);
			
					  // Apply the background image using inline CSS
					  aboutUsSection.style.backgroundImage = `url('${aboutUsBanner.image}')`;
					  aboutUsSection.style.backgroundSize = 'cover'; // Ensures the image covers the section
					  aboutUsSection.style.backgroundPosition = 'center'; // Centers the image
					  aboutUsSection.style.backgroundRepeat = 'no-repeat'; // Avoid repeating the image
					} else {
					  console.error('No valid banner found with the heading "Aboutus".');
					}
				  })
				  .catch(error => {
					console.error("Error fetching banner data:", error);
				  });
			}

			function updateContactsBanner(){
				const apiUrl = `http://localhost:3001/properties/${PROJECTID}/banner`;
				// Fetch banner data from the API using Fetch
				fetch(apiUrl)
				  .then(response => {
					// Check if the response is ok (status in the range 200-299)
					if (!response.ok) {
					  throw new Error(`HTTP error! status: ${response.status}`);
					}
					return response.json(); // Parse the JSON from the response
				  })
				  .then(data => {
					// Log the response data
					console.log('API Response:', data);
			  
					// Find the banner with heading "Aboutus"
					const aboutUsBanner = data.categoryBanners.find(banner => 
					  banner.heading.toLowerCase() === "contacts"
					);
			  
					// Check if the banner exists and has a valid image URL
					if (aboutUsBanner && aboutUsBanner.image) {
					  // Log the image URL
					  console.log('About Us Banner Image URL:', aboutUsBanner.image);
			  
					  // Select the section where the background image needs to be applied
					  const aboutUsSection = document.querySelector('.breadcrumbs-02');
			  
					  // Log the aboutUsSection to confirm it's selected correctly
					  console.log('About Us Section:', aboutUsSection);
			  
					  // Apply the background image using inline CSS
					  aboutUsSection.style.backgroundImage = `url('${aboutUsBanner.image}')`;
					  aboutUsSection.style.backgroundSize = 'cover'; // Ensures the image covers the section
					  aboutUsSection.style.backgroundPosition = 'center'; // Centers the image
					  aboutUsSection.style.backgroundRepeat = 'no-repeat'; // Avoid repeating the image
					} else {
					  console.error('No valid banner found with the heading "Aboutus".');
					}
				  })
				  .catch(error => {
					console.error("Error fetching banner data:", error);
				  });
			  }

			  function updateTypographyBAnner(){
				const apiUrl = `http://localhost:3001/properties/${PROJECTID}/banner`;
				// Fetch banner data from the API using Fetch
				fetch(apiUrl)
				  .then(response => {
					// Check if the response is ok (status in the range 200-299)
					if (!response.ok) {
					  throw new Error(`HTTP error! status: ${response.status}`);
					}
					return response.json(); // Parse the JSON from the response
				  })
				  .then(data => {
					// Log the response data
					console.log('API Response:', data);
			  
					// Find the banner with heading "Aboutus"
					const aboutUsBanner = data.categoryBanners.find(banner => 
					  banner.heading.toLowerCase() === "typography"
					);
			  
					// Check if the banner exists and has a valid image URL
					if (aboutUsBanner && aboutUsBanner.image) {
					  // Log the image URL
					  console.log('About Us Banner Image URL:', aboutUsBanner.image);
			  
					  // Select the section where the background image needs to be applied
					  const aboutUsSection = document.querySelector('.breadcrumbs-03');
			  
					  // Log the aboutUsSection to confirm it's selected correctly
					  console.log('About Us Section:', aboutUsSection);
			  
					  // Apply the background image using inline CSS
					  aboutUsSection.style.backgroundImage = `url('${aboutUsBanner.image}')`;
					  aboutUsSection.style.backgroundSize = 'cover'; // Ensures the image covers the section
					  aboutUsSection.style.backgroundPosition = 'center'; // Centers the image
					  aboutUsSection.style.backgroundRepeat = 'no-repeat'; // Avoid repeating the image
					} else {
					  console.error('No valid banner found with the heading "Aboutus".');
					}
				  })
				  .catch(error => {
					console.error("Error fetching banner data:", error);
				  });
			  }

			  function updateProductDetails() { 
				fetch(`http://localhost:3001/properties/${PROJECTID}/product`)
				  .then(response => response.json())
				  .then(data => {
					if (data.allProducts && data.allProducts.length > 0) {
					  console.log('Product details:', data);
			  
					  // Select all product elements in the DOM
					  const productElements = document.querySelectorAll('.product');
			  
					  data.allProducts.forEach((product, index) => {
						// Ensure the index doesn't exceed the number of product elements in the DOM
						if (index < productElements.length) {
						  const productElement = productElements[index];
			  
						  // Update product title
						  const titleElement = productElement.querySelector('.product-title');
						  if (titleElement) {
							titleElement.textContent = product.title;
						  }
			  
						  // Update product image
						  const imageElement = productElement.querySelector('.product-figure img');
						  if (imageElement) {
							imageElement.src = product.images[0];
							imageElement.alt = product.title;
							imageElement.style.width = "160px"; // Maintain the width as per original design
							imageElement.style.height = "160px"; // Maintain the height as per original design
						  }
			  
						  // Update product price
						  const priceElement = productElement.querySelector('.product-price');
						  if (priceElement) {
							priceElement.textContent = `$${product.price}`;
						  }
						} else {
						  console.error(`No product element found for product at index ${index}`);
						}
					  });
					} else {
					  console.error('No products found in the response');
					}
				  })
				  .catch(error => {
					console.error('Error fetching the product details:', error);
				  });
			  }

			  function fetchAndDisplayGalleryProducts() {
				const apiUrl = `http://localhost:3001/properties/${PROJECTID}/banner`;
			
				// Fetch the product data from the API
				fetch(apiUrl)
				.then(response => response.json())
				.then(data => {
					// Get the container where gallery items will be appended
					const container = document.querySelector('.rd-navbar-project-content .row');
			
					// Clear existing gallery items if needed
					container.innerHTML = '';
			
					// Filter banners where heading is "Gallery"
					const galleryBanners = data.categoryBanners.filter(banner => banner.heading.toLowerCase() === "gallery");
			
					// Loop through the filtered gallery banners and create gallery items
					galleryBanners.forEach(banner => {
						// Create a new div for each gallery item
						const colDiv = document.createElement('div');
						colDiv.classList.add('col-6');
			
						// Create the article element for the thumbnail
						const articleElement = document.createElement('article');
						articleElement.classList.add('thumbnail', 'thumbnail-creative');
			
						// Create the anchor element
						const anchorElement = document.createElement('a');
						anchorElement.href = banner.image;  // Full-size image URL
						anchorElement.dataset.lightgallery = 'item';  // LightGallery attribute
			
						// Create the div for the image figure
						const figureDiv = document.createElement('div');
						figureDiv.classList.add('thumbnail-creative-figure');
			
						// Create and append the image element
						const imageElement = document.createElement('img');
						imageElement.src = banner.image;  // Thumbnail image URL
						imageElement.alt = banner.heading;
						imageElement.width = 195;  // Set width to match your example
						imageElement.height = 164;  // Set height to match your example
			
						// Append the image to the figure div
						figureDiv.appendChild(imageElement);
			
						// Create the caption div
						const captionDiv = document.createElement('div');
						captionDiv.classList.add('thumbnail-creative-caption');
			
						// Create and append the magnifier icon
						const iconSpan = document.createElement('span');
						iconSpan.classList.add('icon', 'thumbnail-creative-icon', 'linearicons-magnifier');
						captionDiv.appendChild(iconSpan);
			
						// Append the figure and caption to the anchor element
						anchorElement.appendChild(figureDiv);
						anchorElement.appendChild(captionDiv);
			
						// Append the anchor to the article
						articleElement.appendChild(anchorElement);
			
						// Append the article to the colDiv
						colDiv.appendChild(articleElement);
			
						// Append the colDiv to the container
						container.appendChild(colDiv);
					});
			
					// Initialize LightGallery if required (uncomment if you have this library)
					// lightGallery(container, {selector: '[data-lightgallery="item"]'});
				})
				.catch(error => {
					console.error('Error fetching data:', error);
				});
			}
			
			  
			
			

	// Initialize scripts that require a finished document
	$(function () {
		isNoviBuilder = window.xMode;

		/**
		 * @desc Calculate the height of swiper slider basing on data attr
		 * @param {object} object - slider jQuery object
		 * @param {string} attr - attribute name
		 * @return {number} slider height
		 */
		function getSwiperHeight(object, attr) {
			var val = object.attr("data-" + attr),
					dim;

			if (!val) {
				return undefined;
			}

			dim = val.match(/(px)|(%)|(vh)|(vw)$/i);

			if (dim.length) {
				switch (dim[0]) {
					case "px":
						return parseFloat(val);
					case "vh":
						return $window.height() * (parseFloat(val) / 100);
					case "vw":
						return $window.width() * (parseFloat(val) / 100);
					case "%":
						return object.width() * (parseFloat(val) / 100);
				}
			} else {
				return undefined;
			}
		}

		/**
		 * @desc Toggle swiper videos on active slides
		 * @param {object} swiper - swiper slider
		 */
		function toggleSwiperInnerVideos(swiper) {
			var prevSlide = $(swiper.slides[swiper.previousIndex]),
					nextSlide = $(swiper.slides[swiper.activeIndex]),
					videos,
					videoItems = prevSlide.find("video");

			for (var i = 0; i < videoItems.length; i++) {
				videoItems[i].pause();
			}

			videos = nextSlide.find("video");
			if (videos.length) {
				videos.get(0).play();
			}
		}

		/**
		 * @desc Toggle swiper animations on active slides
		 * @param {object} swiper - swiper slider
		 */
		function toggleSwiperCaptionAnimation(swiper) {
			var prevSlide = $(swiper.container).find("[data-caption-animate]"),
					nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
					delay,
					duration,
					nextSlideItem,
					prevSlideItem;

			for (var i = 0; i < prevSlide.length; i++) {
				prevSlideItem = $(prevSlide[i]);

				prevSlideItem.removeClass("animated")
						.removeClass(prevSlideItem.attr("data-caption-animate"))
						.addClass("not-animated");
			}


			var tempFunction = function (nextSlideItem, duration) {
				return function () {
					nextSlideItem
							.removeClass("not-animated")
							.addClass(nextSlideItem.attr("data-caption-animate"))
							.addClass("animated");
					if (duration) {
						nextSlideItem.css('animation-duration', duration + 'ms');
					}
				};
			};

			for (var i = 0; i < nextSlide.length; i++) {
				nextSlideItem = $(nextSlide[i]);
				delay = nextSlideItem.attr("data-caption-delay");
				duration = nextSlideItem.attr('data-caption-duration');
				if (!isNoviBuilder) {
					if (delay) {
						setTimeout(tempFunction(nextSlideItem, duration), parseInt(delay, 10));
					} else {
						tempFunction(nextSlideItem, duration);
					}

				} else {
					nextSlideItem.removeClass("not-animated")
				}
			}
		}

		/**
		 * @desc Initialize owl carousel plugin
		 * @param {object} c - carousel jQuery object
		 */
		function initOwlCarousel(c) {
			var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
					values = [0, 576, 768, 992, 1200, 1600],
					responsive = {};

			for (var j = 0; j < values.length; j++) {
				responsive[values[j]] = {};
				for (var k = j; k >= -1; k--) {
					if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
						responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
					}
					if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
						responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
					}
					if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
						responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
					}
				}
			}

			// Enable custom pagination
			if (c.attr('data-dots-custom')) {
				c.on("initialized.owl.carousel", function (event) {
					var carousel = $(event.currentTarget),
							customPag = $(carousel.attr("data-dots-custom")),
							active = 0;

					if (carousel.attr('data-active')) {
						active = parseInt(carousel.attr('data-active'), 10);
					}

					carousel.trigger('to.owl.carousel', [active, 300, true]);
					customPag.find("[data-owl-item='" + active + "']").addClass("active");

					customPag.find("[data-owl-item]").on('click', function (e) {
						e.preventDefault();
						carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
					});

					carousel.on("translate.owl.carousel", function (event) {
						customPag.find(".active").removeClass("active");
						customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
					});
				});
			}

			c.on("initialized.owl.carousel", function () {
				initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
			});

			// Create custom Numbering
			if (typeof(c.attr("data-numbering")) !== 'undefined') {
				var numberingObject = $(c.attr("data-numbering"));

				c.on('initialized.owl.carousel changed.owl.carousel', function (numberingObject) {
					return function (e) {
						if (!e.namespace) return;
						if (isNoviBuilder ? false : c.attr("data-loop") !== "false") {
							var tempFix = (e.item.index + 1) - (e.relatedTarget.clones().length / 2);
							if (tempFix > 0) {
								numberingObject.find('.numbering-current').text(tempFix > e.item.count ? tempFix % e.item.count : tempFix);
							} else {
								numberingObject.find('.numbering-current').text(e.item.index + 1);
							}
						} else {
							numberingObject.find('.numbering-current').text(e.item.index + 1);
						}

						numberingObject.find('.numbering-count').text(e.item.count);
					};
				}(numberingObject));
			}

			c.owlCarousel({
				autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
				loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
				items: 1,
				merge: true,
				center: c.attr("data-center") === "true",
				dotsContainer: c.attr("data-pagination-class") || false,
				navContainer: c.attr("data-navigation-class") || false,
				mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
				nav: c.attr("data-nav") === "true",
				dots: c.attr("data-dots") === "true",
				dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
				animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
				animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
				responsive: responsive,
				smartSpeed: c.attr('data-smart-speed') ? c.attr('data-smart-speed') : 250,
				navText: function () {
					try {
						return JSON.parse(c.attr("data-nav-text"));
					} catch (e) {
						return [];
					}
				}(),
				navClass: function () {
					try {
						return JSON.parse(c.attr("data-nav-class"));
					} catch (e) {
						return ['owl-prev', 'owl-next'];
					}
				}()
			});
		}

		/**
		 * @desc Check the element whas been scrolled into the view
		 * @param {object} elem - jQuery object
		 * @return {boolean}
		 */
		function isScrolledIntoView(elem) {
			if (!isNoviBuilder) {
				return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
			}
			else {
				return true;
			}
		}

		/**
		 * @desc Calls a function when element has been scrolled into the view
		 * @param {object} element - jQuery object
		 * @param {function} func - callback function
		 */
		function lazyInit(element, func) {
			$document.on('scroll', function () {
				if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
					func.call();
					element.addClass('lazy-loaded');
				}
			}).trigger("scroll");
		}

		/**
		 * @desc Attach form validation to elements
		 * @param {object} elements - jQuery object
		 */
		function attachFormValidator(elements) {
			// Custom validator - phone number
			regula.custom({
				name: 'PhoneNumber',
				defaultMessage: 'Invalid phone number format',
				validator: function () {
					if (this.value === '') return true;
					else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value);
				}
			});

			for (var i = 0; i < elements.length; i++) {
				var o = $(elements[i]), v;
				o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
				v = o.parent().find(".form-validation");
				if (v.is(":last-child")) o.addClass("form-control-last-child");
			}

			elements.on('input change propertychange blur', function (e) {
				var $this = $(this), results;

				if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
				if ($this.parents('.rd-mailform').hasClass('success')) return;

				if ((results = $this.regula('validate')).length) {
					for (i = 0; i < results.length; i++) {
						$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
					}
				} else {
					$this.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}).regula('bind');

			var regularConstraintsMessages = [
				{
					type: regula.Constraint.Required,
					newMessage: "The text field is required."
				},
				{
					type: regula.Constraint.Email,
					newMessage: "The email is not a valid email."
				},
				{
					type: regula.Constraint.Numeric,
					newMessage: "Only numbers are required"
				},
				{
					type: regula.Constraint.Selected,
					newMessage: "Please choose an option."
				}
			];


			for (var i = 0; i < regularConstraintsMessages.length; i++) {
				var regularConstraint = regularConstraintsMessages[i];

				regula.override({
					constraintType: regularConstraint.type,
					defaultMessage: regularConstraint.newMessage
				});
			}
		}

		/**
		 * @desc Check if all elements pass validation
		 * @param {object} elements - object of items for validation
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function isValidated(elements, captcha) {
			var results, errors = 0;

			if (elements.length) {
				for (var j = 0; j < elements.length; j++) {

					var $input = $(elements[j]);
					if ((results = $input.regula('validate')).length) {
						for (k = 0; k < results.length; k++) {
							errors++;
							$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
						}
					} else {
						$input.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}

				if (captcha) {
					if (captcha.length) {
						return validateReCaptcha(captcha) && errors === 0
					}
				}

				return errors === 0;
			}
			return true;
		}

		/**
		 * @desc Validate google reCaptcha
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function validateReCaptcha(captcha) {
			var captchaToken = captcha.find('.g-recaptcha-response').val();

			if (captchaToken.length === 0) {
				captcha
						.siblings('.form-validation')
						.html('Please, prove that you are not robot.')
						.addClass('active');
				captcha
						.closest('.form-wrap')
						.addClass('has-error');

				captcha.on('propertychange', function () {
					var $this = $(this),
							captchaToken = $this.find('.g-recaptcha-response').val();

					if (captchaToken.length > 0) {
						$this
								.closest('.form-wrap')
								.removeClass('has-error');
						$this
								.siblings('.form-validation')
								.removeClass('active')
								.html('');
						$this.off('propertychange');
					}
				});

				return false;
			}

			return true;
		}

		/**
		 * @desc Initialize Google reCaptcha
		 */
		window.onloadCaptchaCallback = function () {
			for (var i = 0; i < plugins.captcha.length; i++) {
				var $capthcaItem = $(plugins.captcha[i]);

				grecaptcha.render(
						$capthcaItem.attr('id'),
						{
							sitekey: $capthcaItem.attr('data-sitekey'),
							size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
							theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
							callback: function (e) {
								$('.recaptcha').trigger('propertychange');
							}
						}
				);
				$capthcaItem.after("<span class='form-validation'></span>");
			}
		};

		/**
		 * @desc Initialize Bootstrap tooltip with required placement
		 * @param {string} tooltipPlacement
		 */
		function initBootstrapTooltip(tooltipPlacement) {
			plugins.bootstrapTooltip.tooltip('dispose');

			if (window.innerWidth < 576) {
				plugins.bootstrapTooltip.tooltip({placement: 'bottom'});
			} else {
				plugins.bootstrapTooltip.tooltip({placement: tooltipPlacement});
			}
		}

		/**
		 * @desc Initialize the gallery with set of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initLightGallery ( itemsToInit, addClass ) {
			if ( !isNoviBuilder ) {
				$( itemsToInit ).lightGallery( {
					thumbnail: $( itemsToInit ).attr( "data-lg-thumbnail" ) !== "false",
					selector: "[data-lightgallery='item']",
					autoplay: $( itemsToInit ).attr( "data-lg-autoplay" ) === "true",
					pause: parseInt( $( itemsToInit ).attr( "data-lg-autoplay-delay" ) ) || 5000,
					addClass: addClass,
					mode: $( itemsToInit ).attr( "data-lg-animation" ) || "lg-slide",
					loop: $( itemsToInit ).attr( "data-lg-loop" ) !== "false"
				} );
			}
		}

		/**
		 * @desc Initialize the gallery with dynamic addition of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initDynamicLightGallery ( itemsToInit, addClass ) {
			if ( !isNoviBuilder ) {
				$( itemsToInit ).on( "click", function () {
					$( itemsToInit ).lightGallery( {
						thumbnail: $( itemsToInit ).attr( "data-lg-thumbnail" ) !== "false",
						selector: "[data-lightgallery='item']",
						autoplay: $( itemsToInit ).attr( "data-lg-autoplay" ) === "true",
						pause: parseInt( $( itemsToInit ).attr( "data-lg-autoplay-delay" ) ) || 5000,
						addClass: addClass,
						mode: $( itemsToInit ).attr( "data-lg-animation" ) || "lg-slide",
						loop: $( itemsToInit ).attr( "data-lg-loop" ) !== "false",
						dynamic: true,
						dynamicEl: JSON.parse( $( itemsToInit ).attr( "data-lg-dynamic-elements" ) ) || []
					} );
				} );
			}
		}

		/**
		 * @desc Initialize the gallery with one image
		 * @param {object} itemToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initLightGalleryItem ( itemToInit, addClass ) {
			if ( !isNoviBuilder ) {
				$( itemToInit ).lightGallery( {
					selector: "this",
					addClass: addClass,
					counter: false,
					youtubePlayerParams: {
						modestbranding: 1,
						showinfo: 0,
						rel: 0,
						controls: 0
					},
					vimeoPlayerParams: {
						byline: 0,
						portrait: 0
					}
				} );
			}
		}

		// Google ReCaptcha
		if (plugins.captcha.length) {
			$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
		}

		// Additional class on html if mac os.
		if (navigator.platform.match(/(Mac)/i)) {
			$html.addClass("mac-os");
		}

		// Adds some loosing functionality to IE browsers (IE Polyfills)
		if (isIE) {
			if (isIE < 10) {
				$html.addClass("lt-ie-10");
			}

			if (isIE < 11) {
				$.getScript('js/pointer-events.min.js')
						.done(function () {
							$html.addClass("ie-10");
							PointerEventsPolyfill.initialize({});
						});
			}

			if (isIE === 11) {
				$html.addClass("ie-11");
			}

			if (isIE === 12) {
				$html.addClass("ie-edge");
			}
		}

		// Bootstrap Tooltips
		if (plugins.bootstrapTooltip.length) {
			var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
			initBootstrapTooltip(tooltipPlacement);

			$window.on('resize orientationchange', function () {
				initBootstrapTooltip(tooltipPlacement);
			})
		}

		// Bootstrap tabs
		if (plugins.bootstrapTabs.length) {
			for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
				var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

				//If have slick carousel inside tab - resize slick carousel on click
				if (bootstrapTabsItem.find('.slick-slider').length) {
					bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
						var $this = $(this);
						var setTimeOutTime = isNoviBuilder ? 1500 : 300;

						setTimeout(function () {
							$this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
						}, setTimeOutTime);
					}, bootstrapTabsItem));
				}

				if (bootstrapTabsItem.attr('data-view-triggerable') === 'true') {
					(function (bootstrapTabsItem) {
						bootstrapTabsItem.on('shown.bs.tab', function (event) {
							var prevTriggerable = bootstrapTabsItem.find('[data-view-trigger="' + event.relatedTarget.getAttribute('href') + '"]'),
									triggerable = bootstrapTabsItem.find('[data-view-trigger="' + event.target.getAttribute('href') + '"]');

							prevTriggerable.removeClass('active');
							triggerable.addClass('active');
						});

					})(bootstrapTabsItem);
				}
			}
		}

		// Copyright Year (Evaluates correct copyright year)
		if (plugins.copyrightYear.length) {
			plugins.copyrightYear.text(initialDate.getFullYear());
		}

		// Page loader
		if (plugins.preloader.length) {
			loaderTimeoutId = setTimeout(function () {
				if (!windowReady && !isNoviBuilder) plugins.preloader.removeClass('loaded');
			}, 2000);
		}

		// Add custom styling options for input[type="radio"]
		if (plugins.radio.length) {
			for (var i = 0; i < plugins.radio.length; i++) {
				$(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
			}
		}

		// Add custom styling options for input[type="checkbox"]
		if (plugins.checkbox.length) {
			for (var i = 0; i < plugins.checkbox.length; i++) {
				$(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
			}
		}

		// UI To Top
		if (isDesktop && !isNoviBuilder) {
			$().UItoTop({
				easingType: 'easeOutQuad',
				containerClass: 'ui-to-top mdi mdi-arrow-up'
			});
		}

		// RD Navbar
		if (plugins.rdNavbar.length) {
			var aliaces, i, j, len, value, values, responsiveNavbar;

			aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
			values = [0, 576, 768, 992, 1200, 1600];
			responsiveNavbar = {};

			for (i = j = 0, len = values.length; j < len; i = ++j) {
				value = values[i];
				if (!responsiveNavbar[values[i]]) {
					responsiveNavbar[values[i]] = {};
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'layout')) {
					responsiveNavbar[values[i]].layout = plugins.rdNavbar.attr('data' + aliaces[i] + 'layout');
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
					responsiveNavbar[values[i]]['deviceLayout'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout');
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
					responsiveNavbar[values[i]]['focusOnHover'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
					responsiveNavbar[values[i]]['autoHeight'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
				}

				if (isNoviBuilder) {
					responsiveNavbar[values[i]]['stickUp'] = false;
				} else if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
					responsiveNavbar[values[i]]['stickUp'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true';
				}

				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
					responsiveNavbar[values[i]]['stickUpOffset'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
				}
			}


			plugins.rdNavbar.RDNavbar({
				anchorNav: !isNoviBuilder,
				stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
				responsive: responsiveNavbar,
				callbacks: {
					onStuck: function () {
						var navbarSearch = this.$element.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
						}
					},
					onDropdownOver: function () {
						return !isNoviBuilder;
					},
					onUnstuck: function () {
						if (this.$clone === null)
							return;

						var navbarSearch = this.$clone.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
							navbarSearch.trigger('blur');
						}

					}
				}
			});


			if (plugins.rdNavbar.attr("data-body-class")) {
				document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
			}
		}

		// Swiper
		if (plugins.swiper.length) {
			for (var i = 0; i < plugins.swiper.length; i++) {
				var s = $(plugins.swiper[i]);
				var pag = s.parent().hasClass('swiper-custom-container') ? s.parent().find(".swiper-pagination") : s.find(".swiper-pagination"),
						next = s.parent().hasClass('swiper-custom-container') ? s.parent().find(".swiper-button-next") : s.find(".swiper-button-next"),
						prev = s.parent().hasClass('swiper-custom-container') ? s.parent().find(".swiper-button-prev") : s.find(".swiper-button-prev"),
						bar = s.find(".swiper-scrollbar"),
						swiperSlide = s.find(".swiper-slide"),
						autoplay = false;

				for (var j = 0; j < swiperSlide.length; j++) {
					var $this = $(swiperSlide[j]),
							url;

					if (url = $this.attr("data-slide-bg")) {
						$this.css({
							"background-image": "url(" + url + ")",
							"background-size": "cover"
						})
					}
				}

				swiperSlide.end()
						.find("[data-caption-animate]")
						.addClass("not-animated")
						.end();

				s.swiper({
					autoplay: s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
					direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
					effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
					speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
					keyboardControl: s.attr('data-keyboard') === "true",
					mousewheelControl: s.attr('data-mousewheel') === "true",
					mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
					nextButton: next.length ? next.get(0) : null,
					prevButton: prev.length ? prev.get(0) : null,
					pagination: pag.length ? pag.get(0) : null,
					paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
					paginationBulletRender: (function (pag) {
						return function (swiper, index, className) {
							if (pag.attr("data-index-bullet") === "true") {
								return '<span class="' + className + '">' + (index + 1) + '</span>';
							} else if (pag.attr("data-bullet-custom") === "true") {
								return '<span class="' + className + '">' +
										'  <svg width="100%" height="100%" viewbox="0 0 24 24">' +
										'    <circle class="swiper-bullet-line" cx="12" cy="12" r="10"></circle>' +
										'    <circle class="swiper-bullet-line-2" cx="12" cy="12" r="10"></circle>' +
										'  </svg>' +
										'</span>';
							} else {
								return '<span class="' + className + '"></span>';
							}
						}
					})(pag),
					scrollbar: bar.length ? bar.get(0) : null,
					scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
					scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
					loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
					loopAdditionalSlides: s.attr('data-add-slides') ? s.attr('data-add-slides') : 0,
					simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
					onTransitionStart: function (swiper) {
						toggleSwiperInnerVideos(swiper);
					},
					onTransitionEnd: function (swiper) {
						toggleSwiperCaptionAnimation(swiper);
					},
					onInit: (function (s) {
						return function (swiper) {
							toggleSwiperInnerVideos(swiper);
							toggleSwiperCaptionAnimation(swiper);

							var $swiper = $(s);

							var swiperCustomIndex = $swiper.find('.swiper-pagination__fraction-index').get(0),
									swiperCustomCount = $swiper.find('.swiper-pagination__fraction-count').get(0);

							if (swiperCustomIndex && swiperCustomCount) {
								swiperCustomIndex.innerHTML = formatIndex(swiper.realIndex + 1);
								if (swiperCustomCount) {
									swiperCustomCount.innerHTML = formatIndex(swiper.slides.not(".swiper-slide-duplicate").length);
								}
							}
						}
					}(s)),
					onSlideChangeStart: (function (s) {
						return function (swiper) {
							var swiperCustomIndex = $(s).find('.swiper-pagination__fraction-index').get(0);
							var activeSlideIndex, slidesCount;

							if (swiperCustomIndex) {
								swiperCustomIndex.innerHTML = formatIndex(swiper.realIndex + 1);
							}

							activeSlideIndex = swiper.activeIndex;
							slidesCount = swiper.slides.not(".swiper-slide-duplicate").length;

							if (activeSlideIndex === slidesCount + 1) {
								activeSlideIndex = 1;
							} else if (activeSlideIndex === 0) {
								activeSlideIndex = slidesCount;
							}
							if (swiper.slides[activeSlideIndex - 1].getAttribute("data-slide-title")) {
								$(swiper.container).find('.swiper-button-next .title')[0].innerHTML = swiper.slides[activeSlideIndex +
								1].getAttribute("data-slide-title");
								$(swiper.container).find('.swiper-button-prev .title')[0].innerHTML = swiper.slides[activeSlideIndex -
								1].getAttribute("data-slide-title");
							}

							if (swiper.slides[activeSlideIndex - 1].getAttribute("data-slide-subtitle")) {
								$(swiper.container).find('.swiper-button-prev .subtitle')[0].innerHTML = swiper.slides[activeSlideIndex -
								1].getAttribute("data-slide-subtitle");
								$(swiper.container).find('.swiper-button-next .subtitle')[0].innerHTML = swiper.slides[activeSlideIndex +
								1].getAttribute("data-slide-subtitle");
							}
							//Replace btn img
							if ($(swiper.container).find('.preview__img')[0] !== undefined) {
								$(swiper.container).find('.swiper-button-prev .preview__img').css("background-image", "url(" +
										swiper.slides[activeSlideIndex - 1].getAttribute("data-slide-bg") + ")");
								$(swiper.container).find('.swiper-button-next .preview__img').css("background-image", "url(" +
										swiper.slides[activeSlideIndex + 1].getAttribute("data-slide-bg") + ")");
							}
						}
					}(s))
				});

				$window.on("resize", (function (s) {
					return function () {
						var mh = getSwiperHeight(s, "min-height"),
								h = getSwiperHeight(s, "height");
						if (h) {
							s.css("height", mh ? mh > h ? mh : h : h);
						}
					}
				})(s)).trigger("resize");
			}
		}

		function formatIndex(index) {
			return index < 10 ? '0' + index : index;
		}

		// Owl carousel
		if (plugins.owl.length) {
			for (var i = 0; i < plugins.owl.length; i++) {
				var c = $(plugins.owl[i]);
				plugins.owl[i].owl = c;

				initOwlCarousel(c);
			}
		}

		// Isotope
		if (plugins.isotope.length) {
			var isogroup = [];
			for (var i = 0; i < plugins.isotope.length; i++) {
				var isotopeItem = plugins.isotope[i],
						isotopeInitAttrs = {
							itemSelector: '.isotope-item',
							layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
							filter: '*'
						};

				var iso = new Isotope(isotopeItem, isotopeInitAttrs);
				isotopeItem.isotope = iso;
				isogroup.push(iso);
			}

			$("[data-isotope-filter]").on("click", function (e) {
				e.preventDefault();
				var filter = $(this);

				filter.parents(".isotope-filters").find('.active').removeClass("active");
				filter.addClass("active");
				var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]'),
						isotopeAttrs = {
							itemSelector: '.isotope-item',
							layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
							filter: this.getAttribute("data-isotope-filter") === '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
						};

				iso.isotope(isotopeAttrs);
			}).eq(0).trigger("click")
		}

		// WOW
		if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
			new WOW().init();
		}

		// RD Input Label
		if (plugins.rdInputLabel.length) {
			plugins.rdInputLabel.RDInputLabel();
		}

		// Regula
		if (plugins.regula.length) {
			attachFormValidator(plugins.regula);
		}

		// RD Mailform
		if (plugins.rdMailForm.length) {
			var i, j, k,
					msg = {
						'MF000': 'Successfully sent!',
						'MF001': 'Recipients are not set!',
						'MF002': 'Form will not work locally!',
						'MF003': 'Please, define email field in your form!',
						'MF004': 'Please, define type of your form!',
						'MF254': 'Something went wrong with PHPMailer!',
						'MF255': 'Aw, snap! Something went wrong.'
					};

			for (i = 0; i < plugins.rdMailForm.length; i++) {
				var $form = $(plugins.rdMailForm[i]),
						formHasCaptcha = false;

				$form.attr('novalidate', 'novalidate').ajaxForm({
					data: {
						"form-type": $form.attr("data-form-type") || "contact",
						"counter": i
					},
					beforeSubmit: function (arr, $form, options) {
						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
								inputs = form.find("[data-constraints]"),
								output = $("#" + form.attr("data-form-output")),
								captcha = form.find('.recaptcha'),
								captchaFlag = true;

						output.removeClass("active error success");

						if (isValidated(inputs, captcha)) {

							// veify reCaptcha
							if (captcha.length) {
								var captchaToken = captcha.find('.g-recaptcha-response').val(),
										captchaMsg = {
											'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
											'CPT002': 'Something wrong with google reCaptcha'
										};

								formHasCaptcha = true;

								$.ajax({
									method: "POST",
									url: "bat/reCaptcha.php",
									data: {'g-recaptcha-response': captchaToken},
									async: false
								})
										.done(function (responceCode) {
											if (responceCode !== 'CPT000') {
												if (output.hasClass("snackbars")) {
													output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

													setTimeout(function () {
														output.removeClass("active");
													}, 3500);

													captchaFlag = false;
												} else {
													output.html(captchaMsg[responceCode]);
												}

												output.addClass("active");
											}
										});
							}

							if (!captchaFlag) {
								return false;
							}

							form.addClass('form-in-process');

							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
								output.addClass("active");
							}
						} else {
							return false;
						}
					},
					error: function (result) {
						if (isNoviBuilder)
							return;

						var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
								form = $(plugins.rdMailForm[this.extraData.counter]);

						output.text(msg[result]);
						form.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}
					},
					success: function (result) {
						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
								output = $("#" + form.attr("data-form-output")),
								select = form.find('select');

						form
								.addClass('success')
								.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}

						result = result.length === 5 ? result : 'MF255';
						output.text(msg[result]);

						if (result === "MF000") {
							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active success");
							}
						} else {
							if (output.hasClass("snackbars")) {
								output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active error");
							}
						}

						form.clearForm();

						if (select.length) {
							select.select2("val", "");
						}

						form.find('input, textarea').trigger('blur');

						setTimeout(function () {
							output.removeClass("active error success");
							form.removeClass('success');
						}, 3500);
					}
				});
			}
		}

		// lightGallery
		if (plugins.lightGallery.length) {
			for (var i = 0; i < plugins.lightGallery.length; i++) {
				initLightGallery(plugins.lightGallery[i]);
			}
		}

		// lightGallery item
		if (plugins.lightGalleryItem.length) {
			// Filter carousel items
			var notCarouselItems = [];

			for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
				if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
					!$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
					!$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
					notCarouselItems.push(plugins.lightGalleryItem[z]);
				}
			}

			plugins.lightGalleryItem = notCarouselItems;

			for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
				initLightGalleryItem(plugins.lightGalleryItem[i]);
			}
		}

		// Dynamic lightGallery
		if (plugins.lightDynamicGalleryItem.length) {
			for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
				initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
			}
		}

		// Material Parallax
		if (plugins.materialParallax.length) {
			if (!isNoviBuilder && !isIE && !isMobile) {
				plugins.materialParallax.parallax();

				// heavy pages fix
				$window.on('load', function () {
					setTimeout(function () {
						$window.scroll();
					}, 500);
				});
			} else {
				for (var i = 0; i < plugins.materialParallax.length; i++) {
					var parallax = $(plugins.materialParallax[i]),
							imgPath = parallax.data("parallax-img");

					parallax.css({
						"background-image": 'url(' + imgPath + ')',
						"background-size": "cover"
					});
				}
			}
		}

		// Winona buttons
		if (plugins.buttonWinona.length && !isNoviBuilder) {
			initWinonaButtons(plugins.buttonWinona);
		}

		function initWinonaButtons(buttons) {
			for (var i = 0; i < buttons.length; i++) {
				var $button = $(buttons[i]),
						innerContent = $button.html();

				$button.html('');
				$button.append('<div class="content-original">' + innerContent + '</div>');
				$button.append('<div class="content-dubbed">' + innerContent + '</div>');
			}
		}

		// Select2
		if (plugins.selectFilter.length) {
			var i;
			for (i = 0; i < plugins.selectFilter.length; i++) {
				var select = $(plugins.selectFilter[i]),
						selectStyle = 'html-' + select.attr('data-style') + '-select';
				$html.addClass(selectStyle);

				select.select2({
					placeholder: select.attr("data-placeholder") ? select.attr("data-placeholder") : false,
					minimumResultsForSearch: select.attr("data-minimum-results-search") ? select.attr("data-minimum-results-search") : -1,
					maximumSelectionSize: 3
				});
			}
		}

		// Slick carousel
		if (plugins.slick.length) {
			for (var i = 0; i < plugins.slick.length; i++) {
				var $slickItem = $(plugins.slick[i]);

				$slickItem.on('init', function (slick) {
					initLightGallery($('[data-lightgallery="group-slick"]'), 'lightGallery-in-carousel');
					initLightGallery($('[data-lightgallery="item-slick"]'), 'lightGallery-in-carousel');
				});

				$slickItem.slick({
					slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll'), 10) || 1,
					asNavFor: $slickItem.attr('data-for') || false,
					dots: $slickItem.attr("data-dots") === "true",
					infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") === "true",
					focusOnSelect: true,
					arrows: $slickItem.attr("data-arrows") === "true",
					swipe: $slickItem.attr("data-swipe") === "true",
					autoplay: $slickItem.attr("data-autoplay") === "true",
					centerMode: $slickItem.attr("data-center-mode") === "true",
					fade: $slickItem.attr("data-slide-effect") === "true",
					centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
					mobileFirst: true,
					appendArrows: $slickItem.attr("data-arrows-class") || $slickItem,
					nextArrow: $slickItem.attr('data-custom-arrows') === "true" ? '<button type="button" class="slick-next">' +
							'  <svg width="100%" height="100%" viewbox="0 0 78 78">' +
							'    <circle class="slick-button-line" cx="39" cy="39" r="36"></circle>' +
							'    <circle class="slick-button-line-2" cx="39" cy="39" r="36"></circle>' +
							'  </svg>' +
							'</button>' : '<button type="button" class="slick-next"></button>',
					prevArrow: $slickItem.attr('data-custom-arrows') === "true" ? '<button type="button" class="slick-prev">' +
							'  <svg width="100%" height="100%" viewbox="0 0 78 78">' +
							'    <circle class="slick-button-line" cx="39" cy="39" r="36"></circle>' +
							'    <circle class="slick-button-line-2" cx="39" cy="39" r="36"></circle>' +
							'  </svg>' +
							'</button>' : '<button type="button" class="slick-prev"></button>',
					responsive: [
						{
							breakpoint: 0,
							settings: {
								slidesToShow: parseInt($slickItem.attr('data-items'), 10) || 1,
								vertical: $slickItem.attr('data-vertical') === 'true' || false
							}
						},
						{
							breakpoint: 575,
							settings: {
								slidesToShow: parseInt($slickItem.attr('data-sm-items'), 10) || 1,
								vertical: $slickItem.attr('data-sm-vertical') === 'true' || false
							}
						},
						{
							breakpoint: 767,
							settings: {
								slidesToShow: parseInt($slickItem.attr('data-md-items'), 10) || 1,
								vertical: $slickItem.attr('data-md-vertical') === 'true' || false
							}
						},
						{
							breakpoint: 991,
							settings: {
								slidesToShow: parseInt($slickItem.attr('data-lg-items'), 10) || 1,
								vertical: $slickItem.attr('data-lg-vertical') === 'true' || false
							}
						},
						{
							breakpoint: 1199,
							settings: {
								slidesToShow: parseInt($slickItem.attr('data-xl-items'), 10) || 1,
								vertical: $slickItem.attr('data-xl-vertical') === 'true' || false
							}
						}
					]
				})

						.on('afterChange', function (event, slick, currentSlide, nextSlide) {
							var $this = $(this),
									childCarousel = $this.attr('data-child');

							if (childCarousel) {
								$(childCarousel + ' .slick-slide').removeClass('slick-current');
								$(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
							}
						});

				if ($slickItem.attr('data-fraction')) {
					(function () {
						var fractionElement = document.querySelectorAll($slickItem.attr('data-fraction'))[0],
								fractionCurrent = fractionElement.querySelectorAll('.slick-fraction-current')[0],
								fractionAll = fractionElement.querySelectorAll('.slick-fraction-all')[0];

						$slickItem.on('afterChange', function (slick) {
							fractionCurrent.innerText = leadingZero(this.slick.currentSlide + 1);
							fractionAll.innerText = leadingZero(this.slick.slideCount);
						});

						$slickItem.trigger('afterChange');
					})();
				}
			}
		}

		function leadingZero(decimal) {
			return decimal < 10 && decimal > 0 ? '0' + decimal : decimal;
		}

		// Multitoggles
		if (plugins.multitoggle.length) {
			multitoggles();
		}
	});
}());
