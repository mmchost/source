var product, item, midpoint;
var similarItems = [];
//var itemsCount = 0;

function LoadSource(productID)
{
	try { var cart = []; var localCart = GetCookie("cart"); if (localCart) { cart = JSON.parse(decodeURIComponent(localCart)); } RefreshCartItemsCount(cart); } catch(ex) {}
	
	var url = ""; var param = GetParameterByName("source"); if (param) { if (param.length > 0) { url = param; }}
	
	var fileName = "";
	if (url.length > 0 && url !== "undefined")
	{
		fileName = "https://store.mediosmedical.ro/" + url + ".xml";
	}
	else
	{
		var urlSource = GetCookie("urlSource"); 
		if (urlSource)
		{
			if (urlSource.length > 0 && urlSource !== "undefined")
			{
				fileName = "https://store.mediosmedical.ro/" + urlSource + ".xml"; 
			}
		}
	}
	
	if (fileName.length > 0 && fileName !== "undefined")
	{
		var xhttp;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
		    if (this.readyState == 4) 
		    {
			    if (this.status == 200)
			    {
				    ReadProduct(this, productID);
			    }
			    else
			    {
				    LoadDefault("default", productID);
			    }
		    }	
		};
		xhttp.open("GET", fileName, true);
		xhttp.send();
	}
	else
	{
		LoadDefault("default", productID);
	}
}

function LoadDefault(url, productID)
{
	var reader;
	reader = new XMLHttpRequest();
	reader.onreadystatechange = function()
	{
		if (this.readyState == 4)
		{
			if (this.status == 200)
			{
				ReadProduct(this, productID);
			}
		}
	};
	reader.open("GET", "https://store.mediosmedical.ro/" + url + ".xml", true);
	reader.send();
}
	
function ReadProduct(xml, productID)
{
	var xmlDoc = xml.responseXML;
	var elements =  xmlDoc.getElementsByTagName("product");	
	
	var i, j;
	for (i=0; i<elements.length; i++)
	{
		var item = {};
		for (j=0; j<elements[i].childNodes.length; j++)
		{
			var node = elements[i].childNodes[j];			
			if (node.nodeType == 1) // or nodeType == Node.ELEMENT_NODE
			{
				item[node.nodeName] = node.text || node.textContent;
			}
		}
		if (item["id"] === productID)
		{
			product = item;
			break;
		}
	}
  
  	GetSimilarItems(elements);
	
	InitializePage();
}

function GetSimilarItems(elements)
{
	if (product)
	{
		var similarIds = product["similarItems"].split(",");
		
		for (var i=0; i<elements.length; i++)
		{
			var item = {};
			for (var j=0; j<elements[i].childNodes.length; j++)
			{
				var node = elements[i].childNodes[j];
				if (node.nodeType == 1) // or nodeType == Node.ELEMENT_NODE
				{
					item[node.nodeName] = node.text || node.textContent;
				}
			}	
			
			if (item["id"] !== product["id"])
			{
				/*
				var itemSimilarIds = item["similarItems"].split(",");
				if (itemSimilarIds.length > 0)
				{
					const found = itemSimilarIds.some(id=> similarIds.indexOf(id) >= 0);
					if (found)
					{
						similarItems.push(item);
					}
				}
				*/
				
				/*
				const found = similarIds.some(id=> id === item["id"]);
				if (found)
				{
					similarItems.push(item);
				}
				*/
			}
		}
	}
}
	
