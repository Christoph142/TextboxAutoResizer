// save preferences:
window.addEventListener("change", function(e)
{
	if(e.target.type === "checkbox")	widget.preferences[e.target.id] = e.target.checked?1:0;
	else 							 		widget.preferences[e.target.id] = e.target.value;	
},false);

// restore preferences:
function getprefs()
{	
	var inputs = document.getElementsByTagName("input");
	var selects = document.getElementsByTagName("select");
	
	for(var i=0; i<inputs.length; i++){
		if(inputs[i].type==="checkbox")	document.getElementsByTagName("input")[i].checked = widget.preferences[inputs[i].id]==="0"?0:1;
		else							document.getElementsByTagName("input")[i].value = widget.preferences[inputs[i].id];
	}
	for(var i=0; i<selects.length; i++){
		if(selects[i].id === "saved_sets"){
			if(selects[i].options.length < 2){
				for(var option in JSON.parse(widget.preferences.saved_sets)){
					if(option !== "Default") selects[i].options[selects[i].options.length] = new Option(option, option); // Option(name, value)
				}
			}
			else continue;
		}
		else document.getElementsByTagName("select")[i].value = widget.preferences[selects[i].id];
	}
}