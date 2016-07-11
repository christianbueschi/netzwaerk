
/*
 * Generated with Grunt on 11.07.2016 at 13:46:11
 */

/**
 * Terrific JavaScript Framework v2.1.0
 * http://terrifically.org
 *
 * Copyright 2014, Remo Brunschwiler
 * @license MIT Licensed.
 *
 * Date: Thu Jun 12 2014 15:18:26
 *
 *
 * Includes:
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 *
 * @module Tc
 *
 */
(function() {
    var // save a reference to the global object
    Tc, $, root = this;
    Tc = "undefined" != typeof exports ? exports : root.Tc = {}, /*
     * The base library object.
     */
    $ = Tc.$ = root.jQuery || root.Zepto || root.$, /*
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
    /* jshint ignore:start */
    function() {
        var initializing = !1, fnTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;
        // The base Class implementation (does nothing)
        this.Class = function() {}, // Create a new Class that inherits from this class
        Class.extend = function(prop) {
            // The dummy class constructor
            function Class() {
                // All construction is actually done in the init method
                !initializing && this.init && this.init.apply(this, arguments);
            }
            var _super = this.prototype;
            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = !0;
            var prototype = new this();
            initializing = !1;
            // Copy the properties over onto the new prototype
            for (var name in prop) // Check if we're overwriting an existing function
            prototype[name] = "function" == typeof prop[name] && "function" == typeof _super[name] && fnTest.test(prop[name]) ? function(name, fn) {
                return function() {
                    var tmp = this._super;
                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];
                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    return this._super = tmp, ret;
                };
            }(name, prop[name]) : prop[name];
            // Populate our constructed prototype object
            // Enforce the constructor to be what we expect
            // And make this class extendable
            return Class.prototype = prototype, Class.constructor = Class, Class.extend = arguments.callee, 
            Class;
        };
    }(), /* jshint ignore:end */
    /**
 * Contains the application base config.
 * The base config can be extended or overwritten either via
 * new Application ($ctx, config) during bootstrapping the application or via
 * overriding the Tc.Config object in your project.
 *
 * @author Remo Brunschwiler
 * @namespace Tc
 * @class Config
 * @static
 */
    Tc.Config = {
        /**
     * The paths for the different types of dependencies.
     *
     * @property dependencies
     * @type Object
     */
        dependencies: {
            css: "/css/dependencies",
            js: "/js/dependencies"
        }
    }, /**
 * Responsible for application-wide issues such as the creation of modules and establishing connections between them.
 *
 * @author Remo Brunschwiler
 * @namespace Tc
 * @class Application
 */
    Tc.Application = Class.extend({
        /**
     * Initializes the application.
     *
     * @method init
     * @constructor
     * @param {jQuery} $ctx
     *      The jQuery context
     * @param {Object} config
     *      The configuration
     */
        init: function($ctx, config) {
            /**
         * The configuration.
         *
         * @property config
         * @type Object
         */
            this.config = $.extend({}, Tc.Config, config), /**
         * The jQuery context.
         *
         * @property $ctx
         * @type jQuery
         */
            this.$ctx = $ctx || $("body"), /**
         * Contains references to all modules on the page. This can, for
         * example, be useful when there are interactions between Flash
         * objects and Javascript.
         *
         * @property modules
         * @type Array
         */
            this.modules = [], /**
         * Contains references to all connectors on the page.
         *
         * @property connectors
         * @type Object
         */
            this.connectors = {}, /**
         * The sandbox to get the resources from
         * This sandbox is shared between all modules.
         *
         * @property sandbox
         * @type Sandbox
         */
            this.sandbox = new Tc.Sandbox(this, this.config);
        },
        /**
     * Register modules withing scope
     * Automatically registers all modules within the scope,
     * as long as the modules use the OOCSS naming conventions.
     *
     * @method registerModules
     * @param {jQuery} $ctx
     *      The jQuery context
     * @return {Array}
     *      A list containing the references of the registered modules
     */
        registerModules: function($ctx) {
            var self = this, modules = [], stringUtils = Tc.Utils.String;
            return $ctx = $ctx || this.$ctx, $ctx.find('.mod:not([data-ignore="true"])').add($ctx).each(function() {
                var $this = $(this), classes = $this.attr("class") || "";
                /*
             * A module can have several different classes and data attributes.
             * See below for possible values.
             */
                /*
             * @config .mod
             *
             * Indicates that it is a base module, this is the default and
             * no JavaScript needs to be involved. It must occur excactly
             * once.
             */
                /*
             * @config .mod{moduleName} || .mod-{module-name}
             *
             * Indicates that it is a module of type basic, which is
             * derived from the base module. It can occur at most
             * once. Example: .modBasic || .mod-basic
             */
                /*
             * @config .skin{moduleName}{skinName} || .skin-{module-name}-{skin-name}
             *
             * Indicates that the module basic has the submarine skin. It
             * will be decorated by the skin JS (if it exists). It can occur
             * arbitrarily. Example: .skinBasicSubmarine || .skin-basic-submarine
             */
                /*
             * @config data-connectors
             *
             * A module can have a comma-separated list of data connectors.
             * The list contains the IDs of the connectors in the following
             * schema: {connectorType}-{connectorId}
             *
             * {connectorType} is optional. If only the {connectorId} is given, the
             * default connector is instantiated.
             *
             * The example MasterSlave-Navigation decodes to: type =
             * MasterSlave, id = Navigation. This instantiates the MasterSlave
             * connector (as mediator) with the connector id Navigation.
             * The connector id is used to chain the appropriate (the ones with the same id)
             * modules together and to improve the reusability of the connector.
             * It can contain multiple connector ids (e.g. 1,2,MasterSlave-Navigation).
             */
                if (classes = classes.split(" "), classes.length > 1) {
                    for (var modName, dataConnectors, skins = [], connectors = [], i = 0, len = classes.length; i < len; i++) {
                        var part = $.trim(classes[i]);
                        // do nothing for empty parts
                        part && (// convert to camel if necessary
                        part.indexOf("-") > -1 && (part = stringUtils.toCamel(part)), 0 === part.indexOf("mod") && part.length > 3 ? modName = part.substr(3) : 0 === part.indexOf("skin") && // Remove the mod name part from the skin name
                        skins.push(part.substr(4).replace(modName, "")));
                    }
                    if (/*
                 * This needs to be done via attr() instead of data().
                 * As data() cast a single number-only connector to an integer, the split will fail.
                 */
                    dataConnectors = $this.attr("data-connectors")) {
                        connectors = dataConnectors.split(",");
                        for (var i = 0, len = connectors.length; i < len; i++) {
                            var connector = $.trim(connectors[i]);
                            // do nothing for empty connectors
                            connector && (connectors[i] = connector);
                        }
                    }
                    modName && Tc.Module[modName] && modules.push(self.registerModule($this, modName, skins, connectors));
                }
            }), modules;
        },
        /**
     * Unregisters the modules given by the module instances.
     *
     * @method unregisterModules
     * @param {Array} modules
     *      A list containing the module instances to unregister
     */
        unregisterModules: function(modules) {
            var connectors = this.connectors;
            if (modules = modules || this.modules, modules === this.modules) // Clear everything if the arrays are equal
            this.connectors = [], this.modules = []; else // Unregister the given modules
            for (var i = 0, len = modules.length; i < len; i++) {
                var index, module = modules[i];
                // Delete the references in the connectors
                for (var connectorId in connectors) connectors.hasOwnProperty(connectorId) && connectors[connectorId].unregisterComponent(module);
                // Delete the module instance itself
                index = $.inArray(module, this.modules), index > -1 && delete this.modules[index];
            }
        },
        /**
	 * Registers a hook that is called at the end.
	 *
	 * @method end
	 * @param {Function} hook
	 * 		The hook function to be executed
	 */
        end: function(hook) {
            "function" == typeof hook && this.sandbox.addCallback("end", hook);
        },
        /**
     * Starts (intializes) the registered modules.
     *
     * @method start
     * @param {Array} modules
     *      A list of the modules to start
     */
        start: function(modules) {
            modules = modules || this.modules;
            // Start the modules
            for (var i = 0, len = modules.length; i < len; i++) modules[i].start();
        },
        /**
     * Stops the registered modules.
     *
     * @method stop
     * @param {Array} modules
     *      A list containing the module instances to stop
     */
        stop: function(modules) {
            modules = modules || this.modules;
            // Stop the modules
            for (var i = 0, len = modules.length; i < len; i++) modules[i].stop();
        },
        /**
     * Registers a module.
     *
     * @method registerModule
     * @param {jQuery} $node
     *      The module node
     * @param {String} modName
     *      The module name. It must match the class name of the module
     * @param {Array} skins
     *      A list of skin names. Each entry must match a class name of a skin
     * @param {Array} connectors
     *      A list of connectors identifiers (e.g. MasterSlave-Navigation)
     *      Schema: {connectorName}-{connectorId}
     * @return {Module}
     *      The reference to the registered module
     */
        registerModule: function($node, modName, skins, connectors) {
            var modules = this.modules;
            if (modName = modName || void 0, skins = skins || [], connectors = connectors || [], 
            modName && Tc.Module[modName]) {
                // Generate a unique ID for every module
                var id = modules.length;
                $node.data("terrific-id", id), // Instantiate module
                modules[id] = new Tc.Module[modName]($node, this.sandbox, id);
                // Decorate it
                for (var i = 0, len = skins.length; i < len; i++) {
                    var skinName = skins[i];
                    Tc.Module[modName][skinName] && (modules[id] = modules[id].getDecoratedModule(modName, skinName));
                }
                // Register connections
                for (var i = 0, len = connectors.length; i < len; i++) this.registerConnection(connectors[i], modules[id]);
                return modules[id];
            }
            return null;
        },
        /**
     * Registers a connection between a module and a connector.
     *
     * @method registerConnection
     * @param {String} connector
     *      The full connector name (e.g. MasterSlave-Navigation)
     * @param {Module} component
     *      The module instance
     */
        registerConnection: function(connector, component) {
            connector = $.trim(connector);
            var connectorType, connectorId, identifier, parts = connector.split("-");
            if (1 === parts.length ? // default connector
            identifier = connectorId = parts[0] : 2 === parts.length && (// a specific connector type is given
            connectorType = parts[0], connectorId = parts[1], identifier = connectorType + connectorId), 
            identifier) {
                var connectors = this.connectors;
                connectors[identifier] || (// Instantiate the appropriate connector if it does not exist yet
                connectorType ? Tc.Connector[connectorType] && (connectors[identifier] = new Tc.Connector[connectorType](connectorId)) : connectors[identifier] = new Tc.Connector(connectorId)), 
                connectors[identifier] && (/*
                 * The connector observes the component and attaches it as
                 * an observer.
                 */
                component.attachConnector(connectors[identifier]), /*
                 * The component wants to be informed over state changes.
                 * It registers it as connector member.
                 */
                connectors[identifier].registerComponent(component));
            }
        },
        /**
     * Unregisters a module from a connector.
     *
     * @method unregisterConnection
     * @param {String} connectorId
     *      The connector channel id (e.g. 2)
     * @param {Module} component
     *      The module instance
     */
        unregisterConnection: function(connectorId, component) {
            var connector = this.connectors[connectorId];
            // Delete the references in the connector and the module
            connector && (connector.unregisterComponent(component), component.detachConnector(connector));
        }
    }), /**
 * The sandbox is used as a central point to get resources from, grant
 * permissions, etc.  It is shared between all modules.
 *
 * @author Remo Brunschwiler
 * @namespace Tc
 * @class Sandbox
 */
    Tc.Sandbox = Class.extend({
        /**
     * Initializes the Sandbox.
     *
     * @method init
     * @constructor
     * @param {Applicaton} application
     *      The application reference
     * @param {Object} config
     *      The configuration
     */
        init: function(application, config) {
            /**
         * The application
         *
         * @property application
         * @type Application
         */
            this.application = application, /**
         * The configuration.
         *
         * @property config
         * @type Object
         */
            this.config = config, /**
		 * Contains function references to registered hooks.
		 *
		 * @property hooks
		 * @type Object
		 */
            this.hooks = {
                after: [],
                end: []
            };
        },
        /**
     * Adds (register and start) all modules in the given context scope.
     *
     * @method addModules
     * @param {jQuery} $ctx
     *      The jQuery context
     * @return {Array}
     *      A list containing the references of the registered modules
     */
        addModules: function($ctx) {
            var modules = [], application = this.application;
            // Register modules
            // Start modules
            return $ctx && (modules = application.registerModules($ctx), application.start(modules)), 
            modules;
        },
        /**
     * Removes a module by module instances.
     * This stops and unregisters a module through a module instance.
     *
     * @method removeModules
     * @param {mixed} modules
     *      A list containing the module instances to remove or the jQuery context to look for registered modules in.
     */
        removeModules: function(modules) {
            var self = this, application = this.application;
            if (!$.isArray(modules)) {
                var $ctx = modules, tmpModules = [];
                $ctx.find(".mod").add($ctx).each(function() {
                    // check for instance
                    var id = $(this).data("terrific-id");
                    if (void 0 !== id) {
                        var module = self.getModuleById(id);
                        module && tmpModules.push(module);
                    }
                }), modules = tmpModules;
            }
            modules && (// Stop modules
            application.stop(modules), // Unregister modules
            application.unregisterModules(modules));
        },
        /**
     * Subscribes a module to a connector.
     *
     * @method subscribe
     * @param {String} connector The full connector name (e.g. MasterSlave-Navigation)
     * @param {Module} module The module instance
     */
        subscribe: function(connector, module) {
            var application = this.application;
            // guards
            if (// explicitly cast connector to string (e.g. to handle 0 case)
            connector += "", !module || !connector) throw new Error("subscribe is expecting 2 parameters (connector, module)");
            if (!(module instanceof Tc.Module)) throw new Error("the module param must be an instance of Tc.Module");
            application.registerConnection(connector, module);
        },
        /**
     * Unsubscribes a module from a connector.
     *
     * @method unsubscribe
     * @param {String} connectorId The connector channel id (e.g. 2 or Navigation)
     * @param {Module} module The module instance
     */
        unsubscribe: function(connectorId, module) {
            var application = this.application;
            module instanceof Tc.Module && connectorId && (// explicitly cast connector id to string
            connectorId += "", application.unregisterConnection(connectorId, module));
        },
        /**
     * Gets the appropriate module for the given ID.
     *
     * @method getModuleById
     * @param {int} id
     *      The module ID
     * @return {Module}
     *      The appropriate module
     */
        getModuleById: function(id) {
            var application = this.application;
            if (void 0 !== application.modules[id]) return application.modules[id];
            throw new Error("the module with the id " + id + " does not exist");
        },
        /**
     * Gets the application config.
     *
     * @method getConfig
     * @return {Object}
     *      The configuration object
     */
        getConfig: function() {
            return this.config;
        },
        /**
     * Gets an application config param.
     *
     * @method getConfigParam
     * @param {String} name
     *      The param name
     * @return {mixed}
     *      The appropriate configuration param
     */
        getConfigParam: function(name) {
            var config = this.config;
            if (void 0 !== config[name]) return config[name];
            throw new Error("the config param " + name + " does not exist");
        },
        /**
	 * Adds a callback to be executed in the appropriate phase.
	 *
	 * @method addCallback
	 * @param {String} phase default: end
	 * @param {Function} callback
	 */
        addCallback: function(phase, callback) {
            // validate params
            null == callback && (// only 1 param
            phase = "end"), this.hooks[phase].push(callback);
        },
        /**
     * Collects the module status messages and handles the callbacks.
     * This means that it is ready for the 'after' hook.
     *
     * @method ready
     * @param {Function} callback
     *      The 'after' hook module callback
     */
        ready: function(callback) {
            var afterHooks = this.hooks.after;
            // Check whether all modules are ready for the 'after' hook
            if (// Add the callback to the stack
            afterHooks.push(callback), this.application.modules.length === afterHooks.length) {
                for (var i = 0; i < afterHooks.length; i++) {
                    var afterCallback = afterHooks[i];
                    "function" == typeof afterCallback && (// make sure the callback is only executed once (and is not called during addModules)
                    delete afterHooks[i], afterCallback());
                }
                for (var endHooks = this.hooks.end, i = 0; i < endHooks.length; i++) {
                    var hook = endHooks[i];
                    "function" == typeof hook && hook();
                }
            }
        }
    }), /**
 * Base class for the different modules.
 *
 * @author Remo Brunschwiler
 * @namespace Tc
 * @class Module
 */
    Tc.Module = Class.extend({
        /**
     * Initializes the Module.
     *
     * @method init
     * @constructor
     * @param {jQuery} $ctx
     *      The jQuery context
     * @param {Sandbox} sandbox
     *      The sandbox to get the resources from
     * @param {String} id
     *      The Unique module ID
     */
        init: function($ctx, sandbox, id) {
            /**
         * Contains the module context.
         *
         * @property $ctx
         * @type jQuery
         */
            this.$ctx = $ctx, /**
         * Contains the unique module ID.
         *
         * @property id
         * @type String
         */
            this.id = id, /**
         * Contains the attached connectors.
         *
         * @property connectors
         * @type Object
         */
            this.connectors = {}, /**
         * The sandbox to get the resources from.
         *
         * @property sandbox
         * @type Sandbox
         */
            this.sandbox = sandbox;
        },
        /**
     * Template method to start (i.e. init) the module.
     * This method provides hook functions which can be overridden
     * by the individual instance.
     *
     * @method start
     */
        start: function() {
            var self = this;
            // Call the hook method from the individual instance and provide the appropriate callback
            this.on && this.on(function() {
                self.initAfter();
            });
        },
        /**
     * Template method to stop the module.
     *
     * @method stop
     */
        stop: function() {
            var $ctx = this.$ctx;
            // Remove all bound events and associated jQuery data
            $("*", $ctx).unbind().removeData(), $ctx.unbind().removeData();
        },
        /**
     * Initialization callback.
     *
     * @method initAfter
     * @protected
     */
        initAfter: function() {
            var self = this;
            this.sandbox.ready(function() {
                /*
             * Call the 'after' hook method from the individual instance
             */
                self.after && self.after();
            });
        },
        /**
     * Notifies all attached connectors about changes.
     *
     * @method fire
     * @param {String} state The new state
     * @param {Object} data The data to provide to your connected modules (optional)
     * @param {Array} channels  A list containing the channel ids to send the event to (optional)
     * @param {Function} defaultAction The default action to perform (optional)
     */
        fire: function(state, data, channels, defaultAction) {
            var self = this, connectors = this.connectors, shouldBeCalled = !0;
            // indicates whether the default handler should be called
            // validate params
            null == channels && null == defaultAction ? // Max. 2 params
            "function" == typeof data ? (// (state, defaultAction)
            defaultAction = data, data = void 0) : $.isArray(data) && (// (state, channels)
            channels = data, data = void 0) : null == defaultAction && (// 2-3 params
            "function" == typeof channels && (// (state, data, defaultAction)
            defaultAction = channels, channels = void 0), $.isArray(data) && (// (state, channels, defaultAction)
            channels = data, data = void 0)), state = Tc.Utils.String.capitalize(state), data = data || {}, 
            channels = channels || Object.keys(connectors);
            for (var i = 0, len = channels.length; i < len; i++) {
                var connectorId = channels[i];
                if (!connectors.hasOwnProperty(connectorId)) throw new Error("the module #" + self.id + " is not connected to connector " + connectorId + " – hint: please make sure that your data is an object and not an array");
                var connector = connectors[connectorId], proceed = connector.notify(self, "on" + state, data) || !1;
                proceed || (shouldBeCalled = !1);
            }
            // Execute default action unless a veto is provided
            shouldBeCalled && "function" == typeof defaultAction && defaultAction(data);
        },
        /**
     * Attaches a connector (observer).
     *
     * @method attachConnector
     * @param {Connector} connector
     *      The connector to attach
     */
        attachConnector: function(connector) {
            this.connectors[connector.connectorId] = connector;
        },
        /**
     * Detaches a connector (observer).
     *
     * @method detachConnector
     * @param {Connector} connector The connector to detach
     */
        detachConnector: function(connector) {
            delete this.connectors[connector.connectorId];
        },
        /**
     * Decorates itself with the given skin.
     *
     * @method getDecoratedModule
     * @param {String} module The name of the module
     * @param {String} skin The name of the skin
     * @return {Module} The decorated module
     */
        getDecoratedModule: function(module, skin) {
            if (Tc.Module[module][skin]) {
                var Decorator = Tc.Module[module][skin];
                /*
             * Sets the prototype object to the module.
             * So the "non-decorated" functions will be called on the module
             * without implementing the whole module interface.
             */
                return Decorator.prototype = this, Decorator.prototype.constructor = Tc.Module[module][skin], 
                new Decorator(this);
            }
            return null;
        }
    }), /**
 * Base class for the different connectors.
 *
 * @author Remo Brunschwiler
 * @namespace Tc
 * @class Connector
 */
    Tc.Connector = Class.extend({
        /**
     * Initializes the Connector.
     *
     * @method init
     * @constructor
     * @param {String} connectorId
     *      The unique connector ID
     */
        init: function(connectorId) {
            this.connectorId = connectorId, this.components = {};
        },
        /**
     * Registers a component.
     *
     * @method registerComponent
     * @param {Module} component
     *      The module to register
     */
        registerComponent: function(component) {
            this.components[component.id] = {
                component: component
            };
        },
        /**
     * Unregisters a component.
     *
     * @method unregisterComponent
     * @param {Module} component
     *      The module to unregister
     */
        unregisterComponent: function(component) {
            var components = this.components;
            components[component.id] && delete components[component.id];
        },
        /**
     * Notifies all registered components about a state change
     * This can be be overriden in the specific connectors.
     *
     * @method notify
     * @param {Module} origin
     *      The module that sends the state change
     * @param {String} state
     *      The component's state
     * @param {Object} data
     *      Contains the state relevant data (if any)
     * @return {boolean}
     *      Indicates whether the default action should be excuted or not
     */
        notify: function(origin, state, data, callback) {
            /*
         * Gives the components the ability to prevent the default- and
         * after action from the events by returning false in the
         * on {Event}-Handler.
         */
            var proceed = !0, components = this.components;
            for (var id in components) if (components.hasOwnProperty(id)) {
                var component = components[id].component;
                component !== origin && component[state] && component[state](data) === !1 && (proceed = !1);
            }
            return proceed;
        }
    }), /*
 * Contains utility functions for several tasks.
 */
    Tc.Utils = {}, // Helpers
    // Object.keys is native in JavaScript 1.8.5
    Object.keys || (Object.keys = function(obj) {
        var k, keys = [];
        for (k in obj) obj.hasOwnProperty(k) && keys.push(k);
        return keys;
    }), /**
 * Contains utility functions for string concerning tasks.
 *
 * @author Remo Brunschwiler
 * @namespace Tc
 * @class Utils.String
 * @static
 */
    Tc.Utils.String = {
        /**
     * Capitalizes the first letter of the given string.
     *
     * @method capitalize
     * @param {String} str
     *      The original string
     * @return {String}
     *      The capitalized string
     */
        capitalize: function(str) {
            // Capitalize the first letter
            return str.substr(0, 1).toUpperCase().concat(str.substr(1));
        },
        /**
     * Camelizes the given string.
     *
     * @method toCamel
     * @param {String} str
     *      The original string
     * @return {String}
     *      The camelized string
     */
        toCamel: function(str) {
            return str.replace(/(\-[A-Za-z])/g, function($1) {
                return $1.toUpperCase().replace("-", "");
            });
        }
    };
}).call(this), /**
 * https://github.com/MarcDiethelm/terrificjs-extensions
 * Adds some sugar and enhancements to @brunschgi's excellent Terrificjs frontend framework.
 * @file terrificjs-extensions.js
 * @license MIT
 * @copyright 2014 Marc Diethelm
 */