function InitializePage()
{
	if (product)
	{	
		var mainTitle = document.getElementById("mainTitle");
		if (mainTitle)
		{
			mainTitle.innerHTML = product["name"];
		}
		var detailsTitle = document.getElementById("detailsTitle");
		if (detailsTitle)
		{
			detailsTitle.innerHTML = product["name"];
		}
		var subTitle = document.getElementById("subTitle");
		if (subTitle)
		{
			subTitle.innerHTML = product["name"];
		}
		var detailsProductId = document.getElementById("detailsProductId");
		if (detailsProductId)
		{
			detailsProductId.innerHTML = product["id"];
		}
		
		/*
		var images = product["images"].split(",");
		itemsCount = images.length;
		
		var galleryContainer = document.getElementById("galleryContainer");
		if (galleryContainer)
		{
			var gals = "";
			for (var k=0; k<images.length; k++)
			{
				if (k == 0)
				{
					gals += "<img class='gallery' id='firstItem' src='images/" + images[k] + "'/>";
				}
				else
				{
					gals += "<img class='gallery' src='images/" + images[k] + "'/>";
				}
			}
			galleryContainer.innerHTML = gals;
		}
		
		var galleryButtons = document.getElementById("galleryButtons");
		if (galleryButtons)
		{
			var text = "";
			for (var i=0; i<images.length; i++)
			{
				var current = i+1;
				var className = i == 0 ? "selectedGalleryButton" : "galleryButton";
				text += "<a title='" + current + "/" + images.length + "' name='" + images[i] + "' class='" + className + "' onclick='GalleryClick(" + i + ",this)'/>";
			}
			galleryButtons.innerHTML = text;
		}
		*/
		
		var buttonState = product["available"] == "true" ? "class='button-default'" : "class='button-default-disabled' disabled='true'";
		var buttonText = Math.round(product["price"]) > 0 ? "Adaugă în coș" : "Solicită oferta";
		if (product["available"] == "false")
		{
			buttonText = "Stoc epuizat";
		}
		var iconColor = "#fff";
		var buttonContent = "<table style='background:transparent; height:100%; width:100%;' cellpadding='0' cellspacing='0'><tr><td style='width:0px; background-color:" + iconColor + "; background-image:url(images/cart.png); background-repeat:no-repeat; background-attachment:scroll; background-clip:border-box; background-origin:padding-box; background-position-x:center; background-position-y:center; background-size:auto auto; box-sizing:inherit;'></td><td>" + buttonText + "</td></tr></table>";
		var button = "<button " + buttonState + " style='width:150px;' onclick='AddItem()'>" + buttonContent + "</button>";
		
		var priceTable = document.getElementById("priceTable");				
		if (priceTable)
		{
			if (Math.round(product["price"]) > 0)
			{
				var priceCell = document.getElementById("priceCell");
				var priceCellName = document.getElementById("priceCellName");

				if (priceCell && priceCellName)
				{
					priceCell.innerHTML = product["price"] + " Lei";
					priceCell.style.display = "table-cell";
					priceCellName.style.display = "table-cell";
				}
			}
			
			var quantityCell = document.getElementById("quantityCell");
			if (quantityCell)
			{
				quantityCell.innerHTML = 
				"<table style='display:inline-block;' cellpadding='0' cellspacing='0'><tr>" + 
				"<td><button title='Cantitate' class='button-numeric' onclick='CalculateTotal(" + -1 + ")'>–</button></td>" + 
				"<td style='border-style:solid; border-color:#ccc; border-width:1px 0px 1px 0px; background:#fff;'><input id='qtInput' class='textbox-numeric' type='text' value='" + product["quantity"] + "' style='width:40px;' disabled='true' title='Cantitate'/></td>" + 
				"<td><button title='Cantitate' class='button-numeric' onclick='CalculateTotal(" + 1 + ")'>+</button></td>" +
				"</tr></table>";
			}
			
			var buttonCell = document.getElementById("buttonCell");
			if (buttonCell)
			{	
				buttonCell.innerHTML = button;
			}
		}
		
		var description = document.getElementById("description");
		if (description)
		{
			var subDescription = document.getElementById("subDescription");
			if (subDescription)
			{
				var content = description.innerHTML
				subDescription.innerHTML = content;
			}
		}
    
    InitGallery();
    
    InitSimilarProducts(similarItems);
	}
}

function AddItem()
{
	if (product["price"] > 0)
	{
		var cart = [];
		var localCart = GetCookie("cart");
		if (localCart)
		{
			cart = JSON.parse(decodeURIComponent(localCart));
		}
		
		var exists = false;
		for (var i=0; i<cart.length; i++)
		{
			if (cart[i]["id"] === product["id"])
			{
				exists = true;
			}
		}
		if (exists)
		{
			location.href = "../cart";
		}
		else			
		{
			cart.push(product);
			document.cookie = "cart=" + encodeURIComponent(JSON.stringify(cart)) + ";domain=store.mediosmedical.ro;path=/;";
			
			location.href = "../cart";
			
			//RefreshCartItemsCount(cart);
		}
	}
	else
	{
		var shoppingBag = [];
		shoppingBag.push(product);
		document.cookie = "shoppingBag=" + encodeURIComponent(JSON.stringify(shoppingBag)) + ";domain=store.mediosmedical.ro;path=/;";
		RequestOffer();
	}
}

function RequestOffer()
{
	window.location.href = "../requestoffer";
}

function RefreshQt(value)
{
	var qtInput = document.getElementById("qtInput");
	if (qtInput)
	{
		qtInput.value = value;
	}
}

function CalculateTotal(value)
{
	if (value < 1)
	{
		if (product["quantity"] == 1)
		{
			return;
		}
	}
	product["quantity"] = Math.round(product["quantity"]) + value;
	RefreshQt(product["quantity"]);
}

function InitGallery()
{
	item = document.getElementById('firstItem');
}

function resetNavs()
{	
	var navs = document.getElementById('galleryButtons').getElementsByTagName('a');
	if (navs)
	{
		if (navs.length > 0)
		{
			for (var i=0; i<navs.length; i++)
			{
				navs[i].className = 'galleryButton';
			}
		}
	}	
}

function GalleryTouchstart(event)
{
	var touch = event.targetTouches[0];
	midpoint = touch.pageX;
}
function GalleryMousedown(event)
{
	midpoint = event.clientX;
	GalleryMouseout();
}

