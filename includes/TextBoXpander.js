// ==UserScript==
// @name      	AutoSize?
// @description	Automatically resizes input fields and textareas while you're typing
// @author		Christoph D.
// @exclude		https://www.facebook.*
// ==/UserScript==

(function(){

var currentField;
var compareField;

window.addEventListener("keypress", autogrow, false);
window.addEventListener("keyup", autogrow, false);
window.addEventListener("paste", autogrow, false);

function autogrow()
{
	if(window.event.which > 32 && window.event.which < 41) return; // Home/End/PgUp/PgDwn + arrow keys
	var t = window.event.target;
	
	if(t.type === "textarea") handle_textarea(t);
	else if("text search email tel url".indexOf(t.type) >= 0) handle_input(t);
}

function handle_textarea(t)
{	
	if(t !== currentField) init_this_textarea(t);
	
	var scrollHeight_before = compareField.firstChild.scrollHeight;
	var style = window.getComputedStyle(t,0);
	
	compareField.firstChild.style.width = style.getPropertyValue("width");
	compareField.firstChild.value = t.value+"\n";
	
	t.style.height = parseInt(t.style.height!=="" ? t.style.height : style.getPropertyValue("height"))+compareField.firstChild.scrollHeight-scrollHeight_before+"px";
}

function handle_input(t)
{
	if(t !== currentField) init_this_input(t);
	
	compareField.innerHTML = t.value+"ww"; // ww is just some space (w = widest character)
	
	t.style.width = compareField.offsetWidth+"px";
}


function init_this_textarea(t)
{
	currentField = t;
	if(widget.preferences.resizable !== "0")			t.style.resize = widget.preferences.resizable;
	if(widget.preferences.transition_duration !== "0")	t.style.transition = "height "+widget.preferences.transition_duration+"ms";
	
	var style = window.getComputedStyle(t,0);
	
	if(compareField) compareField.parentNode.removeChild(compareField);
	
	var compareField_container				= document.createElement("div");
	compareField_container.id				= "AutoSize_compareField";
	compareField_container.style.overflow	= "hidden";
	compareField_container.style.position	= "absolute";
	compareField_container.style.height		= "1px";
	compareField_container.style.width		= "1px";
	compareField_container.style.opacity	= "0.01";
	
	var compareField_prototype				= t.cloneNode(0);
	compareField_prototype.tabIndex			= "-1";
	compareField_prototype.disabled			= "disabled";
	compareField_prototype.style.overflow	= "hidden";
	
	compareField_prototype.style.font		= style.getPropertyValue("font");
	compareField_prototype.style.lineHeight	= style.getPropertyValue("line-height");
	compareField_prototype.style.height		= style.getPropertyValue("height");
	
	compareField_container.appendChild(compareField_prototype);
	t.parentNode.appendChild(compareField_container);
	
	compareField = document.getElementById("AutoSize_compareField");
}

function init_this_input(t)
{
	currentField = t;
	
	if(compareField) compareField.parentNode.removeChild(compareField);
	
	var compareField_prototype				= document.createElement("div");
	compareField_prototype.id				= "AutoSize_compareField";
	
	compareField_prototype.style.position	= "absolute";
	compareField_prototype.style.visibility	= "hidden";
	
	compareField_prototype.style.font		= window.getComputedStyle(t,0).getPropertyValue("font");
	compareField_prototype.style.minWidth	= window.getComputedStyle(t,0).getPropertyValue("width");
	compareField_prototype.style.width		= "auto";
	compareField_prototype.style.height		= "1px";
	
	t.parentNode.appendChild(compareField_prototype);
	
	compareField = document.getElementById("AutoSize_compareField");
}

}());