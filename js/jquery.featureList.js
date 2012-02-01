/*
 * FeatureList - simple and easy creation of an interactive "Featured Items" widget
 * Purpose - Iterate through list of tabs showing each image which is associated with it,
 * set on a timer which switches to new tab when time interval is met.
 * Requires: jQuery v1.3+
*/
(function($){
	$.fn.featureList = function(options){
		var tabs	= $(this);
		var output	= $(options.output);
		var player	= $(options.player);
		new jQuery.featureList(tabs, output, options, player);
		return this;	
	};

	$.featureList = function(tabs, output, options, player) {
		function slide(nr) { //'nr' = next row
			if(typeof nr == "undefined"){
				nr = (visible_item + 1);
				nr = (nr >= total_items) ? 0 : nr;
			}else if(nr == "backward"){
				nr = (visible_item - 1);
				nr = (nr < 0) ? (tabs.length-1) : nr;
			}

			tabs.removeClass('current').filter(":eq(" + nr + ")").addClass('current'); //add class 'current' to the next tab in the array of tabs
			output.stop(true, true).filter(":visible").fadeOut();
			output.filter(":eq(" + nr + ")").fadeIn(function(){visible_item = nr;}); //fadeIn the next img in the array
		}

		/****************************************************************************
		 * Setting the Variables
		****************************************************************************/
		var options			= (options || {}); 
		var total_items		= tabs.length;
		var visible_item	= (options.start_item || 0);
		var nr;
		
		alert(total_items);
		
		//If values aren't set from index page || null, then the default values are set below
		options.pause_on_hover		= (options.pause_on_hover!=null) ? options.pause_on_hover : true;
		options.transition_interval	= (options.transition_interval!=null) ? options.transition_interval : 5000;

		/***************************************************************************/

		//Sets current selected tab and image for tab on page load
		output.hide().eq(visible_item).show(); //sets current selected tab on page load
		tabs.eq(visible_item).addClass('current'); //sets current selected tab class to 'current' on page load
		
		tabs.click(function(){
			if ($(this).hasClass('current')){ //checks class of the tab clicked to see if the 'current' class already exist on that tab
				return false;	
			}
			slide(tabs.index(this)); //passes slide('the clicked tab number')
		});

		if(options.transition_interval > 0){
			var timer = setInterval(function(){slide();}, options.transition_interval); //runs slide() every 'options.transition_interval' seconds
			var pauseClicked = false;
			
			//If one hovers a tab, stop tab rotation.  When one leaves tab, intiate rotation
			if(options.pause_on_hover){
				tabs.mouseenter(function(){
					clearInterval(timer);
				}).mouseleave(function(){
					if(pauseClicked == false){
						clearInterval(timer);
						timer = setInterval(function(){slide();}, options.transition_interval);
					}
				});
				output.mouseenter(function(){
					clearInterval(timer);
				}).mouseleave(function(){
					if(pauseClicked == false){
						clearInterval(timer);
						timer = setInterval(function(){slide();}, options.transition_interval);
					}
				});
				player.mouseenter(function(){
					clearInterval(timer);
				}).mouseleave(function(){
					if(pauseClicked == false){
						clearInterval(timer);
						timer = setInterval(function(){slide();}, options.transition_interval);
					}
				});
			}
			
			$("img#backward").mousedown(function(){
				$(this).removeAttr('src').attr('src','images/backwardActive.png');
			}).mouseup(function(){
				$(this).removeAttr('src').attr('src','images/backward.png');
			});
			$("img#pause").mousedown(function(){
				$("img#play").removeClass('active').removeAttr('src').attr('src','images/play.png');
				$("img#pause").removeAttr('src').attr('src','images/pauseActive.png');
			}).mouseup(function(){
				$("img#pause").addClass('active')
			});
			$("img#play").mousedown(function(){
				$("img#pause").removeClass('active').removeAttr('src').attr('src','images/pause.png');
				$("img#play").removeAttr('src').attr('src','images/playActive.png');
			}).mouseup(function(){
				$("img#play").addClass('active')
			});
			$("img#forward").mousedown(function(){
				$(this).removeAttr('src').attr('src','images/forwardActive.png');
			}).mouseup(function(){
				$(this).removeAttr('src').attr('src','images/forward.png');
			});
					
			player.click(function(){
				var playerOpt = player.index(this);
				if(playerOpt == 0){ //backward		
					if(pauseClicked == false){
						clearInterval(timer);
						timer = setInterval(function(){slide();}, options.transition_interval);
					}
					slide('backward');
				}else if(playerOpt == 1){ //pause
					pauseClicked = true;
					clearInterval(timer);
				}else if(playerOpt == 2){ //play
					pauseClicked = false;
					clearInterval(timer);
					timer = setInterval(function(){slide();}, options.transition_interval);
				}else if(playerOpt == 3){ //forward
					if(pauseClicked == false){
						clearInterval(timer);
						timer = setInterval(function(){slide();}, options.transition_interval);
					}
					slide();
				}
			});
		}
	};
})(jQuery);