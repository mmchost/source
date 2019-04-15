function CloseTabItems(container)
{
	if (container)
	{
		for (var i=0; i<container.length; i++)
		{
			container[i].className = 'tab';
		}
	}
}

function CloseTabContents(container)
{
	if (container)
	{
		for (var i=0; i<container.length; i++)
		{
			container[i].style.display = 'none';
		}
	}
}

function TabSelectionChanged(item)
{
	if (item)
	{
		var itemContainer = document.getElementById('tabItemsContainer').getElementsByTagName('div');
		CloseTabItems(itemContainer);
		
		item.className = 'tab tab-selected';
		
		var index = 0;		
		if (itemContainer)
		{
			for (var i=0; i<itemContainer.length; i++)
			{
				if (itemContainer[i].className === 'tab tab-selected')
				{
					index = i;
					break;
				}
			}
		}
		
		var contentContainer = document.getElementById('tabContentContainer').getElementsByTagName('div');
		CloseTabContents(contentContainer);
		if (contentContainer)
		{
			contentContainer[index].style.display = 'block';
			
		}
	}
}