function GalleryTouchend(event, itemsCount)
{
	var touch = event.targetTouches[0];
	var px = touch.pageX;
	
	if (px !== midpoint)
	{
		resetNavs();
	}
	
	var navs = document.getElementById('galleryButtons').getElementsByTagName('a');
	
	if (px < midpoint)
	{
		var left = item.style.marginLeft.replace("px", "");
		left = Math.round(left) - 300;
		
		var max = -300 * (itemsCount - 1);		
		if (left < max)
		{
			left = max;
		}
		
		item.style.marginLeft = left + 'px';
		item.style.transition = '1s';
				
		if (navs)
		{
			var index = Math.abs(left) / 300;
			navs[index].className = 'selectedGalleryButton';
		}
	}
	else if (px > midpoint)
	{
		var left = item.style.marginLeft.replace("px", "");
		left = Math.round(left) + 300;
		
		if (left > 0)
		{
			left = 0;		
		}
		
		item.style.marginLeft = left + 'px';
		item.style.transition = '1s';
		
		if (navs)
		{
			var index = Math.abs(left) / 300;
			navs[index].className = 'selectedGalleryButton';
		}
	}
}
function GalleryMouseup(event, itemsCount)
{
	if (event.button == 0)
	{
		var px = event.clientX;
		
		if (px !== midpoint)
		{
			resetNavs();
		}

		var navs = document.getElementById('galleryButtons').getElementsByTagName('a');

		if (px < midpoint)
		{
			var left = item.style.marginLeft.replace("px", "");
			left = Math.round(left) - 300;

			var max = -300 * (itemsCount - 1);
			if (left < max)
			{
				left = max;
			}

			item.style.marginLeft = left + 'px';
			item.style.transition = '1s';

			if (navs)
			{
				var index = Math.abs(left) / 300;
				navs[index].className = 'selectedGalleryButton';
			}
		}
		else if (px > midpoint)
		{
			var left = item.style.marginLeft.replace("px", "");
			left = Math.round(left) + 300;

			if (left > 0)
			{
				left = 0;
			}

			item.style.marginLeft = left + 'px';
			item.style.transition = '1s';

			if (navs)
			{
				var index = Math.abs(left) / 300;
				navs[index].className = 'selectedGalleryButton';
			}
		}
	}
	GalleryMouseover();
}

function GalleryClick(idx, nav)
{
	if (item)
	{
		var itemIndex = idx + 1;
		var left = 300 - (300 * itemIndex);
		item.style.marginLeft = left + 'px';
		item.style.transition = '1s';
		var navs = document.getElementById('galleryButtons').getElementsByTagName('a');
		resetNavs();
		nav.className = 'selectedGalleryButton';
	}
}

function GalleryMouseover()
{
	var container = document.getElementById("galleryContainer");
	if (container)
	{
		var items = container.getElementsByTagName("img");
		var firstItem = document.getElementById("firstItem");
		var left = firstItem.style.marginLeft.replace("px", "");
		left = Math.abs(left);
		var index = left / 300;
		
		var largePreview = document.getElementById("largePreview");
		var largeImg = document.getElementById("largeImg");
		if (largePreview && largeImg)
		{
			largePreview.style.display = "block";
			largeImg.src = items[index].src;
		}
	}
}
	
function GalleryMouseout()
{
	var largePreview = document.getElementById("largePreview");
	var largeImg = document.getElementById("largeImg");
	if (largePreview && largeImg)
	{
		largePreview.style.display = "none";
		largeImg.src = "";
	}
}

function InitSimilarProducts(list)
{
	if (product)
	{
		if (list.length > 0)
		{
			var spContainer = document.getElementById('spContainer');
			if (spContainer)
			{
				var cellValue = "";
				for (var i=0; i<list.length; i++)
				{
					var itemName = list[i]["name"].replace(/\n/g, '<br/>');
					var itemImage = "images/" + list[i]["image"]; //list[i]["images"].split(",")[0];			    
					var iconColor = list[i]["available"] == "true" ? "#0066A2" : "#B7B7B7";
					var link = list[i]["page"]; // + param;
					var imageLink = "<a style='outline:none; display:block; width:100%; height:100%;' href='" + link + "'>";
					var nameLink = "<a class='hyperlink-default' href='" + link + "'>";
					var priceCell = Math.round(list[i]["price"]) > 0 ? "<tr><td align='center' class='item-price-cell' style='padding-bottom:10px;'>" + list[i]["price"] + " Lei<a style='font-size:12px; color:#484848; font-weight:300;'>&nbsp;&nbsp;*TVA inclus</a></td></tr>" : "<tr><td align='center' class='item-price-cell' style='padding-bottom:10px;'></td></tr>";
					
					cellValue +=
						" <table cellpadding='0' cellspacing='0' class='item-table'>" +
						"<tr><td align='center' class='item-image-cell'>" + imageLink + "<img class='item-image' src='" + itemImage + "'/></a></td></tr>" +
						"<tr><td align='center' class='item-name-cell'>" + nameLink + itemName + "</a></td></tr>" +          
						priceCell +
						"</table>";  
				}
				spContainer.innerHTML = cellValue;
			}
		}
	}
}
