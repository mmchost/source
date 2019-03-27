var products = [];
var cart = [];

function LoadSource(url)
{
	var localCart = GetCookie("cart"); if (localCart) { cart = JSON.parse(decodeURIComponent(localCart)); } RefreshCartItemsCount(cart);
	
	var fileName = "";
	if (url)
	{
		fileName = url + ".xml";
	}
		
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
	    if (this.readyState == 4) 
	    {
		    if (this.status == 200)
		    {
			document.cookie = "urlSource=" + url + ";domain=.mediosmedical.ro;path=/;";
			ReadProducts(this);
		    }
		    else
		    {
			document.cookie = "urlSource=;domain=.mediosmedical.ro;path=/;";
		    	LoadDefault("products");
		    }
	    }	
	};
	xhttp.open("GET", fileName, true);
	xhttp.send();
}
			    
function LoadDefault(source)
{
	var reader;
	reader = new XMLHttpRequest();
	reader.onreadystatechange = function()
	{
		if (this.readyState == 4)
		{
			if (this.status == 200)
			{
				ReadProducts(this);
			}
		}
	};  
	reader.open("GET", "https://store.mediosmedical.ro/" + source + ".xml", true);
	reader.send();
}

function ReadProducts(xml)
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
		products.push(item);
	}
	
	AddProducts(products);
}


function AddProducts(list)
{
	var cell = document.getElementById("productlist");
	if (cell)
	{
		cell.innerHTML = "";
		for (var i=0; i<list.length; i++)
		{
			var itemName = list[i]["name"].replace(/\n/g, '<br/>');
			var itemImage = "product/images/" + list[i]["images"].split(",")[0];
			//var isavailable = list[i]["available"] == "true" ? " class='item-available-true'>in stoc" : " class='item-available-false'><a style='line-height:22px;'>stoc epuizat</a>";
			var buttonState = list[i]["available"] == "true" ? "class='button-default'" : "class='button-default-disabled' disabled='true'";
			var buttonText = Math.round(list[i]["price"]) > 0 ? "Adauga in cos" : "Solicita oferta";
			if (list[i]["available"] == "false")
			{
				buttonText = "Stoc epuizat";
			}
			var iconColor = list[i]["available"] == "true" ? "#0066A2" : "#B7B7B7";
			//var buttonContent = "<table align='center' style='width:100%;' cellpadding='0' cellspacing='0'><tr><td style='width:22px; background-image:url(images/cart.png); background-repeat:no-repeat; background-attachment:scroll; background-clip:border-box; background-origin:padding-box; background-position-x:center; background-position-y:center; background-size:22px 22px; box-sizing:inherit;'></td><td style='padding-left:10px;'>" + buttonText + "</td></tr></table>";			
			var button = "<button " + buttonState + " style='width:150px;' onclick='AddItem(" + i + ")'>" + buttonText + "</button>";
			var imageLink = "<a style='outline:none; display:block; width:100%; height:100%;' href='" + list[i]['page'] + "'>";
			var nameLink = "<a class='hyperlink-default' href='" + list[i]['page'] + "'>";
			var priceCell = Math.round(list[i]["price"]) > 0 ? "<tr><td align='center' class='item-price-cell'>" + list[i]["price"] + " Lei<a style='font-size:12px; color:#484848; font-weight:300;'>&nbsp;&nbsp;*TVA inclus</a></td></tr>" : "<tr><td align='center' class='item-price-cell'></td></tr>";
			cell.innerHTML +=
				" <table cellpadding='0' cellspacing='0' class='item-table'>" +
				"<tr><td align='center' class='item-image-cell'>" + imageLink + "<img class='item-image' src='" + itemImage + "'/></a></td></tr>" +
				"<tr><td align='center' class='item-name-cell'>" + nameLink + itemName + "</a></td></tr>" +
				"<tr><td align='center' style='padding-bottom:0px;'><a style='font-size:13px;'>Cod produs: " + list[i]["id"] + "</a></td></tr>" +
				//"<tr><td align='center'><button disabled='true' " + isavailable + "</button></td></tr>" +
				priceCell +
				"<tr><td style='padding-top:0px;' id='qtCell" + i + "'></td></tr>" +
				"<tr><td align='center' class='item-button-cell'>" + button + "</td></tr>" + "</table>";			
		}
	}
	InitializeQt();
}
	
function InitializeQt()
{
	for (var i=0; i<products.length; i++)
	{
		var id = "qtCell" + i;
		var qtCell = document.getElementById(id);
		if (qtCell)
		{
			qtCell.innerHTML =
				"<table style='display:inline-block;' cellpadding='0' cellspacing='0'><tr>" +
				"<td><button title='Cantitate' class='button-numeric' onclick='CalculateTotal(" + i + "," + -1 + ")'>-</button></td>" + 
				"<td style='border-style:solid; border-color:#ccc; border-width:1px 0px 1px 0px;'><input class='textbox-numeric' type='text' value='" + products[i]["quantity"] + "' style='width:40px;' disabled='true' title='Cantitate'/></td>" + 
				"<td><button title='Cantitate' class='button-numeric' onclick='CalculateTotal(" + i + "," + 1 + ")'>+</button></td>" +
				"</tr></table>"
		}
	}
}

function AddItem(index)
{
	if (products[index]["price"] > 0)
	{
		try
		{
			var exists = false;
			if (cart.length > 0)
			{
				for (var i=0; i<cart.length; i++)
				{
					if (cart[i]["id"] === products[index]["id"])
					{
						exists = true;
					}
				}
			}
			//var product = cart.find(obj => { return obj["id"] === products[index]["id"] });
			if (exists)
			{
				location.href = "cart";
			}
			else			
			{
				cart.push(products[index]);
				document.cookie = "cart=" + encodeURIComponent(JSON.stringify(cart)) + ";domain=store.mediosmedical.ro;path=/;";

				location.href = "cart";

				//RefreshCartItemsCount(cart);
			}
		}
		catch(ex){}
	}
	else
	{
		var shoppingBag = [];
		shoppingBag.push(products[index]);
		document.cookie = "shoppingBag=" + encodeURIComponent(JSON.stringify(shoppingBag)) + ";domain=store.mediosmedical.ro;path=/;";
		RequestOffer();
	}
}
  
function RequestOffer()
{
	window.location.href = "requestoffer";
}
	
function CalculateTotal(index, value)
{
	if (value < 1)
	{
		if (products[index]["quantity"] == 1)
		{
			return;
		}
	}
	products[index]["quantity"] = Math.round(products[index]["quantity"]) + value;
	InitializeQt(index);
}
