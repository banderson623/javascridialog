var DialogBox = Class.create();

DialogBox.prototype = {
	initialize: function(el) {
		this.element = $(el);
		this.is_processing = false;
		
		this.required_fields = new Array();
		this.errors = new Hash();
		
		this.closeObserver = this._closeWindow.bind(this);
		this.findAllFields();
		this.findRequiredFields();
		this.setObserversOnFields();
		this.openWindow()
	},
	
	save: function() {
	  if(this.checkIfValid()) {
	    this.closeWindow();
	  } else {
	    console.log("Not valid! " + this.errors.inspect());
	    this.notValid();
	  }
	},
	
	cancel: function() {
		new Effect.Fade(this.element);
	},
	
	openWindow: function(){
		new Effect.Appear(this.element);
	},
	
	closeWindow: function(){
		this.showSpinner();
		setTimeout(this.closeObserver, 3000);
	},
	
	showSpinner: function(){
		new Effect.Appear(this.element.down('div[class=processing]'), {to: 0.8, duration: 0.75});
	},

	hideSpinner: function(){
		new Effect.Fade(this.element.down('div[class=processing]'));
	},

	notValid:function(){
	  // Remove all the not_valid classes
	  this.all_the_fields.each(function(el){ $(el).removeClassName('not_valid'); });
	
	  // Add 'not_valid' classes to those fields that are not valid
	  this.errors.keys().each(function(field){$(field).addClassName('not_valid'); });
		new Effect.Shake(this.element);
	},
	
	focusField:function(el){
		var el = $(el);
		el.addClassName('focused');
		el.previous('label').addClassName('focused');
		
		Event.observe(el,"blur",function(field_el){
			el.removeClassName('focused');
			el.previous('label').removeClassName('focused');
    });
	},
	
	findAllFields: function(){
	  this.all_the_fields = $(this.element).select("input","textarea","select");
	},
	
	setObserversOnFields: function(){	  
		$$('.dialog_box fieldset input','.dialog_box fieldset textarea').each(function(el){
      Event.observe(el,"focus", function(){ this.focusField(el);}.bind(this));
      Event.observe(el,"select",function(){ this.focusField(el);}.bind(this));

      Event.observe(el,'focus', function(){
        if(el.hasClassName('sample')){
          $(el).removeClassName('sample');
          $(el).value="";
        };
      });
    }.bind(this));
	},

	findRequiredFields: function(){
	  this.element.select(".required").each(function(el){
	    this.required_fields.push(el.id);
	    this.denoteRequiredField(el.id);
	  }.bind(this));
	},
  

  denoteRequiredField: function(field_id){
    var label = $(field_id).previous('label');
    label.addClassName('required');
    label.update(label.innerHTML + ' *'); 
    $(field_id).addClassName('required');
  },

  checkIfValid: function(){
    this.errors = new Hash();
    this.required_fields.each(function(field){
      if($(field).hasClassName('sample') || $(field).value.length < 1){
        this.errors.set(field, "must be filled in");
      } 
    }.bind(this));
    return (this.required_fields.keys().length == 0);
  },

	_closeWindow: function(){
		new Effect.SwitchOff(this.element);
	}
	
}
