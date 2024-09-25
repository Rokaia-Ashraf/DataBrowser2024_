define(['dojo/_base/declare', 'jimu/BaseWidget'],
function(declare, BaseWidget) {  
  return declare([BaseWidget], {
    baseClass: 'jimu-widget-dbheader',

    postCreate: function() {
      this.inherited(arguments);      
    },

    startup: function() {
      this.inherited(arguments);      
    },    

    onSignIn: function(credential){      
      console.log('onSignInHeader');
      console.log(credential);
    },

    onSignOut: function(){
      console.log('onSignOutHeader');
    }    
  });
});