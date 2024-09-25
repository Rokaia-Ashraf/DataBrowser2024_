define(['dojo/_base/declare', 'jimu/BaseWidget', 'jimu/loaderplugins/jquery-loader!themes/DatabrowserTheme/jquery-git.min.js'],
    function (declare, BaseWidget) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-dbheader',
            postCreate: function () {
                this.inherited(arguments);
            },
            addUserInfo(name){
                $('#user-id').html(name);
            },
            startup: function () {
                this.inherited(arguments);
                this.initalizeUI();
            },

            onOpen: function () {
            },

            onSignIn: function (credential) {
                console.log('onSignInDBHeader');
                if(credential?.userId){
                    this.addUserInfo(credential.userId);
                }
            },

            onSignOut: function () {
                console.log('onSignOutDBHeader');
                $('#user-id').html('User Name');
            },
            initalizeUI: function () {
                $('.drop-down').click(function () {
                    $(this).children('.drop-down-menu').first().toggle();
                });
            }
        });
    });