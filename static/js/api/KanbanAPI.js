export default class KanbanAPI {
	static getItems(columnId) {
		const column = read().find(column => column.id == columnId);

		if (!column) {
			return [];
		}

		return column.items;
	}

	static insertItem(columnId, content) {
		const data = read();
		const column = data.find(column => column.id == columnId);
		const item = {
			id: Math.floor(Math.random() * 100000),
			content
		};

		if (!column) {
			throw new Error("Column does not exist.");
		}

		column.items.push(item);
		save(data);

		return item;
	}

	static updateItem(itemId, newProps) {
		const data = read();
		const [item, currentColumn] = (() => {
			for (const column of data) {
				const item = column.items.find(item => item.id == itemId);

				if (item) {
					return [item, column];
				}
			}
		})();

		if (!item) {
			throw new Error("Item not found.");
		}

		item.content = newProps.content === undefined ? item.content : newProps.content;

		// Update column and position
		if (
			newProps.columnId !== undefined
			&& newProps.position !== undefined
		) {
			const targetColumn = data.find(column => column.id == newProps.columnId);

			if (!targetColumn) {
				throw new Error("Target column not found.");
			}

			// Delete the item from it's current column
			currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

			// Move item into it's new column and position
			targetColumn.items.splice(newProps.position, 0, item);
		}

		save(data);
	}

	static deleteItem(itemId) {
		const data = read();

		for (const column of data) {
			const item = column.items.find(item => item.id == itemId);

			if (item) {
				column.items.splice(column.items.indexOf(item), 1);
			}
		}

		save(data);
	}
}

function read() {
	// const json = localStorage.getItem("kanban-data");
    // console.log(kanbanJsonData);
	// if (!json) {
	// 	return [
	// 		{
	// 			id: 1,
	// 			items: []
	// 		},
	// 		{
	// 			id: 2,
	// 			items: []
	// 		},
	// 		{
	// 			id: 3,
	// 			items: []
	// 		}
	// 	];
	// }
	// return JSON.parse(json);
	return kanbanJsonData;
}

function save(content) {
	function getCookie(name) {
		let cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].trim();
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) === (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}

	const csrftoken = getCookie('csrftoken');
	const payload = {
		"csrfmiddlewaretoken": csrftoken,
		"data": JSON.stringify(content),
		"board_id": kanbanId,
	};
	
	$.ajax({
		type: "POST",
		dataType: "json",		
		url: "save_kanban/",
		timeout: 5000,
		data: payload,

		success: function(data) {
			// console.log("success");		
		},
		complete: function(data) {
			// localStorage.setItem("kanban-data", payload['data']);
		},
		error: function(data) {
			// alert(data.response)
		},
	});
}