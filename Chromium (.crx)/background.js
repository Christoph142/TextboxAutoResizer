//retrieve and store settings (filled with default values) for all pages:
var w = null;
chrome.storage.sync.get( null, function (storage){
	w = {
	"resizable" :			(!storage["resizable"]				? "horizontal" 	: storage["resizable"]),
	"transition_duration" :	(!storage["transition_duration"]	? "300" 		: storage["transition_duration"]),
	"collapse_textareas" :	(!storage["collapse_textareas"]		? "0" 			: storage["collapse_textareas"])
	};
});

chrome.extension.onMessage.addListener( function(request, sender, sendResponse){
	if (request.data === "settings") sendResponse(w);
});