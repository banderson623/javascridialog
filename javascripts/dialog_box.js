var DialogBox = Class.create();

DialogBox.prototype = {
	initialize: function(el) {
		this.element = $(el);
		this.is_processing = false;
		
		
		this.closeObserver = this._closeWindow.bind(this);
		this.findRequiredFields();
		this.setObserversOnFields();
		
		this.openWindow()
	},
	
	save: function() {
		if(Math.random() > 0.5) {
				this.notValid();
			} else {
				this.closeWindow();
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
	
	setObserversOnFields: function(){
		$$('.dialog_box fieldset input','.dialog_box fieldset textarea').each(function(el){
      Event.observe(el,"focus", function(){ this.focusField(el); });
      Event.observe(el,"select",function(){ this.focusField(el); });

      Event.observe(el,'focus', function(){
        if(el.hasClassName('sample')){
          $(el).removeClassName('sample');
          $(el).value="";
        };
      });
    });
	},

	findRequiredFields: function(){
	  this.element.select(".required").each(function(el){
      // alert("Required field: " + el.id);
      console.log('Required fields are: ' + el.id);
	  });
	},

	_closeWindow: function(){
		new Effect.SwitchOff(this.element);
	}
	
}