function WarningButton_Click()
{
	document.cookie = "headerBar=true";

	var wb = document.getElementById("warning-bar");
	var header = document.getElementById("header");
	var mc = document.getElementById("main-content");
	var sectionTag1 = document.getElementById("sectionTag1");
	var sectionTag2 = document.getElementById("sectionTag2");
	var sectionTag3 = document.getElementById("sectionTag3");
	var headerHeight = header.clientHeight;
	var initialPos = wb.clientHeight + 1; /*1px for bottom border thickness*/
	var pos = wb.clientHeight;
	var id = setInterval(frame, 5);	
	function frame() 
	{
		if (pos == 0) 
		{
			clearInterval(id);
			var headerBar = document.getElementById("headerBar");
			headerBar.innerHTML = "";
		}
		else 
		{
			pos--; 
			if (wb)
			{
				wb.style.top = pos - initialPos + 'px';
			}
			if (header)
			{
				header.style.top = pos + 'px';
			}
			if (mc)
			{
				mc.style.top = pos + headerHeight + 'px';
			}
		}
		
		if (sectionTag1)
		{
			sectionTag1.setAttribute('style', 'height:80px; margin-top:-80px;');
		}
		if (sectionTag2)
		{
			sectionTag2.setAttribute('style', 'height:80px; margin-top:-80px;');
		}
		if (sectionTag3)
		{
			sectionTag3.setAttribute('style', 'height:80px; margin-top:-80px;');
		}
	}
}

function CookiesButton_Click()
{
	document.cookie = "footerBar=true";

	var cb = document.getElementById("cookies-bar");
	var fcw = document.getElementById("footer-copyright-ws");
	var pos = 0;
	var id = setInterval(frame, 5);
	var footerHeight = cb.clientHeight + 1;
	var copyrightHeight = 48;
	function frame() 
	{
		if (pos == -footerHeight) 
		{
			clearInterval(id);
			var footerBar = document.getElementById("footerBar");
			footerBar.innerHTML = "";
		}
		else 
		{
			pos--; 
			cb.style.bottom = pos + 'px';
			var val = pos + copyrightHeight + footerHeight;
			fcw.style.height = val + 'px';
		}
	}
}
