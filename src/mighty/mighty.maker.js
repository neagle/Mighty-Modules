Mighty.define(["mighty.core"], function( core ){
	
	return {
		
		// These options will be used as defaults
        /*
		options: {
            // TODO: using the value null as a default causes an error
            blueprint: '' // the name of the module to make
		},
        */

        maker: [
            {
                option: "perpane",
                name: "Items per pane",
                description: "Maximum number of items to display on each pane",
                type: "integer",
                value: 7,
                minimum: 1,
                maximum: null
            },

            {
                option: "initial",
                name: "Initial pane",
                description: "What pane should be visible initially",
                type: "integer",
                value: 1,
                minimum: 1,
                maximum: null
            },

            {
                option: "foo",
                name: "Foo",
                description: "Please input value of foo",
                type: "text",
                value: "bar",
                minlength: null,
                maxlength: null 
            }
        ],
	
		// Set up the widget
		_create: function () {
			
			var self = this,
				options = self.options,
				element = self.element,
				width = options.width;
	
		// 	core.getCSS("../src/mighty.mostpopular.css");

            core.getJSONP( '../api/?file=../src/mighty.mostpopular.options.json', function( json ) {
                self._build( json );    
            });
	
		},
	
		_build: function( json ) {
            var self = this,
                element = self.element,
                options = self.options,
                ui = self.ui = {},
                widget = ui.widget = document.createElement( 'a' );

            widget.name = 'mighty';
            widget.className = 'mighty-' + options.blueprint;
            widget.innerHTML = options.blueprint;

//            console.log( json );
            element.innerHTML = '<b>Blueprint:</b> ' + options.blueprint;

            // Build UI for options
            if ( core.isArray( json ) ) {
                var i,
                    length = json.length;

                element.innerHTML = '<h3>Options:</h3>';

                self.inputs = {};

                for ( i = 0; i < length; i += 1 ) {
                    // For every option that has a type specified
                    // Make an input of that type
                    // All available methods stored on the make object
                    var type = json[i].type || null;

                    if ( type ) {
                        self.inputs[json[i].option] = this.make[type].call( this, json[i] );
                    }
                }

                ui.update = document.createElement( 'button' );
                ui.update.innerHTML = 'Update';

                element.appendChild( ui.update );

            }

            element.appendChild( widget );

			this._bindEvents();
		},

        make: {
            integer: function( options ) {
                var newOption = document.createElement( 'div' ),
                    input = document.createElement( 'input' ),
                    defaultValue = '' || options.value;

                newOption.innerHTML = '<label for="' + this.options.blueprint + '-option-' + options.option + '">' + options.name + ' <b class="help">' + options.description + '</b></label>';

                core.attr( input, 'type', 'number' );
                core.attr( input, 'data-option', options.option );

                defaultValue && core.attr( input, 'value', defaultValue );
                options.minimum && core.attr( input, 'min', options.minimum );
                options.maximum && core.attr( input, 'max', options.maximum );

                newOption.appendChild( input );

                this.element.appendChild( newOption );

                return input;
            },

            text: function( options ) {
                var newOption = document.createElement( 'div' ),
                    input = document.createElement( 'input' ),
                    defaultValue = '' || options.value;

                newOption.innerHTML = '<label for="' + this.options.blueprint + '-option-' + options.option + '">' + options.name + ' <b class="help">' + options.description + '</b></label>';

                core.attr( input, 'type', 'text' );
                core.attr( input, 'data-option', options.option );
                
                defaultValue && core.attr( input, 'value', defaultValue );

                newOption.appendChild( input );

                this.element.appendChild( newOption );

                return input;
            }
        },
	
		_bindEvents: function() {
			var self = this,
                ui = self.ui;
	
			core.bind( ui.update, 'click', function( event ) {
				core.publish( 'update' );
				event.preventDefault();
			});
	
			// Doing some tricky stuff to juggle scope here - note for possible Boot dev
			core.subscribe( self, 'update', (function( event ) { self.update.apply( self, [ event ] ); }));
		},
	
		update: function( event ) {
            var widget = this.ui.widget,
                inputs = this.inputs;

            for ( option in inputs ) {
                core.attr( widget, 'data-' + option, inputs[option].value );
            }

            console.log( 'widget yo', widget );

            // console.log( 'this is where the magic happens', this.inputs );
//            console.log( core );
            Mighty.init();
            // core.defer();
		}
	
		// Use the destroy method to clean up any modifications your widget has made to the DOM
	//	destroy: function () {
	//		this.element.removeChild( this.ui.mostPopular );
	//	}
	};
	
});