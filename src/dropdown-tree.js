/**
 * Drop Down Tree
 *
 * This component creates tree like structure with drop down behaviour. 
 *
 * By: Suresh Patidar (2017)
 */

;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        window.DropDownTree = factory(jQuery);
    }
}(function ($) {
    "use strict";
    $.fn.DropDownTree = function() {        
        return this.data('dropDownTree');
    };
    function DropDownTree(options){
    	this.options = $.extend( {}, this.options );
	    $.extend(this.options, options );
	    if(!this.options.element){
	    	throw 'Select element not specified! Provide a select element in options';
	    }
	    if(!this.options.data){
	    	throw 'Data not specified! Provide data in options';
	    }
	    this._init();
    }

    var toggleDropDownDiv = function(self){
		if(!self.divElem.is(":visible")){
			self.divElem.height(self.options.height);
			
			var rect = self.inputElem[0].getBoundingClientRect();
			self.divElem.css('width',rect.width + 'px');
            // var left = rect.left;
            // var top = rect.bottom;
            var tmpobj = getOffset(self.inputElem[0]);
            var pos = self.inputElem.position(); //getOffset(self.inputElem[0]);
            var left = pos.left;
            var top = pos.top + rect.height;           
        	//TODO: Remove the limitation of this for workinging in Iframe
        	if((rect.top + self.divElem.height() + rect.height) >= $(window).height()){
				top = pos.top - self.divElem.outerHeight();
			}   
			
			self.divElem.css('top',top);
			self.divElem.css('left',left);
			self.divElem.show();
		}
		else {
			self.hideDropDownDiv();
		}
    };

    var getListItem = function(id,value,text,isLeaf,isSelected,isExpanded,allowMultiSelect){
    	var listitem = $('<li/>');
    	var expandCollapseCheckBox = $('<input/>').attr({type:'checkbox',id:id+'_ec'});
    	if(isExpanded){
    		expandCollapseCheckBox.attr("checked","checked");
    	}
    	listitem.append(expandCollapseCheckBox);

    	var lblContainer= $('<label/>');
    	var valueCheckBox = $('<input/>').attr({type:'checkbox',id:id});
    	valueCheckBox.data('value',value);
    	if(isSelected){
    		valueCheckBox.attr("checked","checked");
    	}
    	lblContainer.append(valueCheckBox);

    	var chkSpan = $('<span/>')
    	if(allowMultiSelect){
    		chkSpan.attr("class","multiselect");
    	}  
    	lblContainer.append(chkSpan);  	
    	listitem.append(lblContainer);

    	var lblExpandCollapse = $('<label/>').attr("for",id+'_ec').css('width','0px');
    	if(isLeaf){
    		lblExpandCollapse.addClass('leaf');
    	}
    	if(allowMultiSelect){
    		lblExpandCollapse.addClass('multiselect');
    	}

    	listitem.append(lblExpandCollapse);

    	var lblDescription = $('<label/>').attr({for:id,class:'desc'});
    	lblDescription.text(text);
    	if(isSelected){
    		lblDescription.addClass('active');
    	}    	
    	listitem.append(lblDescription);

    	return listitem;
    };

    var getUUID = function() {
	    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
	};

    var getList = function(arrData,valueKey,textKey,childrenKey,arrSelected,allowMultiSelect){    	
    	var list = $('<ul/>');
    	$.each(arrData,function(index,data){
    		var isLeaf = true;
    		var isSelected = false;
    		if(data[childrenKey] != null && data[childrenKey].length > 0){
    			isLeaf = false
    		}
    		if(arrSelected.indexOf(data[valueKey]) !== -1){
    			isSelected = true;
    		}
    		var listItem = getListItem(getUUID(), data[valueKey], data[textKey], isLeaf, isSelected, false,allowMultiSelect)
    		
    		if(data[childrenKey] != null){
    			listItem.append(getList(data[childrenKey], valueKey, textKey, childrenKey,arrSelected,allowMultiSelect));
    		}
    		list.append(listItem);
    	});
    	return list
    };

    var loadData = function(dropDownDiv,data,valueKey,textKey,childrenKey,arrSelected,multiSelect){
    	dropDownDiv.empty();
    	var allowMultiSelect = false;
    	if(multiSelect === "yes"){
    		allowMultiSelect = true;
    	}
    	dropDownDiv.append(getList(data,valueKey,textKey,childrenKey,arrSelected,allowMultiSelect));
    };

    

    var getSelectedTextList = function(dropDownDiv){
    	var arrSelectedText = [];
    	dropDownDiv.find("label:not([for]) input:checkbox").each(function(){
    		var  checkbox = $(this);
    		if(checkbox.is(":checked")){
    			arrSelectedText.push(checkbox.parent().next().next().text());
    		}
    	});
    	return arrSelectedText;
    };

    var getSelectedValueList = function(dropDownDiv){
    	var arrSelectedValue = [];
    	dropDownDiv.find("label:not([for]) input:checkbox").each(function(){
    		var  checkbox = $(this);
    		if(checkbox.is(":checked")){
    			arrSelectedValue.push(checkbox.data('value'));
    		}
    	});
    	return arrSelectedValue;
    };

    var getOffset = function( el ) {
	    var _x = 0;
	    var _y = 0;
	    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
	        _x += el.offsetLeft - el.scrollLeft;
	        _y += el.offsetTop - el.scrollTop;
	        el = el.offsetParent;
	    }
	    return { top: _y, left: _x };
	};


    DropDownTree.prototype.options = {
	    resize : 'none', /* none,x,y,both*/
	    height : "100",
	    cascadeCheck : "no",
	    multiSelect : "yes",
	    element : null,
	    data : null,
	    textKey : null,
	    valueKey : null,
	    childrenKey : null,
	    selectedValues : [],
	    required:'no',
	    onChange:null
	};

	DropDownTree.prototype.getSelectedTexts = function(){
		return getSelectedTextList(this.divElem);
	};

	DropDownTree.prototype.hideDropDownDiv = function(){
		if(this.valueChanged && this.options.onChange){
			this.options.onChange(getSelectedValueList(this.divElem));
		}
		this.valueChanged = false;
		this.divElem.hide();
	};

	DropDownTree.prototype.getSelectedValues = function(){
		return getSelectedValueList(this.divElem);
	};	

	DropDownTree.prototype.setSelectedValues = function(arrSelected){
		var _self = this;		
		this.divElem.find("label:not([for]) input:checkbox").each(function(){
    		var  checkbox = $(this);
    		if(arrSelected.indexOf(checkbox.data('value')) !== -1){
    			checkbox.prop('checked',true);
    			checkbox.parent().next().next().addClass('active');
    			if(_self.options.multiSelect === 'no'){
    				//Break the loop on first selected if drop down is in single select mode.
    				return false;
    			}
    		}
    		else{
    			checkbox.prop('checked',false);
    			checkbox.parent().next().next().removeClass('active');
    		}
    	});
    	this.showSelectedText();
	};

	DropDownTree.prototype.showSelectedText = function(){
		var selectedItems = getSelectedTextList(this.divElem);
		var inputText = "";
		if(selectedItems.length > this.options.maxItemsToDisplay){
			inputText = selectedItems.length + " items selected";
		}
		else{
			inputText = selectedItems.join(', ');
		}
		this.inputElem.val(inputText);
	};

	DropDownTree.prototype.loadData = function(data){
		loadData(this.divElem,data, this.options.valueKey, 
			this.options.textKey, this.options.childrenKey,
			this.options.selectedValues,this.options.multiSelect);
	};

	DropDownTree.prototype.clearSelection = function(){
		this.divElem.find("label:not([for]) input:checkbox").each(function(){
    		var  checkbox = $(this);
    		checkbox.prop('checked',false);
    		checkbox.parent().next().next().removeClass('active');
    	});
    	this.showSelectedText();
    };

    DropDownTree.prototype.onChange = function(changeFunction){
		this.options.onChange = changeFunction;
    };

	DropDownTree.prototype._init = function() {
		var elem = $(this.options.element);
		//Hide the orignal select element
		elem.hide();
		elem.data('dropDownTree',this);
		//Create Drop Down Div element and add it after the select element
		this.divElem = $('<div/>').addClass('dropdown-css3-tree');
		switch(this.options.resize){
			case "x":
				this.divElem.css("resize",'horizontal');
				break;
			case "y":
				this.divElem.css("resize",'vertical');
				break;
			case "both":
				this.divElem.css("resize",'both');
				break;
			default:
				this.divElem.css("resize",'none');
		}
		//this.divElem.height(this.options.height).width(elem.width());		
		elem.after(this.divElem);
		//Create text box and append it after the select element
		this.inputElem = $('<input/>')
		.attr({ 
			type: 'text', name:'txtDropDownTree', 
			value:'',
			autocomplete:"off"})
		.addClass(elem.attr('class'))
		.addClass("dropdown-css3-arrow")
		.css('padding-right', '16px');

		if(this.options.required === 'yes' || elem.prop('required')){
			this.inputElem.attr('required',true);
		}
		this.inputElem.attr('name', elem.attr('name'));

		//Hook up click event to toggle the drop down div visiblity
		var _self = this;
		this.inputElem.click(function(){
			toggleDropDownDiv(_self);
		});

		//Stop user from typing in this text box
		this.inputElem.keydown(function(e){
			var evtobj = window.event? event : e;  // IE support
			var ctrlDown = evtobj.ctrlKey||evtobj.metaKey // Mac support
			if(ctrlDown && evtobj.keyCode === 67){
				return true;
			}
			else{
				return false;
			}
		});

		elem.after(this.inputElem);
		loadData(this.divElem,this.options.data, this.options.valueKey, 
			this.options.textKey, this.options.childrenKey,
			this.options.selectedValues,this.options.multiSelect);


		$(document).mouseup(function (e) {
		    if (!_self.divElem.is(e.target) // if the target of the click isn't the container...
		        && _self.divElem.has(e.target).length === 0
		        && !_self.inputElem.is(e.target)) // ... nor a descendant of the container
		    {
		        _self.hideDropDownDiv();
		    }
		});

		$(window).bind('mousewheel DOMMouseScroll', function(e){		 
            if (!_self.divElem.is(e.target)) // if the target of the scroll isn't the container...
		 	    {
		        _self.hideDropDownDiv();
		    }
    	});
		
		this.divElem.delegate("label input:checkbox", "change", function() {
			var  checkbox = $(this);
			_self.valueChanged = true;
			if(_self.options.multiSelect === 'no'){
				_self.clearSelection();
				checkbox.prop("checked",true);
				_self.hideDropDownDiv();
			}

			if(checkbox.is(":checked")){
				checkbox.parent().next().next().addClass('active');
			}else{
				checkbox.parent().next().next().removeClass('active');
			}
			
			if(_self.options.cascadeCheck === "yes" && _self.options.multiSelect ==="yes" ){			    
			    var nestedList = checkbox.parent().next().next().next();			    
				nestedList.find("label:not([for]) input:checkbox").each(function(){
					if(checkbox.is(":checked")) {
				        $(this).prop("checked", true);
				        $(this).parent().next().next().addClass('active');				        
				    }
				    else{
				    	$(this).prop("checked", false);
				    	$(this).parent().next().next().removeClass('active');				    	
				    }
				});			    
			}
			_self.showSelectedText();
		});	    
	};

    return DropDownTree;
}));