(function($)
{	
	$.extend(
	{			 
		smoothAnchors : function(speed, easing, redirect)
		{				
			speed = speed || "fast";
			easing = easing || null;
			redirect = (redirect === true || redirect == null) ? true : false;
			
			$("a").each(function(i)
			{							
				var url = $(this).attr("href");
				
				if(url)
				{
					if(url.indexOf("#") != -1) //&& url.indexOf("#") == 0)
					{
						var aParts = url.split("#",2);
						var anchor = $("a[name='"+aParts[1]+"']");
						
						if(anchor)
						{																					
							$(this).click(function()
							{												   
								if($(document).height()-anchor.offset().top >= $(window).height()
								 || anchor.offset().top > $(window).height()
								 || $(document).width()-anchor.offset().left >= $(window).width()
								 || anchor.offset().left > $(window).width())
								 {	
									//NEED REVIEW
									if (url.indexOf("#") > 0)
									{
										if(redirect)
										{
											var pageName = aParts[0];
											var address = window.location.href.lastIndexOf("/");
											if (pageName[0] != window.location.href[address+1])
											{
												window.location = url;
												return;
											}
										}
									}
									//END NEED REVIEW
								 
									$('html, body').animate(
									{
										scrollTop: anchor.offset().top,
										scrollLeft: anchor.offset().left
									}, speed, easing, function()
									{
										if(redirect)
										{ 
											window.location = url 
										}
									});								
								}								
								return false;																
							});
						}
					
					}					
				}				
			});			
		}	
	});	
})(jQuery);
