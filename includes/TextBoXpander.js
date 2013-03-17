// ==UserScript==
// @name      	TextBoXpander
// @description	Automatically resizes input fields and textareas while you're typing
// @author		Christoph D.
// @exclude		https://www.facebook.*
// @exclude		https://github.com/*
// ==/UserScript==

(function(){

var currentField;
var compareField;

document.addEventListener("focusin", initialize, false);

function initialize()
{
	var t = window.event.target;
	
	if(t.type === "textarea" && t !== currentField)									init_this_textarea(t);
	else if("text search email tel url".indexOf(t.type) >= 0 && t !== currentField)	init_this_input(t);
}

function autogrow_textarea()
{
	if(window.event.which > 32 && window.event.which < 41) return; // Home/End/PgUp/PgDwn + arrow keys
	t = window.event.target;
	
	var scrollHeight_before = compareField.firstChild.scrollHeight;
	var style = window.getComputedStyle(t,0);
	
	compareField.firstChild.style.width = style.getPropertyValue("width");
	compareField.firstChild.value = t.value+"\n";
	
	t.style.height = parseInt(t.style.height!=="" ? t.style.height : style.getPropertyValue("height"))+compareField.firstChild.scrollHeight-scrollHeight_before+"px";
}

function autogrow_input()
{
	if(window.event.which > 32 && window.event.which < 41) return; // Home/End/PgUp/PgDwn + arrow keys
	
	compareField.innerHTML = window.event.target.value+"ww"; // ww is just some space (w = widest character)
	window.event.target.style.width = compareField.offsetWidth+"px";
}


function init_this_textarea(t)
{
	
	removePreviousEventListeners();
	addEventListeners(t, autogrow_textarea);
	
	if(widget.preferences.resizable !== "0")			t.style.resize = widget.preferences.resizable;
	if(widget.preferences.transition_duration !== "0")	t.style.transition = t.style.OTransition = "height "+widget.preferences.transition_duration+"ms";
	
	var style = window.getComputedStyle(t,0);
	
	if(compareField) compareField.parentNode.removeChild(compareField);
	
	var compareField_container				= document.createElement("div");
	compareField_container.id				= "Xpander_compareField";
	compareField_container.style.overflow	= "hidden";
	compareField_container.style.position	= "absolute";
	compareField_container.style.height		= "1px";
	compareField_container.style.opacity	= "0.01";
	
	var compareField_prototype				= t.cloneNode(0);
	compareField_prototype.tabIndex			= "-1";
	compareField_prototype.disabled			= "disabled";
	compareField_prototype.style.overflow	= "hidden";
	
	compareField_prototype.value			+= "\n";
	compareField_prototype.id				= ""; // got cloned, too
	
	compareField_prototype.style.font		= style.getPropertyValue("font");
	compareField_prototype.style.lineHeight	= style.getPropertyValue("line-height");
	if(t.dataset.xpander_original_height) compareField_prototype.style.height = t.dataset.xpander_original_height;
	else t.dataset.xpander_original_height = compareField_prototype.style.height = style.getPropertyValue("height");
	
	compareField_container.appendChild(compareField_prototype);
	if(document.URL.match("://my.opera.com"))	document.body.appendChild(compareField_container); // smilies stop working
	else										t.parentNode.appendChild(compareField_container);
	
	compareField = document.getElementById("Xpander_compareField");
	currentField = t;
}

function init_this_input(t)
{
	removePreviousEventListeners();
	addEventListeners(t, autogrow_input);
	
	if(compareField) compareField.parentNode.removeChild(compareField);
	
	var compareField_prototype				= document.createElement("div");
	compareField_prototype.id				= "Xpander_compareField";
	
	compareField_prototype.style.position	= "absolute";
	compareField_prototype.style.visibility	= "hidden";
	
	compareField_prototype.style.font		= window.getComputedStyle(t,0).getPropertyValue("font");
	if(t.dataset.xpander_original_width)
		compareField_prototype.style.minWidth = t.dataset.xpander_original_width;
	else
		t.dataset.xpander_original_width = compareField_prototype.style.minWidth = window.getComputedStyle(t,0).getPropertyValue("width");
	compareField_prototype.style.width		= "auto";
	compareField_prototype.style.height		= "1px";
	
	t.parentNode.appendChild(compareField_prototype);
	
	compareField = document.getElementById("Xpander_compareField");
	currentField = t;
}

function removePreviousEventListeners()
{
	if(!currentField) return;
	f = (currentField.type === "textarea" ? autogrow_textarea : autogrow_input);
	
	currentField.removeEventListener("keypress", f, false);
	currentField.removeEventListener("keyup", f, false);
	currentField.removeEventListener("paste", f, false);
}
function addEventListeners(t, f)
{
	t.addEventListener("keypress", f, false);
	t.addEventListener("keyup", f, false);
	t.addEventListener("paste", f, false);
}

}());