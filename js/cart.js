var cart = [];
var fee = 20;
var shipmentFee = 0;

function RefreshCart(list)
{	
	var cartTable = document.getElementById("cart");
	var emptycart = document.getElementById("emptycart");
	if (cartTable && emptycart)
	{
		if (list.length > 0)
		{
			while(cartTable.rows.length > 0)
			{
				cartTable.deleteRow(0);
			}
			
			cartTable.style.display = "inline-table";
			summaryTable.style.display = "inline-table";
			emptycart.style.display = "none";
			
			var i;
			for (i=0; i<list.length; i++)
			{
				var row = cartTable.insertRow(cartTable.rows.length);
				var cell = row.insertCell(row.cells.length);
				cell.style.borderStyle = "solid";
				cell.style.borderWidth = "1px 0px 0px 0px";
				cell.style.borderColor = "#E6E6E6";
				cell.style.padding = "10px 5px 10px 0px";
				cell.style.textAlign = "left";
				cell.style.verticalAlign = "top";				
				
				var detailsLink = "<a class='hyperlink-default' href='" + list[i]['page'] + "'>";
				var itemImage = "product/images/" + list[i]["images"].split(",")[0];
				cell.innerHTML = "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" + 
								 "<tr>" + 
								 "<td>" + detailsLink + "<div style=\"background:transparent; width:80px; height:80px; position:absolute;\"></div><img style=\"border-style:none;\" src=\"" + itemImage + "\" width=\"80px\"/></a></td>" +
								 "<td style=\"vertical-align:top; width:100%; padding-left:10px;\">" +
								 
								"<table cellpadding=\"0\" cellspacing=\"0\" style=\"display:inline-table; float:left; width:50%; min-width:220px;\"><tr><td style=\"text-align:left; font-weight:bold;\">" + detailsLink + list[i]["name"] + "</a></td></tr>" +
								"<tr><td style=\"text-align:left;\"><a class=\"button-delete\" style=\"margin-top:4px; margin-bottom:4px;\" onclick=\"RemoveItem(" + i + ")\">Elimină</a></td></tr></table>" +
								
								"<table cellpadding=\"0\" cellspacing=\"0\" style=\"display:inline-table; min-width:220px; width:50%; min-width:50%;\">" + 
								"<tr><td width=\"1px\" style=\"vertical-align:top;\">" +
								
								"<table style=\"display:inline-block;\" cellpadding=\"0\" cellspacing=\"0\"><tr>" + 
								"<td><button title=\"Cantitate\" class=\"button-numeric\" onclick=\"CalculateTotal(" + i + "," + -1 + ")\">-</button></td>" + 
								"<td style=\"border-style:solid; border-color:#ccc; border-width:1px 0px 1px 0px;\"><input class=\"textbox-numeric\" type=\"text\" value=\"" + list[i]["quantity"] + "\" style=\"width:40px;\" disabled=\"true\" title=\"Cantitate\"\"/></td>" + 
								"<td><button title=\"Cantitate\" class=\"button-numeric\" onclick=\"CalculateTotal(" + i + "," + 1 + ")\">+</button></td>" +										 
								"</tr></table>" +								
								"</td>" +
								
								"<td></td><td style=\"text-align:right; vertical-align:top; padding:0px 0px 0px 5px; white-space:nowrap; width:1px; min-width:108px;\"><a title=\"Preț / buc.\">Preț/buc: " + list[i]["price"] + " Lei</a>" + //<hr style=\"border-style:none; height:1px; background:transparent; margin:0px 0px 0px 0px;\"/>
								"<a style=\"margin-top:0px; display:block; color:#0074BB;\" title=\"Subtotal = Preț * Cantitate\">Subtotal: " + (Math.round((list[i]["price"] * list[i]["quantity"]) * 100) / 100) + " Lei" + "</a></td>" +
								
								"</td></tr>" +								
								"</table></td></tr></table>";
			}
			
			CalculateGrandTotal();
		}
		else		
		{			
			cartTable.style.display ="none";
			summaryTable.style.display = "none";
			emptycart.style.display = "table";
		}
	}
}

function RemoveItem(index)
{		
	cart.splice(index, 1);
	
	document.cookie = "cart=" + encodeURIComponent(JSON.stringify(cart)) + ";domain=store.mediosmedical.ro;path=/;";
	
	RefreshCart(cart);
	RefreshCartItemsCount(cart);
}

function CalculateTotal(index, value)
{
	if (value < 1)
	{
		if (cart[index]["quantity"] == 1)
		{
			return;
		}
	}
	cart[index]["quantity"] = Math.round(cart[index]["quantity"]) + value;	
	document.cookie = "cart=" + encodeURIComponent(JSON.stringify(cart)) + ";domain=store.mediosmedical.ro;path=/;";
	RefreshCart(cart);
}

function CalculateGrandTotal()
{
	var cartTable = document.getElementById("cart");
	if (cartTable)
	{
		var i;
		var total = 0;
		var quantityCount = 0;
		for (i=0; i<cart.length; i++)
		{
			total += cart[i]["quantity"] * cart[i]["price"];
			quantityCount += cart[i]["quantity"];
		}
		
		var articlesCell = document.getElementById("articlesCell");
		if (articlesCell)
		{
			articlesCell.innerHTML = cart.length;
		}
		
		var quantityCell = document.getElementById("quantityCell");
		if (quantityCell)
		{
			quantityCell.innerHTML = Math.round(quantityCount);
		}
		
		var subTotal = (Math.round(total * 100) / 100);
		
		var subtotalCell = document.getElementById("subtotalCell");
		if (subtotalCell)
		{			
			subtotalCell.innerHTML = subTotal + " Lei";
		}
		
		if (subTotal >= 2000)
		{
			shipmentFee = 0;
		}
		else
		{
			shipmentFee = fee;
		}
		
		var shipmentCell = document.getElementById("shipmentCell");
		if (shipmentCell)
		{
			shipmentCell.innerHTML = (Math.round(shipmentFee * 100) / 100) + " Lei";
		}
		
		var totalCell = document.getElementById("totalCell");
		if (totalCell)
		{
			totalCell.innerHTML = (Math.round((total + shipmentFee) * 100) / 100) + " Lei <a style='font-size:12px; font-weight:300; color:#000;'>(TVA inclus)</a>";
		}
	}
}

function ContinueButton_Click()
{
	location.href = "orderdetails";
}
