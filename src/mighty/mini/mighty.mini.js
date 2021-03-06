/*global Mighty*/
/*jslint browser: true, nomen: true*/
Mighty.define(['mighty.core', 'mighty/mini/mighty.mini.css'], function (core) {

	'use strict';

	return {

		// These options will be used as defaults
		options: {
			count: 3,
			more_count: 0,
			auto_refresh: false,
			auto_refresh_interval: 60000,
            qa: false,

			// These selectors will automatically run inside
			// the module and grab the resulting elements.
			ui: {
				reload: '.reload',
				cardsList: '.cards-list',
				cards: '.card',
				shareLinks: '.share',
				videos: '.card-video-poster'
			}
		},

		// Set up the widget
		_create: function () {

			var self = this;
			var options = self.options;
			var ui = self.ui;
			var element = self.element;
            var continuation = ui.cardsList[0].getAttribute('data-continuation');;

			ui.cardsList = ui.cardsList[0];

            function addShare(item) {
                var shareLink = core.createHTML('<a href="#" class="share-group">' +
                    '<i class="s-share-this"></i> Share ' +
                    '<i class="arrow s-icn-arw-bl-down"></i></a>'
                );

                var shareHTML = core.createHTML('<div class="card-meta-share">' +
                    '<ul>' +
                    '<li class="share facebook">Facebook</li>' +
                    '<li class="share twitter">Twitter</li>' +
                    '<li class="share googleplus">Google+</li>' +
                    '<li class="share pinterest">Pinterest</li>' +
                    '<li class="share stumbleupon">Stumble Upon</li>' +
                    '<li class="share reddit">Reddit</li>' +
                    '</ul>' +
                    '</div>'
                );

                core.bind(shareLink, 'click', toggleShare);
                core.query('.card-meta-end', item)[0].appendChild(shareLink);
                core.delegate(shareHTML, '.share', 'click', shareHandler);
                item.appendChild(shareHTML);
            }

            function toggleShare(event) {
                var element = event.target;
                var article = core.closest(event.target, 'article');
                var share = core.query('.card-meta-share', article)[0];

                if (core.hasClass(share, 'visible')) {
                    core.removeClass(share, 'visible');
                } else {
                    core.addClass(share, 'visible');
                }

                event.preventDefault();
            }

            function shareHandler(event) {
                event.preventDefault();
                var cardMedia = '';
                var cardDescription = '';
                var element = event.target;
                var article = core.closest(event.target, 'article');
                var cardUrl = article.getAttribute('data-url');
                var cardImage = core.query('.card-image', article);
                var headline = core.query('.headline', article);
                var comment = core.query('.card-comment', article);

                if (cardImage.length > 0) {
                    for (var i = 0, length = cardImage.length; i < length; i += 1) {
                        cardMedia = cardImage[i].getAttribute('style')
                            .replace(/background-image:url\('/gi, '')
                            .replace(/'\);/, '');
                    }
                }

                if (headline.length > 0) {
                    cardDescription = core.text(headline[0]);
                } else if (comment.length > 0) {
                    cardDescription = core.text(comment[0]);
                }

                switch (element.className) {
                    case 'share facebook':
                        window.open('http://www.facebook.com/sharer.php?u='+cardUrl+'&t='+cardDescription,'targetWindow','toolbar=no,location=1,status=1,statusbar=1,menubar=no,scrollbars=yes,resizable=yes,width=1024,height=580');
                        break;
                    case 'share twitter':
                        window.open('https://twitter.com/intent/tweet?text='+cardDescription+'&url='+encodeURIComponent(cardUrl)+'&related=engadget' ,'targetWindow','toolbar=no,location=1,status=1,statusbar=1,menubar=no,scrollbars=yes,resizable=yes,width=1024,height=580');return false;
                        break;
                    case 'share googleplus':
                        window.open('https://plus.google.com/share?url='+encodeURIComponent(cardUrl), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=1024,height=580');
                        break;
                    case 'share pinterest':
                        window.open('http://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(cardUrl)+'&media='+cardMedia+'&description='+cardDescription, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=1024,height=580');
                        break;
                    case 'share stumbleupon':
                        window.open('http://www.stumbleupon.com/badge/?url='+encodeURIComponent(cardUrl), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=1024,height=580');
                        break;
                    case 'share reddit':
                        window.open('http://www.reddit.com/submit?url='+encodeURIComponent(cardUrl),'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=1024,height=580');
                        break;
                }
            }

			function renderVideo(video) {
				var embedCode = getEmbedCode({
					contentSource: video.getAttribute('data-content-source'),
					url: video.getAttribute('data-url')
				});

				var dimensions = (embedCode.type === 'iframe') ? ' width="298" height="200"' : '';

				var videoHTML = core.createHTML('<' + embedCode.type +
					' src="' + embedCode.src + '"' + dimensions + '></' + embedCode.type + '>');

				video.parentNode.insertBefore(videoHTML, video.nextSibling);
				video.parentNode.removeChild(video);
			}

            for (var i = 0, length = ui.cards.length; i < length; i += 1) {
                var card = ui.cards[i];
                addShare(card);
            }

			for (var i = 0, length = ui.videos.length; i < length; i += 1) {
                var video = ui.videos[i];
                var contentSource = video.getAttribute('data-content-source');

                if (contentSource !== 'vine') {
                    renderVideo(video);
                }
			}

			var getCardData = function (card) {
				var attributes = card.attributes;
				var data = {};

				for (var i = 0, length = attributes.length; i < length; i += 1) {

					if (/^data-/.test(attributes[i].nodeName)) {
						var key = attributes[i].nodeName.replace('data-', '');
						data[key] = attributes[i].nodeValue;
					}
				}

				return data;
			};

			var getCards = function (event, highlight) {
				var path = Mighty.option('basePath') +
					'api/?_host=' + location.hostname +
                    '&qa=' + options.qa +
					'&count=' + options.count +
					'&more_count=' + options.more_count +
					'&_module=mighty.mini' +
					'&_jsonp=?';

				highlight = highlight || false;

				ui.reload[0].className += ' loading';

				core.getJSONP(path, function (html) {
					ui.reload[0].className = ui.reload[0].className.replace(' loading', ' ');

					if (html) {
						if (highlight) {
							ui.cardsList.className += ' highlight';
							setTimeout(function () {
								ui.cardsList.className = ui.cardsList.className.replace(' highlight', '');
							}, 1000);
						}
						// Turn string of html into parsed html
						html = core.createHTML(html);
                        var newContinuation = core.query('.cards-list', html)[0].getAttribute('data-continuation');
                        if (newContinuation !== continuation) {
                            continuation = newContinuation;
                            var cards = core.query('.card', html);
                            for (var i = 0, length = cards.length; i < length; i += 1) {
                                var card = cards[i];
                                addShare(card);
                            }

                            var videos = core.query('.card-video-poster', html);
                            for (var i = 0, length = videos.length; i < length; i += 1) {
                                var video = ui.videos[i];
                                var contentSource = video.getAttribute('data-content-source');

                                if (contentSource !== 'vine') {
                                    renderVideo(videos[i]);
                                }
                            }

                            var newCardsList = core.query('.cards-list', html)[0];
                            if (newCardsList) {
                                ui.cardsList.innerHTML = '';
                                // Add the new cards
                                while (newCardsList.firstChild) {
                                    ui.cardsList.appendChild(newCardsList.firstChild);
                                }
                            }
                            core.publish(element, 'render', element);
                        }
					}
				});
			};

			function getEmbedCode(video) {
				var id = null;

				switch (video.contentSource) {
				case 'youtube':
					id = video.url.match(/v=([^&]+)/);
					if (id && id[1]) {
						return {
							type: 'iframe',
							src: '//www.youtube.com/embed/' + id[1] + '?modestbranding=1',
							source: 'youtube'
						};
					}
					break;
				case 'vimeo':
					id = video.url.match(/vimeo.com\/(\d+)/);
					if (id && id[1]) {
						return {
							type: 'iframe',
							src: '//player.vimeo.com/video/' + id[1] + '?badge=0&byline=0&color=#27ae60',
							source: 'vimeo'
						};
					}
					break;
				case 'aol_on':
					id = video.url.match(/-(\d+)\??.*$/);
					if (id && id[1]) {
						var w = 438, h = 260;
						if ($(window).width() < 560) {
							w = 298;
							h = 200;
						}
						return {
							type: 'script',
							src: 'http://pshared.5min.com/Scripts/PlayerSeed.js?sid=281&width=' +
								w + '&height=' + h + '&playList=' + id[1],
							source: 'aol-on'

						};
					}
					break;
				case 'daily_motion':
					id = video.url.match(/dailymotion.com\/video\/([^_]+)/);
					if (id && id[1]) {
						return {
							type: 'iframe',
							src: '//www.dailymotion.com/embed/video/' +
								id[1] + '?highlight=#27ae60&logo=0',
							source: 'daily-motion'
						};
					}
					break;
				case 'instagram':
					id = video.url.match(/instagram.com\/p\/([^_\/]+)/);
					if (id && id[1]) {
						return {
							type: 'iframe',
							src: '//instagram.com/p/' + id[1] + '/embed',
							source: 'instagram'
						};
					}
					break;
				case 'vine':
					id = video.url.match(/vine.co\/v\/([^_\/]+)/);
					if (id && id[1]) {
						return {
							type: 'iframe',
							src: 'https://vine.co/v/' + id[1] + '/embed/simple',
							source: 'vine'
						};
					}
					break;
				}
				return null;
			}

			core.bind(ui.reload[0], 'click', function (event) {
				getCards(event, true);
			});

            function playVideo(event) {
                var video = core.closest(event.target, '.card-video-poster');
                renderVideo(video);
            }

            // TODO: Why doesn't core.delegate capture click events on descendants?
            core.delegate(ui.cardsList, '.card-play', 'click', playVideo);
            core.delegate(ui.cardsList, '.card-video-poster', 'click', playVideo);
            core.delegate(ui.cardsList, '.icon-play', 'click', playVideo);

			if (options.auto_refresh) {
				setInterval(getCards, options.auto_refresh_interval);
			}

			for (var i = 0, length = ui.shareLinks.length; i < length; i += 1) {
				core.bind(ui.shareLinks[i], 'click', function (event) {
					var type = event.target.className.replace('share ', '');
					var card = core.closest(event.target, '.card');
					var cardData = getCardData(card);
					var text = 'via Mini ' + cardData.brand.charAt(0).toUpperCase() + cardData.brand.slice(1);
					var url = cardData.url;

					switch (type) {
					case 'facebook':
						window.open('http://www.facebook.com/share.php?u=' + encodeURIComponent(url),
							'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
						);
						break;
					case 'twitter':
						window.open('http://twitter.com/share?text='+ encodeURIComponent(text) + '&url='+ encodeURIComponent(url) ,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
						break;
					case 'email':
						window.open('mailto:?subject=' + encodeURIComponent(text)  + '&body='+encodeURIComponent(text + '\r\n' + url + '\r\n\r\n via Mini'));
						break;
					}
				});
			}
		}
	};
});