function($) {
    "use strict";
    /**
	 * Select elements in the module context. Usage: this.$(selector)
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @param {String} selector
	 * @returns {Object} - jQuery collection
	 */
    Tc.Module.prototype.$ = function(selector) {
        return this.$ctx.find(selector);
    }, /**
	 * Deprecated. Use Tc.Module.prototype.$
	 * Select elements in the module context. Usage: this.$$(selector)
	 * @deprecated Use Tc.Module.prototype.$
	 * @see Tc.Module.prototype.$
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @param {String} selector
	 * @returns {Object} - jQuery collection
	 */
    Tc.Module.prototype.$$ = Tc.Module.prototype.$, /**
	 * Bind methods to Terrific module context. Usage: this.bindAll(funcName [,funcName...])
	 * Inspired by Underscore's bindAll. http://underscorejs.org/#bindAll
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @author Simon Harte <simon.harte@namics.com>
	 * @param {...String} methods - Names of methods each as a param.
	 * @returns {Module} - Returns the module instance for chaining.
	 */
    Tc.Module.prototype.bindAll = function(methods) {
        var methodName, i = 0, args = arguments, argLen = args.length;
        for (i; i < argLen; i++) {
            if (methodName = args[i], "function" != typeof this[methodName]) throw "string" == typeof methodName ? new TypeError("bindAll: Tc.Module." + this.getName() + "." + methodName + " is not a function") : new TypeError("Arguments to bindAll must be strings");
            this[methodName] = $.proxy(this, methodName);
        }
        return this;
    }, /**
	 * Get the name of the Terrific module
	 * @author Remo Brunschwiler <remo.brunschwiler@namics.com>
	 * @author Mathias Hayoz <mathias.hayoz@namics.com>
	 * @returns {String} - Module name
	 */
    Tc.Module.prototype.getName = function() {
        var property;
        if (!this._modName) for (property in Tc.Module) if (Tc.Module.hasOwnProperty(property) && "constructor" !== property && this instanceof Tc.Module[property]) {
            this._modName = property;
            break;
        }
        return this._modName;
    }, /**
	 * Simplify connector channel subscription. Usage: this.subscribe(channelName [,channelName...])
	 *
	 * Because the second parameter to sandbox.subscribe (this) is often forgotten.
	 * Additionally this method allows connecting to multiple channels at once.
	 * @author Simon Harte <simon.harte@namics.com>
	 * @param {...String} channels - Connector channels to subscribe to
	 * @returns {Module} - Returns the module instance for chaining
	 */
    Tc.Module.prototype.subscribe = function(channels) {
        var channelName, i = 0, args = arguments, argLen = args.length;
        for (i; i < argLen; i++) channelName = args[i], this.sandbox.subscribe(channelName, this);
        return this;
    };
    var tplCache = {};
    /**
	 * Micro-templating for modules. Extrapolates {{= foo }} variables in strings from data.
	 * This function is a remix of
	 * - Simple JavaScript Templating – John Resig - http://ejohn.org/ - MIT Licensed
	 * - https://gist.github.com/topliceanu/1537847
	 * - http://weblog.west-wind.com/posts/2008/Oct/13/Client-Templating-with-jQuery
	 * This code incorporates a fix for single-quote usage.
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @param {String} str - Template
	 * @param {Object} [data] - Optional, renders template immediately if present. Data to use as the template context for variable extrapolation.
	 * @returns {Function|String} - Template function, to render template with data, or if data was supplied already the rendered template.
	 */
    Tc.Module.prototype.template = function template(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = /\W/.test(str) ? // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        /*jshint -W054, -W014 */
        new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + // Convert the template into pure JavaScript
        str.replace(/[\r\t\n]/g, " ").replace(/'(?=[^%]*\}\}>)/g, "\t").split("'").join("\\'").split("\t").join("'").replace(/\{\{=(.+?)\}\}/g, "',$1,'").split("{{").join("');").split("}}").join("p.push('") + "');}return p.join('');") : tplCache[str] = tplCache[str] || template(document.getElementById(str).innerHTML);
        /*jshint +W054, +W014 */
        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
}(Tc.$), function() {
    function concatArgs(args, nestedCall) {
        var i, arg, aStr = [], delim = nestedCall ? ", " : ",\n";
        for (i = 0; i < args.length; i++) arg = args[i], void 0 !== arg && null !== arg ? isArray(arg) ? aStr.push("[" + arguments.callee(Array.prototype.slice.call(arg), !0) + "]") : isElement(arg) ? aStr.push(elementToString(arg)) : isjQuery(arg) ? aStr.push(jQueryToString(arg)) : "[object NodeList]" == arg.toString() ? aStr.push("NodeList[" + arguments.callee(Array.prototype.slice.call(arg), !0) + "]") : aStr.push(arg.toString()) : aStr.push(arg + "");
        return aStr.join(delim);
    }
    function elementToString(elem) {
        var htmlId = "", htmlClass = "";
        // replace any white space with a '.'
        return elem.id && (htmlId = "#" + elem.id), elem.className && (htmlClass = "." + elem.className.replace(/\s/g, ".")), 
        elem.tagName + htmlId + htmlClass;
    }
    function jQueryToString($obj) {
        var i, stringArray = [];
        for (i = 0; i < $obj.length; i++) stringArray.push(elementToString($obj[i]));
        return "$(" + stringArray.join(", ") + ")";
    }
    var c, isElement, isjQuery, isArray, method, i, len, w = window, fn = "function", cMethods = [ "log", "info", "debug", "warn", "error", "dir", "table" ];
    //Resulting function returns true if param is a DOM element
    isElement = "function" == typeof HTMLElement ? function(obj) {
        return obj instanceof HTMLElement;
    } : function(obj) {
        return "object" == typeof obj && 1 === obj.nodeType && "string" == typeof obj.nodeName;
    };
    // Resulting function returns true if param is a jQuery object
    try {
        $() instanceof jQuery, // abusing try/catch for flow control. Old crappy browsers (I'm lookin at you IE) will throw.
        isjQuery = function(obj) {
            return obj instanceof jQuery;
        };
    } catch (e) {
        isjQuery = function(obj) {
            return "object" == typeof obj && "jquery" in obj && "string" == typeof obj.jquery;
        };
    }
    if (isArray = Array.isArray || function(obj) {
        return "[object Array]" == Object.prototype.toString.call(obj);
    }, w.console) {
        if (c = console, "dir" in c && "apply" in c.dir) // create global shortcuts
        for (i = 0, len = cMethods.length; i < len && (method = cMethods[i]); i++) typeof c[method] === fn && function(method) {
            // create a new scope to preserve the value of method
            w[method] = function() {
                c[method].apply(c, arguments);
            };
        }(method); else // IE: we have console.log but it just accepts one param. let's fix that! :)
        w.log = function() {
            c.log(concatArgs(arguments));
        }, w.info = function() {
            c.log(concatArgs(arguments));
        }, w.dir = function() {
            c.log(concatArgs(arguments));
        };
        clear = c.clear;
    } else w.log = function() {
        alert(concatArgs(arguments));
    }, w.info = function() {
        alert(concatArgs(arguments));
    }, w.dir = function() {
        alert(concatArgs(arguments));
    };
    w._alert = function() {
        alert(concatArgs(arguments));
    }, /**
	 * A tiny jQuery plugin adding logging to any jQuery object
	 * @param clear Boolean Clear the console before logging?
	 */
    w.jQuery && (jQuery.fn.log = function(clear) {
        return clear && c.clear.call(c), c.log.call(c, this), this;
    }), w.jQuery && (jQuery.fn.alert = function() {
        w._alert(concatArgs(this));
    });
}(), function(name, context, factory) {
    var matchMedia = window.matchMedia;
    "undefined" != typeof module && module.exports ? module.exports = factory(matchMedia) : "function" == typeof define && define.amd ? define(function() {
        return context[name] = factory(matchMedia);
    }) : context[name] = factory(matchMedia);
}("enquire", this, function(matchMedia) {
    "use strict";
    /*jshint unused:false */
    /**
     * Helper function for iterating over a collection
     *
     * @param collection
     * @param fn
     */
    function each(collection, fn) {
        var cont, i = 0, length = collection.length;
        for (i; i < length && (cont = fn(collection[i], i), cont !== !1); i++) ;
    }
    /**
     * Helper function for determining whether target object is an array
     *
     * @param target the object under test
     * @return {Boolean} true if array, false otherwise
     */
    function isArray(target) {
        return "[object Array]" === Object.prototype.toString.apply(target);
    }
    /**
     * Helper function for determining whether target object is a function
     *
     * @param target the object under test
     * @return {Boolean} true if function, false otherwise
     */
    function isFunction(target) {
        return "function" == typeof target;
    }
    /**
     * Delegate to handle a media query being matched and unmatched.
     *
     * @param {object} options
     * @param {function} options.match callback for when the media query is matched
     * @param {function} [options.unmatch] callback for when the media query is unmatched
     * @param {function} [options.setup] one-time callback triggered the first time a query is matched
     * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
     * @constructor
     */
    function QueryHandler(options) {
        this.options = options, !options.deferSetup && this.setup();
    }
    /**
     * Represents a single media query, manages it's state and registered handlers for this query
     *
     * @constructor
     * @param {string} query the media query string
     * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
     */
    function MediaQuery(query, isUnconditional) {
        this.query = query, this.isUnconditional = isUnconditional, this.handlers = [], 
        this.mql = matchMedia(query);
        var self = this;
        this.listener = function(mql) {
            self.mql = mql, self.assess();
        }, this.mql.addListener(this.listener);
    }
    /**
     * Allows for registration of query handlers.
     * Manages the query handler's state and is responsible for wiring up browser events
     *
     * @constructor
     */
    function MediaQueryDispatch() {
        if (!matchMedia) throw new Error("matchMedia not present, legacy browsers require a polyfill");
        this.queries = {}, this.browserIsIncapable = !matchMedia("only all").matches;
    }
    return QueryHandler.prototype = {
        /**
         * coordinates setup of the handler
         *
         * @function
         */
        setup: function() {
            this.options.setup && this.options.setup(), this.initialised = !0;
        },
        /**
         * coordinates setup and triggering of the handler
         *
         * @function
         */
        on: function() {
            !this.initialised && this.setup(), this.options.match && this.options.match();
        },
        /**
         * coordinates the unmatch event for the handler
         *
         * @function
         */
        off: function() {
            this.options.unmatch && this.options.unmatch();
        },
        /**
         * called when a handler is to be destroyed.
         * delegates to the destroy or unmatch callbacks, depending on availability.
         *
         * @function
         */
        destroy: function() {
            this.options.destroy ? this.options.destroy() : this.off();
        },
        /**
         * determines equality by reference.
         * if object is supplied compare options, if function, compare match callback
         *
         * @function
         * @param {object || function} [target] the target for comparison
         */
        equals: function(target) {
            return this.options === target || this.options.match === target;
        }
    }, MediaQuery.prototype = {
        /**
         * add a handler for this query, triggering if already active
         *
         * @param {object} handler
         * @param {function} handler.match callback for when query is activated
         * @param {function} [handler.unmatch] callback for when query is deactivated
         * @param {function} [handler.setup] callback for immediate execution when a query handler is registered
         * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched?
         */
        addHandler: function(handler) {
            var qh = new QueryHandler(handler);
            this.handlers.push(qh), this.matches() && qh.on();
        },
        /**
         * removes the given handler from the collection, and calls it's destroy methods
         * 
         * @param {object || function} handler the handler to remove
         */
        removeHandler: function(handler) {
            var handlers = this.handlers;
            each(handlers, function(h, i) {
                if (h.equals(handler)) return h.destroy(), !handlers.splice(i, 1);
            });
        },
        /**
         * Determine whether the media query should be considered a match
         * 
         * @return {Boolean} true if media query can be considered a match, false otherwise
         */
        matches: function() {
            return this.mql.matches || this.isUnconditional;
        },
        /**
         * Clears all handlers and unbinds events
         */
        clear: function() {
            each(this.handlers, function(handler) {
                handler.destroy();
            }), this.mql.removeListener(this.listener), this.handlers.length = 0;
        },
        /*
         * Assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
         */
        assess: function() {
            var action = this.matches() ? "on" : "off";
            each(this.handlers, function(handler) {
                handler[action]();
            });
        }
    }, MediaQueryDispatch.prototype = {
        /**
         * Registers a handler for the given media query
         *
         * @param {string} q the media query
         * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
         * @param {function} options.match fired when query matched
         * @param {function} [options.unmatch] fired when a query is no longer matched
         * @param {function} [options.setup] fired when handler first triggered
         * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
         * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
         */
        register: function(q, options, shouldDegrade) {
            var queries = this.queries, isUnconditional = shouldDegrade && this.browserIsIncapable;
            //normalise to object in an array
            return queries[q] || (queries[q] = new MediaQuery(q, isUnconditional)), isFunction(options) && (options = {
                match: options
            }), isArray(options) || (options = [ options ]), each(options, function(handler) {
                isFunction(handler) && (handler = {
                    match: handler
                }), queries[q].addHandler(handler);
            }), this;
        },
        /**
         * unregisters a query and all it's handlers, or a specific handler for a query
         *
         * @param {string} q the media query to target
         * @param {object || function} [handler] specific handler to unregister
         */
        unregister: function(q, handler) {
            var query = this.queries[q];
            return query && (handler ? query.removeHandler(handler) : (query.clear(), delete this.queries[q])), 
            this;
        }
    }, new MediaQueryDispatch();
}), /*! fancyBox v2.1.5 fancyapps.com | fancyapps.com/fancybox/#license */
function(r, G, f, v) {
    var J = f("html"), n = f(r), p = f(G), b = f.fancybox = function() {
        b.open.apply(this, arguments);
    }, I = navigator.userAgent.match(/msie/i), B = null, s = G.createTouch !== v, t = function(a) {
        return a && a.hasOwnProperty && a instanceof f;
    }, q = function(a) {
        return a && "string" === f.type(a);
    }, E = function(a) {
        return q(a) && 0 < a.indexOf("%");
    }, l = function(a, d) {
        var e = parseInt(a, 10) || 0;
        return d && E(a) && (e *= b.getViewport()[d] / 100), Math.ceil(e);
    }, w = function(a, b) {
        return l(a, b) + "px";
    };
    f.extend(b, {
        version: "2.1.5",
        defaults: {
            padding: 15,
            margin: 20,
            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            pixelRatio: 1,
            autoSize: !0,
            autoHeight: !1,
            autoWidth: !1,
            autoResize: !0,
            autoCenter: !s,
            fitToView: !0,
            aspectRatio: !1,
            topRatio: .5,
            leftRatio: .5,
            scrolling: "auto",
            wrapCSS: "",
            arrows: !0,
            closeBtn: !0,
            closeClick: !1,
            nextClick: !1,
            mouseWheel: !0,
            autoPlay: !1,
            playSpeed: 3e3,
            preload: 3,
            modal: !1,
            loop: !0,
            ajax: {
                dataType: "html",
                headers: {
                    "X-fancyBox": !0
                }
            },
            iframe: {
                scrolling: "auto",
                preload: !0
            },
            swf: {
                wmode: "transparent",
                allowfullscreen: "true",
                allowscriptaccess: "always"
            },
            keys: {
                next: {
                    13: "left",
                    34: "up",
                    39: "left",
                    40: "up"
                },
                prev: {
                    8: "right",
                    33: "down",
                    37: "right",
                    38: "down"
                },
                close: [ 27 ],
                play: [ 32 ],
                toggle: [ 70 ]
            },
            direction: {
                next: "left",
                prev: "right"
            },
            scrollOutside: !0,
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (I ? ' allowtransparency="true"' : "") + "></iframe>",
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            },
            openEffect: "fade",
            openSpeed: 250,
            openEasing: "swing",
            openOpacity: !0,
            openMethod: "zoomIn",
            closeEffect: "fade",
            closeSpeed: 250,
            closeEasing: "swing",
            closeOpacity: !0,
            closeMethod: "zoomOut",
            nextEffect: "elastic",
            nextSpeed: 250,
            nextEasing: "swing",
            nextMethod: "changeIn",
            prevEffect: "elastic",
            prevSpeed: 250,
            prevEasing: "swing",
            prevMethod: "changeOut",
            helpers: {
                overlay: !0,
                title: !0
            },
            onCancel: f.noop,
            beforeLoad: f.noop,
            afterLoad: f.noop,
            beforeShow: f.noop,
            afterShow: f.noop,
            beforeChange: f.noop,
            beforeClose: f.noop,
            afterClose: f.noop
        },
        group: {},
        opts: {},
        previous: null,
        coming: null,
        current: null,
        isActive: !1,
        isOpen: !1,
        isOpened: !1,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
        player: {
            timer: null,
            isActive: !1
        },
        ajaxLoad: null,
        imgPreload: null,
        transitions: {},
        helpers: {},
        open: function(a, d) {
            if (a && (f.isPlainObject(d) || (d = {}), !1 !== b.close(!0))) return f.isArray(a) || (a = t(a) ? f(a).get() : [ a ]), 
            f.each(a, function(e, c) {
                var g, h, j, m, l, k = {};
                "object" === f.type(c) && (c.nodeType && (c = f(c)), t(c) ? (k = {
                    href: c.data("fancybox-href") || c.attr("href"),
                    title: c.data("fancybox-title") || c.attr("title"),
                    isDom: !0,
                    element: c
                }, f.metadata && f.extend(!0, k, c.metadata())) : k = c), g = d.href || k.href || (q(c) ? c : null), 
                h = d.title !== v ? d.title : k.title || "", m = (j = d.content || k.content) ? "html" : d.type || k.type, 
                !m && k.isDom && (m = c.data("fancybox-type"), m || (m = (m = c.prop("class").match(/fancybox\.(\w+)/)) ? m[1] : null)), 
                q(g) && (m || (b.isImage(g) ? m = "image" : b.isSWF(g) ? m = "swf" : "#" === g.charAt(0) ? m = "inline" : q(c) && (m = "html", 
                j = c)), "ajax" === m && (l = g.split(/\s+/, 2), g = l.shift(), l = l.shift())), 
                j || ("inline" === m ? g ? j = f(q(g) ? g.replace(/.*(?=#[^\s]+$)/, "") : g) : k.isDom && (j = c) : "html" === m ? j = g : !m && !g && k.isDom && (m = "inline", 
                j = c)), f.extend(k, {
                    href: g,
                    type: m,
                    content: j,
                    title: h,
                    selector: l
                }), a[e] = k;
            }), b.opts = f.extend(!0, {}, b.defaults, d), d.keys !== v && (b.opts.keys = !!d.keys && f.extend({}, b.defaults.keys, d.keys)), 
            b.group = a, b._start(b.opts.index);
        },
        cancel: function() {
            var a = b.coming;
            a && !1 !== b.trigger("onCancel") && (b.hideLoading(), b.ajaxLoad && b.ajaxLoad.abort(), 
            b.ajaxLoad = null, b.imgPreload && (b.imgPreload.onload = b.imgPreload.onerror = null), 
            a.wrap && a.wrap.stop(!0, !0).trigger("onReset").remove(), b.coming = null, b.current || b._afterZoomOut(a));
        },
        close: function(a) {
            b.cancel(), !1 !== b.trigger("beforeClose") && (b.unbindEvents(), b.isActive && (b.isOpen && !0 !== a ? (b.isOpen = b.isOpened = !1, 
            b.isClosing = !0, f(".fancybox-item, .fancybox-nav").remove(), b.wrap.stop(!0, !0).removeClass("fancybox-opened"), 
            b.transitions[b.current.closeMethod]()) : (f(".fancybox-wrap").stop(!0).trigger("onReset").remove(), 
            b._afterZoomOut())));
        },
        play: function(a) {
            var d = function() {
                clearTimeout(b.player.timer);
            }, e = function() {
                d(), b.current && b.player.isActive && (b.player.timer = setTimeout(b.next, b.current.playSpeed));
            }, c = function() {
                d(), p.unbind(".player"), b.player.isActive = !1, b.trigger("onPlayEnd");
            };
            !0 === a || !b.player.isActive && !1 !== a ? b.current && (b.current.loop || b.current.index < b.group.length - 1) && (b.player.isActive = !0, 
            p.bind({
                "onCancel.player beforeClose.player": c,
                "onUpdate.player": e,
                "beforeLoad.player": d
            }), e(), b.trigger("onPlayStart")) : c();
        },
        next: function(a) {
            var d = b.current;
            d && (q(a) || (a = d.direction.next), b.jumpto(d.index + 1, a, "next"));
        },
        prev: function(a) {
            var d = b.current;
            d && (q(a) || (a = d.direction.prev), b.jumpto(d.index - 1, a, "prev"));
        },
        jumpto: function(a, d, e) {
            var c = b.current;
            c && (a = l(a), b.direction = d || c.direction[a >= c.index ? "next" : "prev"], 
            b.router = e || "jumpto", c.loop && (0 > a && (a = c.group.length + a % c.group.length), 
            a %= c.group.length), c.group[a] !== v && (b.cancel(), b._start(a)));
        },
        reposition: function(a, d) {
            var k, e = b.current, c = e ? e.wrap : null;
            c && (k = b._getPosition(d), a && "scroll" === a.type ? (delete k.position, c.stop(!0, !0).animate(k, 200)) : (c.css(k), 
            e.pos = f.extend({}, e.dim, k)));
        },
        update: function(a) {
            var d = a && a.type, e = !d || "orientationchange" === d;
            e && (clearTimeout(B), B = null), b.isOpen && !B && (B = setTimeout(function() {
                var c = b.current;
                c && !b.isClosing && (b.wrap.removeClass("fancybox-tmp"), (e || "load" === d || "resize" === d && c.autoResize) && b._setDimension(), 
                "scroll" === d && c.canShrink || b.reposition(a), b.trigger("onUpdate"), B = null);
            }, e && !s ? 0 : 300));
        },
        toggle: function(a) {
            b.isOpen && (b.current.fitToView = "boolean" === f.type(a) ? a : !b.current.fitToView, 
            s && (b.wrap.removeAttr("style").addClass("fancybox-tmp"), b.trigger("onUpdate")), 
            b.update());
        },
        hideLoading: function() {
            p.unbind(".loading"), f("#fancybox-loading").remove();
        },
        showLoading: function() {
            var a, d;
            b.hideLoading(), a = f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body"), 
            p.bind("keydown.loading", function(a) {
                27 === (a.which || a.keyCode) && (a.preventDefault(), b.cancel());
            }), b.defaults.fixed || (d = b.getViewport(), a.css({
                position: "absolute",
                top: .5 * d.h + d.y,
                left: .5 * d.w + d.x
            }));
        },
        getViewport: function() {
            var a = b.current && b.current.locked || !1, d = {
                x: n.scrollLeft(),
                y: n.scrollTop()
            };
            return a ? (d.w = a[0].clientWidth, d.h = a[0].clientHeight) : (d.w = s && r.innerWidth ? r.innerWidth : n.width(), 
            d.h = s && r.innerHeight ? r.innerHeight : n.height()), d;
        },
        unbindEvents: function() {
            b.wrap && t(b.wrap) && b.wrap.unbind(".fb"), p.unbind(".fb"), n.unbind(".fb");
        },
        bindEvents: function() {
            var d, a = b.current;
            a && (n.bind("orientationchange.fb" + (s ? "" : " resize.fb") + (a.autoCenter && !a.locked ? " scroll.fb" : ""), b.update), 
            (d = a.keys) && p.bind("keydown.fb", function(e) {
                var c = e.which || e.keyCode, k = e.target || e.srcElement;
                return (27 !== c || !b.coming) && void (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && (!k || !k.type && !f(k).is("[contenteditable]")) && f.each(d, function(d, k) {
                    return 1 < a.group.length && k[c] !== v ? (b[d](k[c]), e.preventDefault(), !1) : -1 < f.inArray(c, k) ? (b[d](), 
                    e.preventDefault(), !1) : void 0;
                }));
            }), f.fn.mousewheel && a.mouseWheel && b.wrap.bind("mousewheel.fb", function(d, c, k, g) {
                for (var h = f(d.target || null), j = !1; h.length && !j && !h.is(".fancybox-skin") && !h.is(".fancybox-wrap"); ) j = h[0] && !(h[0].style.overflow && "hidden" === h[0].style.overflow) && (h[0].clientWidth && h[0].scrollWidth > h[0].clientWidth || h[0].clientHeight && h[0].scrollHeight > h[0].clientHeight), 
                h = f(h).parent();
                0 !== c && !j && 1 < b.group.length && !a.canShrink && (0 < g || 0 < k ? b.prev(0 < g ? "down" : "left") : (0 > g || 0 > k) && b.next(0 > g ? "up" : "right"), 
                d.preventDefault());
            }));
        },
        trigger: function(a, d) {
            var e, c = d || b.coming || b.current;
            if (c) {
                if (f.isFunction(c[a]) && (e = c[a].apply(c, Array.prototype.slice.call(arguments, 1))), 
                !1 === e) return !1;
                c.helpers && f.each(c.helpers, function(d, e) {
                    e && b.helpers[d] && f.isFunction(b.helpers[d][a]) && b.helpers[d][a](f.extend(!0, {}, b.helpers[d].defaults, e), c);
                }), p.trigger(a);
            }
        },
        isImage: function(a) {
            return q(a) && a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
        },
        isSWF: function(a) {
            return q(a) && a.match(/\.(swf)((\?|#).*)?$/i);
        },
        _start: function(a) {
            var e, c, d = {};
            if (a = l(a), e = b.group[a] || null, !e) return !1;
            if (d = f.extend(!0, {}, b.opts, e), e = d.margin, c = d.padding, "number" === f.type(e) && (d.margin = [ e, e, e, e ]), 
            "number" === f.type(c) && (d.padding = [ c, c, c, c ]), d.modal && f.extend(!0, d, {
                closeBtn: !1,
                closeClick: !1,
                nextClick: !1,
                arrows: !1,
                mouseWheel: !1,
                keys: null,
                helpers: {
                    overlay: {
                        closeClick: !1
                    }
                }
            }), d.autoSize && (d.autoWidth = d.autoHeight = !0), "auto" === d.width && (d.autoWidth = !0), 
            "auto" === d.height && (d.autoHeight = !0), d.group = b.group, d.index = a, b.coming = d, 
            !1 === b.trigger("beforeLoad")) b.coming = null; else {
                if (c = d.type, e = d.href, !c) return b.coming = null, !(!b.current || !b.router || "jumpto" === b.router) && (b.current.index = a, 
                b[b.router](b.direction));
                if (b.isActive = !0, "image" !== c && "swf" !== c || (d.autoHeight = d.autoWidth = !1, 
                d.scrolling = "visible"), "image" === c && (d.aspectRatio = !0), "iframe" === c && s && (d.scrolling = "scroll"), 
                d.wrap = f(d.tpl.wrap).addClass("fancybox-" + (s ? "mobile" : "desktop") + " fancybox-type-" + c + " fancybox-tmp " + d.wrapCSS).appendTo(d.parent || "body"), 
                f.extend(d, {
                    skin: f(".fancybox-skin", d.wrap),
                    outer: f(".fancybox-outer", d.wrap),
                    inner: f(".fancybox-inner", d.wrap)
                }), f.each([ "Top", "Right", "Bottom", "Left" ], function(a, b) {
                    d.skin.css("padding" + b, w(d.padding[a]));
                }), b.trigger("onReady"), "inline" === c || "html" === c) {
                    if (!d.content || !d.content.length) return b._error("content");
                } else if (!e) return b._error("href");
                "image" === c ? b._loadImage() : "ajax" === c ? b._loadAjax() : "iframe" === c ? b._loadIframe() : b._afterLoad();
            }
        },
        _error: function(a) {
            f.extend(b.coming, {
                type: "html",
                autoWidth: !0,
                autoHeight: !0,
                minWidth: 0,
                minHeight: 0,
                scrolling: "no",
                hasError: a,
                content: b.coming.tpl.error
            }), b._afterLoad();
        },
        _loadImage: function() {
            var a = b.imgPreload = new Image();
            a.onload = function() {
                this.onload = this.onerror = null, b.coming.width = this.width / b.opts.pixelRatio, 
                b.coming.height = this.height / b.opts.pixelRatio, b._afterLoad();
            }, a.onerror = function() {
                this.onload = this.onerror = null, b._error("image");
            }, a.src = b.coming.href, !0 !== a.complete && b.showLoading();
        },
        _loadAjax: function() {
            var a = b.coming;
            b.showLoading(), b.ajaxLoad = f.ajax(f.extend({}, a.ajax, {
                url: a.href,
                error: function(a, e) {
                    b.coming && "abort" !== e ? b._error("ajax", a) : b.hideLoading();
                },
                success: function(d, e) {
                    "success" === e && (a.content = d, b._afterLoad());
                }
            }));
        },
        _loadIframe: function() {
            var a = b.coming, d = f(a.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime())).attr("scrolling", s ? "auto" : a.iframe.scrolling).attr("src", a.href);
            f(a.wrap).bind("onReset", function() {
                try {
                    f(this).find("iframe").hide().attr("src", "//about:blank").end().empty();
                } catch (a) {}
            }), a.iframe.preload && (b.showLoading(), d.one("load", function() {
                f(this).data("ready", 1), s || f(this).bind("load.fb", b.update), f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show(), 
                b._afterLoad();
            })), a.content = d.appendTo(a.inner), a.iframe.preload || b._afterLoad();
        },
        _preloadImages: function() {
            var f, g, a = b.group, d = b.current, e = a.length, c = d.preload ? Math.min(d.preload, e - 1) : 0;
            for (g = 1; g <= c; g += 1) f = a[(d.index + g) % e], "image" === f.type && f.href && (new Image().src = f.href);
        },
        _afterLoad: function() {
            var e, c, k, g, h, a = b.coming, d = b.current;
            if (b.hideLoading(), a && !1 !== b.isActive) if (!1 === b.trigger("afterLoad", a, d)) a.wrap.stop(!0).trigger("onReset").remove(), 
            b.coming = null; else {
                switch (d && (b.trigger("beforeChange", d), d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove()), 
                b.unbindEvents(), e = a.content, c = a.type, k = a.scrolling, f.extend(b, {
                    wrap: a.wrap,
                    skin: a.skin,
                    outer: a.outer,
                    inner: a.inner,
                    current: a,
                    previous: d
                }), g = a.href, c) {
                  case "inline":
                  case "ajax":
                  case "html":
                    a.selector ? e = f("<div>").html(e).find(a.selector) : t(e) && (e.data("fancybox-placeholder") || e.data("fancybox-placeholder", f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()), 
                    e = e.show().detach(), a.wrap.bind("onReset", function() {
                        f(this).find(e).length && e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder", !1);
                    }));
                    break;

                  case "image":
                    e = a.tpl.image.replace("{href}", g);
                    break;

                  case "swf":
                    e = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + g + '"></param>', 
                    h = "", f.each(a.swf, function(a, b) {
                        e += '<param name="' + a + '" value="' + b + '"></param>', h += " " + a + '="' + b + '"';
                    }), e += '<embed src="' + g + '" type="application/x-shockwave-flash" width="100%" height="100%"' + h + "></embed></object>";
                }
                (!t(e) || !e.parent().is(a.inner)) && a.inner.append(e), b.trigger("beforeShow"), 
                a.inner.css("overflow", "yes" === k ? "scroll" : "no" === k ? "hidden" : k), b._setDimension(), 
                b.reposition(), b.isOpen = !1, b.coming = null, b.bindEvents(), b.isOpened ? d.prevMethod && b.transitions[d.prevMethod]() : f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove(), 
                b.transitions[b.isOpened ? a.nextMethod : a.openMethod](), b._preloadImages();
            }
        },
        _setDimension: function() {
            var v, z, t, C, A, F, B, D, H, a = b.getViewport(), d = 0, e = !1, c = !1, e = b.wrap, k = b.skin, g = b.inner, h = b.current, c = h.width, j = h.height, m = h.minWidth, u = h.minHeight, n = h.maxWidth, p = h.maxHeight, s = h.scrolling, q = h.scrollOutside ? h.scrollbarWidth : 0, x = h.margin, y = l(x[1] + x[3]), r = l(x[0] + x[2]);
            if (e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp"), x = l(k.outerWidth(!0) - k.width()), 
            v = l(k.outerHeight(!0) - k.height()), z = y + x, t = r + v, C = E(c) ? (a.w - z) * l(c) / 100 : c, 
            A = E(j) ? (a.h - t) * l(j) / 100 : j, "iframe" === h.type) {
                if (H = h.content, h.autoHeight && 1 === H.data("ready")) try {
                    H[0].contentWindow.document.location && (g.width(C).height(9999), F = H.contents().find("body"), 
                    q && F.css("overflow-x", "hidden"), A = F.outerHeight(!0));
                } catch (G) {}
            } else (h.autoWidth || h.autoHeight) && (g.addClass("fancybox-tmp"), h.autoWidth || g.width(C), 
            h.autoHeight || g.height(A), h.autoWidth && (C = g.width()), h.autoHeight && (A = g.height()), 
            g.removeClass("fancybox-tmp"));
            if (c = l(C), j = l(A), D = C / A, m = l(E(m) ? l(m, "w") - z : m), n = l(E(n) ? l(n, "w") - z : n), 
            u = l(E(u) ? l(u, "h") - t : u), p = l(E(p) ? l(p, "h") - t : p), F = n, B = p, 
            h.fitToView && (n = Math.min(a.w - z, n), p = Math.min(a.h - t, p)), z = a.w - y, 
            r = a.h - r, h.aspectRatio ? (c > n && (c = n, j = l(c / D)), j > p && (j = p, c = l(j * D)), 
            c < m && (c = m, j = l(c / D)), j < u && (j = u, c = l(j * D))) : (c = Math.max(m, Math.min(c, n)), 
            h.autoHeight && "iframe" !== h.type && (g.width(c), j = g.height()), j = Math.max(u, Math.min(j, p))), 
            h.fitToView) if (g.width(c).height(j), e.width(c + x), a = e.width(), y = e.height(), 
            h.aspectRatio) for (;(a > z || y > r) && c > m && j > u && !(19 < d++); ) j = Math.max(u, Math.min(p, j - 10)), 
            c = l(j * D), c < m && (c = m, j = l(c / D)), c > n && (c = n, j = l(c / D)), g.width(c).height(j), 
            e.width(c + x), a = e.width(), y = e.height(); else c = Math.max(m, Math.min(c, c - (a - z))), 
            j = Math.max(u, Math.min(j, j - (y - r)));
            q && "auto" === s && j < A && c + x + q < z && (c += q), g.width(c).height(j), e.width(c + x), 
            a = e.width(), y = e.height(), e = (a > z || y > r) && c > m && j > u, c = h.aspectRatio ? c < F && j < B && c < C && j < A : (c < F || j < B) && (c < C || j < A), 
            f.extend(h, {
                dim: {
                    width: w(a),
                    height: w(y)
                },
                origWidth: C,
                origHeight: A,
                canShrink: e,
                canExpand: c,
                wPadding: x,
                hPadding: v,
                wrapSpace: y - k.outerHeight(!0),
                skinSpace: k.height() - j
            }), !H && h.autoHeight && j > u && j < p && !c && g.height("auto");
        },
        _getPosition: function(a) {
            var d = b.current, e = b.getViewport(), c = d.margin, f = b.wrap.width() + c[1] + c[3], g = b.wrap.height() + c[0] + c[2], c = {
                position: "absolute",
                top: c[0],
                left: c[3]
            };
            return d.autoCenter && d.fixed && !a && g <= e.h && f <= e.w ? c.position = "fixed" : d.locked || (c.top += e.y, 
            c.left += e.x), c.top = w(Math.max(c.top, c.top + (e.h - g) * d.topRatio)), c.left = w(Math.max(c.left, c.left + (e.w - f) * d.leftRatio)), 
            c;
        },
        _afterZoomIn: function() {
            var a = b.current;
            a && (b.isOpen = b.isOpened = !0, b.wrap.css("overflow", "visible").addClass("fancybox-opened"), 
            b.update(), (a.closeClick || a.nextClick && 1 < b.group.length) && b.inner.css("cursor", "pointer").bind("click.fb", function(d) {
                !f(d.target).is("a") && !f(d.target).parent().is("a") && (d.preventDefault(), b[a.closeClick ? "close" : "next"]());
            }), a.closeBtn && f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb", function(a) {
                a.preventDefault(), b.close();
            }), a.arrows && 1 < b.group.length && ((a.loop || 0 < a.index) && f(a.tpl.prev).appendTo(b.outer).bind("click.fb", b.prev), 
            (a.loop || a.index < b.group.length - 1) && f(a.tpl.next).appendTo(b.outer).bind("click.fb", b.next)), 
            b.trigger("afterShow"), a.loop || a.index !== a.group.length - 1 ? b.opts.autoPlay && !b.player.isActive && (b.opts.autoPlay = !1, 
            b.play()) : b.play(!1));
        },
        _afterZoomOut: function(a) {
            a = a || b.current, f(".fancybox-wrap").trigger("onReset").remove(), f.extend(b, {
                group: {},
                opts: {},
                router: !1,
                current: null,
                isActive: !1,
                isOpened: !1,
                isOpen: !1,
                isClosing: !1,
                wrap: null,
                skin: null,
                outer: null,
                inner: null
            }), b.trigger("afterClose", a);
        }
    }), b.transitions = {
        getOrigPosition: function() {
            var a = b.current, d = a.element, e = a.orig, c = {}, f = 50, g = 50, h = a.hPadding, j = a.wPadding, m = b.getViewport();
            return !e && a.isDom && d.is(":visible") && (e = d.find("img:first"), e.length || (e = d)), 
            t(e) ? (c = e.offset(), e.is("img") && (f = e.outerWidth(), g = e.outerHeight())) : (c.top = m.y + (m.h - g) * a.topRatio, 
            c.left = m.x + (m.w - f) * a.leftRatio), ("fixed" === b.wrap.css("position") || a.locked) && (c.top -= m.y, 
            c.left -= m.x), c = {
                top: w(c.top - h * a.topRatio),
                left: w(c.left - j * a.leftRatio),
                width: w(f + j),
                height: w(g + h)
            };
        },
        step: function(a, d) {
            var e, c, f = d.prop;
            c = b.current;
            var g = c.wrapSpace, h = c.skinSpace;
            "width" !== f && "height" !== f || (e = d.end === d.start ? 1 : (a - d.start) / (d.end - d.start), 
            b.isClosing && (e = 1 - e), c = "width" === f ? c.wPadding : c.hPadding, c = a - c, 
            b.skin[f](l("width" === f ? c : c - g * e)), b.inner[f](l("width" === f ? c : c - g * e - h * e)));
        },
        zoomIn: function() {
            var a = b.current, d = a.pos, e = a.openEffect, c = "elastic" === e, k = f.extend({
                opacity: 1
            }, d);
            delete k.position, c ? (d = this.getOrigPosition(), a.openOpacity && (d.opacity = .1)) : "fade" === e && (d.opacity = .1), 
            b.wrap.css(d).animate(k, {
                duration: "none" === e ? 0 : a.openSpeed,
                easing: a.openEasing,
                step: c ? this.step : null,
                complete: b._afterZoomIn
            });
        },
        zoomOut: function() {
            var a = b.current, d = a.closeEffect, e = "elastic" === d, c = {
                opacity: .1
            };
            e && (c = this.getOrigPosition(), a.closeOpacity && (c.opacity = .1)), b.wrap.animate(c, {
                duration: "none" === d ? 0 : a.closeSpeed,
                easing: a.closeEasing,
                step: e ? this.step : null,
                complete: b._afterZoomOut
            });
        },
        changeIn: function() {
            var g, a = b.current, d = a.nextEffect, e = a.pos, c = {
                opacity: 1
            }, f = b.direction;
            e.opacity = .1, "elastic" === d && (g = "down" === f || "up" === f ? "top" : "left", 
            "down" === f || "right" === f ? (e[g] = w(l(e[g]) - 200), c[g] = "+=200px") : (e[g] = w(l(e[g]) + 200), 
            c[g] = "-=200px")), "none" === d ? b._afterZoomIn() : b.wrap.css(e).animate(c, {
                duration: a.nextSpeed,
                easing: a.nextEasing,
                complete: b._afterZoomIn
            });
        },
        changeOut: function() {
            var a = b.previous, d = a.prevEffect, e = {
                opacity: .1
            }, c = b.direction;
            "elastic" === d && (e["down" === c || "up" === c ? "top" : "left"] = ("up" === c || "left" === c ? "-" : "+") + "=200px"), 
            a.wrap.animate(e, {
                duration: "none" === d ? 0 : a.prevSpeed,
                easing: a.prevEasing,
                complete: function() {
                    f(this).trigger("onReset").remove();
                }
            });
        }
    }, b.helpers.overlay = {
        defaults: {
            closeClick: !0,
            speedOut: 200,
            showEarly: !0,
            css: {},
            locked: !s,
            fixed: !0
        },
        overlay: null,
        fixed: !1,
        el: f("html"),
        create: function(a) {
            a = f.extend({}, this.defaults, a), this.overlay && this.close(), this.overlay = f('<div class="fancybox-overlay"></div>').appendTo(b.coming ? b.coming.parent : a.parent), 
            this.fixed = !1, a.fixed && b.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), 
            this.fixed = !0);
        },
        open: function(a) {
            var d = this;
            a = f.extend({}, this.defaults, a), this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(a), 
            this.fixed || (n.bind("resize.overlay", f.proxy(this.update, this)), this.update()), 
            a.closeClick && this.overlay.bind("click.overlay", function(a) {
                if (f(a.target).hasClass("fancybox-overlay")) return b.isActive ? b.close() : d.close(), 
                !1;
            }), this.overlay.css(a.css).show();
        },
        close: function() {
            var a, b;
            n.unbind("resize.overlay"), this.el.hasClass("fancybox-lock") && (f(".fancybox-margin").removeClass("fancybox-margin"), 
            a = n.scrollTop(), b = n.scrollLeft(), this.el.removeClass("fancybox-lock"), n.scrollTop(a).scrollLeft(b)), 
            f(".fancybox-overlay").remove().hide(), f.extend(this, {
                overlay: null,
                fixed: !1
            });
        },
        update: function() {
            var b, a = "100%";
            this.overlay.width(a).height("100%"), I ? (b = Math.max(G.documentElement.offsetWidth, G.body.offsetWidth), 
            p.width() > b && (a = p.width())) : p.width() > n.width() && (a = p.width()), this.overlay.width(a).height(p.height());
        },
        onReady: function(a, b) {
            var e = this.overlay;
            f(".fancybox-overlay").stop(!0, !0), e || this.create(a), a.locked && this.fixed && b.fixed && (e || (this.margin = p.height() > n.height() && f("html").css("margin-right").replace("px", "")), 
            b.locked = this.overlay.append(b.wrap), b.fixed = !1), !0 === a.showEarly && this.beforeShow.apply(this, arguments);
        },
        beforeShow: function(a, b) {
            var e, c;
            b.locked && (!1 !== this.margin && (f("*").filter(function() {
                return "fixed" === f(this).css("position") && !f(this).hasClass("fancybox-overlay") && !f(this).hasClass("fancybox-wrap");
            }).addClass("fancybox-margin"), this.el.addClass("fancybox-margin")), e = n.scrollTop(), 
            c = n.scrollLeft(), this.el.addClass("fancybox-lock"), n.scrollTop(e).scrollLeft(c)), 
            this.open(a);
        },
        onUpdate: function() {
            this.fixed || this.update();
        },
        afterClose: function(a) {
            this.overlay && !b.coming && this.overlay.fadeOut(a.speedOut, f.proxy(this.close, this));
        }
    }, b.helpers.title = {
        defaults: {
            type: "float",
            position: "bottom"
        },
        beforeShow: function(a) {
            var d = b.current, e = d.title, c = a.type;
            if (f.isFunction(e) && (e = e.call(d.element, d)), q(e) && "" !== f.trim(e)) {
                switch (d = f('<div class="fancybox-title fancybox-title-' + c + '-wrap">' + e + "</div>"), 
                c) {
                  case "inside":
                    c = b.skin;
                    break;

                  case "outside":
                    c = b.wrap;
                    break;

                  case "over":
                    c = b.inner;
                    break;

                  default:
                    c = b.skin, d.appendTo("body"), I && d.width(d.width()), d.wrapInner('<span class="child"></span>'), 
                    b.current.margin[2] += Math.abs(l(d.css("margin-bottom")));
                }
                d["top" === a.position ? "prependTo" : "appendTo"](c);
            }
        }
    }, f.fn.fancybox = function(a) {
        var d, e = f(this), c = this.selector || "", k = function(g) {
            var k, l, h = f(this).blur(), j = d;
            !g.ctrlKey && !g.altKey && !g.shiftKey && !g.metaKey && !h.is(".fancybox-wrap") && (k = a.groupAttr || "data-fancybox-group", 
            l = h.attr(k), l || (k = "rel", l = h.get(0)[k]), l && "" !== l && "nofollow" !== l && (h = c.length ? f(c) : e, 
            h = h.filter("[" + k + '="' + l + '"]'), j = h.index(this)), a.index = j, !1 !== b.open(h, a) && g.preventDefault());
        };
        return a = a || {}, d = a.index || 0, c && !1 !== a.live ? p.undelegate(c, "click.fb-start").delegate(c + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", k) : e.unbind("click.fb-start").bind("click.fb-start", k), 
        this.filter("[data-fancybox-start=1]").trigger("click"), this;
    }, p.ready(function() {
        var a, d;
        if (f.scrollbarWidth === v && (f.scrollbarWidth = function() {
            var a = f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"), b = a.children(), b = b.innerWidth() - b.height(99).innerWidth();
            return a.remove(), b;
        }), f.support.fixedPosition === v) {
            a = f.support, d = f('<div style="position:fixed;top:20px;"></div>').appendTo("body");
            var e = 20 === d[0].offsetTop || 15 === d[0].offsetTop;
            d.remove(), a.fixedPosition = e;
        }
        f.extend(b.defaults, {
            scrollbarWidth: f.scrollbarWidth(),
            fixed: f.support.fixedPosition,
            parent: f("body")
        }), a = f(r).width(), J.addClass("fancybox-lock-test"), d = f(r).width(), J.removeClass("fancybox-lock-test"), 
        f("<style type='text/css'>.fancybox-margin{margin-right:" + (d - a) + "px;}</style>").appendTo("head");
    });
}(window, document, jQuery), /**
* App Bootstrapping
*/
$(document.documentElement).removeClass("no-js"), function($) {
    "use strict";
    $(document).ready(function() {
        var $page = $("body"), application = new Tc.Application($page);
        application.registerModules(), application.registerModule($page, "PageController"), 
        application.start(), console.log("Terrific App started");
    });
}(Tc.$), function($) {
    /**
	 * PageController module implementation.
	 *
	 * @author
	 * @namespace Tc.Module
	 * @class PageController
	 * @extends Tc.Module
	 */
    Tc.Module.PageController = Tc.Module.extend({
        /**
		 * Initializes the PageController module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId);
        },
        /**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
        on: function(callback) {
            callback(), // Enquire JS Example
            enquire.register("screen and (max-width:768px)", {
                match: function() {
                    console.log("Page Controller: Matched Media Query");
                },
                unmatch: function() {
                    console.log("Page Controller: Unmatched Media Query");
                }
            }), // Scroll To Anchor
            $("a[href*=#]").on("click", function(event) {
                event.preventDefault();
                var href = $.attr(this, "href");
                $("html,body").animate({
                    scrollTop: $(this.hash).offset().top
                }, 500, function() {
                    window.location.hash = href;
                });
            });
        },
        /**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
        after: function() {}
    });
}(Tc.$), function($) {
    /**
	 * Article module implementation.
	 *
	 * @author sbueschi
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
    Tc.Module.Article = Tc.Module.extend({
        /**
		 * Initializes the Article module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId), this.sandbox.subscribe("search", this);
        },
        /**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
        on: function(callback) {
            $(".js-lightbox").fancybox({
                openEffect: "elastic",
                closeEffect: "elastic"
            }), callback();
        },
        /**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
        after: function() {}
    });
}(Tc.$), function($) {
    /**
	 * Example module implementation.
	 *
	 * @author Someone
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
    Tc.Module.Example = Tc.Module.extend({
        /**
		 * Initializes the Example module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId);
        },
        /**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
        on: function(callback) {
            console.log("Example Module loaded"), callback();
        },
        /**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
        after: function() {}
    });
}(Tc.$), function($) {
    /**
	 * Header module implementation.
	 *
	 * @author sharte
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
    Tc.Module.Header = Tc.Module.extend({
        /**
		 * Initializes the Header module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId), this.sandbox.subscribe("search", this);
        },
        /**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
        on: function(callback) {
            $(".js-menu-button").on("click", function(ev) {
                $this = $(this), $this.find(".js-lines").toggleClass("is-close"), $(".js-menu").slideToggle();
            }), callback();
        },
        /**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
        after: function() {}
    });
}(Tc.$), function($) {
    /**
	 * Search module implementation.
	 *
	 * @author sharte
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
    Tc.Module.Search = Tc.Module.extend({
        /**
		 * Initializes the Search module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId), this.sandbox.subscribe("search", this);
        },
        /**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
        on: function(callback) {
            callback();
        },
        onToggle: function(ev) {
            this.$ctx.toggleClass("active"), $(window).width() > 768 && this.$ctx.hasClass("active") && $(".js-search-field", this.$ctx).focus();
        },
        /**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
        after: function() {}
    });
}(Tc.$), function($) {
    /**
	 * Stage module implementation.
	 *
	 * @author sharte
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
    Tc.Module.Stage = Tc.Module.extend({
        /**
		 * Initializes the Stage module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId), this.sandbox.subscribe("search", this);
        },
        /**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
        on: function(callback) {
            var self = this, $searchToggle = $(".js-toggle-search", this.$ctx);
            $searchToggle.on("click", function(ev) {
                ev.preventDefault(), self.fire("toggle", {}), $searchToggle.toggleClass("active");
            }), callback();
        },
        /**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
        after: function() {}
    });
}(Tc.$), function($) {
    /**
	 * Teaser module implementation.
	 *
	 * @author sharte
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
    Tc.Module.Teaser = Tc.Module.extend({
        /**
		 * Initializes the Teaser module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId);
        },
        /**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
        on: function(callback) {
            callback();
        },
        /**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
        after: function() {}
    });
}(Tc.$);
//# sourceMappingURL=scripts.js.map