function ShowMessage(message) {
    var x = document.getElementById("messageBox");
	x.innerHTML = message;
    x.className = "show";
    setTimeout
	(
		function()
		{
			x.className = x.className.replace("show", ""); 
		},
		3000
	);
}
