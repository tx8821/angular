'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var di_1 = require('angular2/src/core/di');
var animation_builder_1 = require('angular2/src/animate/animation_builder');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var shared_styles_host_1 = require('./shared_styles_host');
var event_manager_1 = require('./events/event_manager');
var dom_tokens_1 = require('./dom_tokens');
var metadata_1 = require('angular2/src/core/metadata');
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var util_1 = require('./util');
var NAMESPACE_URIS = lang_1.CONST_EXPR({ 'xlink': 'http://www.w3.org/1999/xlink', 'svg': 'http://www.w3.org/2000/svg' });
var TEMPLATE_COMMENT_TEXT = 'template bindings={}';
var TEMPLATE_BINDINGS_EXP = /^template bindings=(.*)$/g;
var DomRootRenderer = (function () {
    function DomRootRenderer(document, eventManager, sharedStylesHost, animate) {
        this.document = document;
        this.eventManager = eventManager;
        this.sharedStylesHost = sharedStylesHost;
        this.animate = animate;
        this._registeredComponents = new Map();
    }
    DomRootRenderer.prototype.renderComponent = function (componentProto) {
        var renderer = this._registeredComponents.get(componentProto.id);
        if (lang_1.isBlank(renderer)) {
            renderer = new DomRenderer(this, componentProto);
            this._registeredComponents.set(componentProto.id, renderer);
        }
        return renderer;
    };
    return DomRootRenderer;
}());
exports.DomRootRenderer = DomRootRenderer;
var DomRootRenderer_ = (function (_super) {
    __extends(DomRootRenderer_, _super);
    function DomRootRenderer_(_document, _eventManager, sharedStylesHost, animate) {
        _super.call(this, _document, _eventManager, sharedStylesHost, animate);
    }
    DomRootRenderer_ = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject(dom_tokens_1.DOCUMENT)), 
        __metadata('design:paramtypes', [Object, event_manager_1.EventManager, shared_styles_host_1.DomSharedStylesHost, animation_builder_1.AnimationBuilder])
    ], DomRootRenderer_);
    return DomRootRenderer_;
}(DomRootRenderer));
exports.DomRootRenderer_ = DomRootRenderer_;
var DomRenderer = (function () {
    function DomRenderer(_rootRenderer, componentProto) {
        this._rootRenderer = _rootRenderer;
        this.componentProto = componentProto;
        this._styles = _flattenStyles(componentProto.id, componentProto.styles, []);
        if (componentProto.encapsulation !== metadata_1.ViewEncapsulation.Native) {
            this._rootRenderer.sharedStylesHost.addStyles(this._styles);
        }
        if (this.componentProto.encapsulation === metadata_1.ViewEncapsulation.Emulated) {
            this._contentAttr = _shimContentAttribute(componentProto.id);
            this._hostAttr = _shimHostAttribute(componentProto.id);
        }
        else {
            this._contentAttr = null;
            this._hostAttr = null;
        }
    }
    DomRenderer.prototype.selectRootElement = function (selector, debugInfo) {
        var el = dom_adapter_1.DOM.querySelector(this._rootRenderer.document, selector);
        if (lang_1.isBlank(el)) {
            throw new exceptions_1.BaseException("The selector \"" + selector + "\" did not match any elements");
        }
        dom_adapter_1.DOM.clearNodes(el);
        return el;
    };
    DomRenderer.prototype.createElement = function (parent, name, debugInfo) {
        var nsAndName = splitNamespace(name);
        var el = lang_1.isPresent(nsAndName[0]) ?
            dom_adapter_1.DOM.createElementNS(NAMESPACE_URIS[nsAndName[0]], nsAndName[1]) :
            dom_adapter_1.DOM.createElement(nsAndName[1]);
        if (lang_1.isPresent(this._contentAttr)) {
            dom_adapter_1.DOM.setAttribute(el, this._contentAttr, '');
        }
        if (lang_1.isPresent(parent)) {
            dom_adapter_1.DOM.appendChild(parent, el);
        }
        return el;
    };
    DomRenderer.prototype.createViewRoot = function (hostElement) {
        var nodesParent;
        if (this.componentProto.encapsulation === metadata_1.ViewEncapsulation.Native) {
            nodesParent = dom_adapter_1.DOM.createShadowRoot(hostElement);
            this._rootRenderer.sharedStylesHost.addHost(nodesParent);
            for (var i = 0; i < this._styles.length; i++) {
                dom_adapter_1.DOM.appendChild(nodesParent, dom_adapter_1.DOM.createStyleElement(this._styles[i]));
            }
        }
        else {
            if (lang_1.isPresent(this._hostAttr)) {
                dom_adapter_1.DOM.setAttribute(hostElement, this._hostAttr, '');
            }
            nodesParent = hostElement;
        }
        return nodesParent;
    };
    DomRenderer.prototype.createTemplateAnchor = function (parentElement, debugInfo) {
        var comment = dom_adapter_1.DOM.createComment(TEMPLATE_COMMENT_TEXT);
        if (lang_1.isPresent(parentElement)) {
            dom_adapter_1.DOM.appendChild(parentElement, comment);
        }
        return comment;
    };
    DomRenderer.prototype.createText = function (parentElement, value, debugInfo) {
        var node = dom_adapter_1.DOM.createTextNode(value);
        if (lang_1.isPresent(parentElement)) {
            dom_adapter_1.DOM.appendChild(parentElement, node);
        }
        return node;
    };
    DomRenderer.prototype.projectNodes = function (parentElement, nodes) {
        if (lang_1.isBlank(parentElement))
            return;
        appendNodes(parentElement, nodes);
    };
    DomRenderer.prototype.attachViewAfter = function (node, viewRootNodes) {
        moveNodesAfterSibling(node, viewRootNodes);
        for (var i = 0; i < viewRootNodes.length; i++)
            this.animateNodeEnter(viewRootNodes[i]);
    };
    DomRenderer.prototype.detachView = function (viewRootNodes) {
        for (var i = 0; i < viewRootNodes.length; i++) {
            var node = viewRootNodes[i];
            dom_adapter_1.DOM.remove(node);
            this.animateNodeLeave(node);
        }
    };
    DomRenderer.prototype.destroyView = function (hostElement, viewAllNodes) {
        if (this.componentProto.encapsulation === metadata_1.ViewEncapsulation.Native && lang_1.isPresent(hostElement)) {
            this._rootRenderer.sharedStylesHost.removeHost(dom_adapter_1.DOM.getShadowRoot(hostElement));
        }
    };
    DomRenderer.prototype.listen = function (renderElement, name, callback) {
        return this._rootRenderer.eventManager.addEventListener(renderElement, name, decoratePreventDefault(callback));
    };
    DomRenderer.prototype.listenGlobal = function (target, name, callback) {
        return this._rootRenderer.eventManager.addGlobalEventListener(target, name, decoratePreventDefault(callback));
    };
    DomRenderer.prototype.setElementProperty = function (renderElement, propertyName, propertyValue) {
        dom_adapter_1.DOM.setProperty(renderElement, propertyName, propertyValue);
    };
    DomRenderer.prototype.setElementAttribute = function (renderElement, attributeName, attributeValue) {
        var attrNs;
        var nsAndName = splitNamespace(attributeName);
        if (lang_1.isPresent(nsAndName[0])) {
            attributeName = nsAndName[0] + ':' + nsAndName[1];
            attrNs = NAMESPACE_URIS[nsAndName[0]];
        }
        if (lang_1.isPresent(attributeValue)) {
            if (lang_1.isPresent(attrNs)) {
                dom_adapter_1.DOM.setAttributeNS(renderElement, attrNs, attributeName, attributeValue);
            }
            else {
                dom_adapter_1.DOM.setAttribute(renderElement, attributeName, attributeValue);
            }
        }
        else {
            if (lang_1.isPresent(attrNs)) {
                dom_adapter_1.DOM.removeAttributeNS(renderElement, attrNs, nsAndName[1]);
            }
            else {
                dom_adapter_1.DOM.removeAttribute(renderElement, attributeName);
            }
        }
    };
    DomRenderer.prototype.setBindingDebugInfo = function (renderElement, propertyName, propertyValue) {
        var dashCasedPropertyName = util_1.camelCaseToDashCase(propertyName);
        if (dom_adapter_1.DOM.isCommentNode(renderElement)) {
            var existingBindings = lang_1.RegExpWrapper.firstMatch(TEMPLATE_BINDINGS_EXP, lang_1.StringWrapper.replaceAll(dom_adapter_1.DOM.getText(renderElement), /\n/g, ''));
            var parsedBindings = lang_1.Json.parse(existingBindings[1]);
            parsedBindings[dashCasedPropertyName] = propertyValue;
            dom_adapter_1.DOM.setText(renderElement, lang_1.StringWrapper.replace(TEMPLATE_COMMENT_TEXT, '{}', lang_1.Json.stringify(parsedBindings)));
        }
        else {
            this.setElementAttribute(renderElement, propertyName, propertyValue);
        }
    };
    DomRenderer.prototype.setElementClass = function (renderElement, className, isAdd) {
        if (isAdd) {
            dom_adapter_1.DOM.addClass(renderElement, className);
        }
        else {
            dom_adapter_1.DOM.removeClass(renderElement, className);
        }
    };
    DomRenderer.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
        if (lang_1.isPresent(styleValue)) {
            dom_adapter_1.DOM.setStyle(renderElement, styleName, lang_1.stringify(styleValue));
        }
        else {
            dom_adapter_1.DOM.removeStyle(renderElement, styleName);
        }
    };
    DomRenderer.prototype.invokeElementMethod = function (renderElement, methodName, args) {
        dom_adapter_1.DOM.invoke(renderElement, methodName, args);
    };
    DomRenderer.prototype.setText = function (renderNode, text) { dom_adapter_1.DOM.setText(renderNode, text); };
    /**
     * Performs animations if necessary
     * @param node
     */
    DomRenderer.prototype.animateNodeEnter = function (node) {
        if (dom_adapter_1.DOM.isElementNode(node) && dom_adapter_1.DOM.hasClass(node, 'ng-animate')) {
            dom_adapter_1.DOM.addClass(node, 'ng-enter');
            this._rootRenderer.animate.css()
                .addAnimationClass('ng-enter-active')
                .start(node)
                .onComplete(function () { dom_adapter_1.DOM.removeClass(node, 'ng-enter'); });
        }
    };
    /**
     * If animations are necessary, performs animations then removes the element; otherwise, it just
     * removes the element.
     * @param node
     */
    DomRenderer.prototype.animateNodeLeave = function (node) {
        if (dom_adapter_1.DOM.isElementNode(node) && dom_adapter_1.DOM.hasClass(node, 'ng-animate')) {
            dom_adapter_1.DOM.addClass(node, 'ng-leave');
            this._rootRenderer.animate.css()
                .addAnimationClass('ng-leave-active')
                .start(node)
                .onComplete(function () {
                dom_adapter_1.DOM.removeClass(node, 'ng-leave');
                dom_adapter_1.DOM.remove(node);
            });
        }
        else {
            dom_adapter_1.DOM.remove(node);
        }
    };
    return DomRenderer;
}());
exports.DomRenderer = DomRenderer;
function moveNodesAfterSibling(sibling, nodes) {
    var parent = dom_adapter_1.DOM.parentElement(sibling);
    if (nodes.length > 0 && lang_1.isPresent(parent)) {
        var nextSibling = dom_adapter_1.DOM.nextSibling(sibling);
        if (lang_1.isPresent(nextSibling)) {
            for (var i = 0; i < nodes.length; i++) {
                dom_adapter_1.DOM.insertBefore(nextSibling, nodes[i]);
            }
        }
        else {
            for (var i = 0; i < nodes.length; i++) {
                dom_adapter_1.DOM.appendChild(parent, nodes[i]);
            }
        }
    }
}
function appendNodes(parent, nodes) {
    for (var i = 0; i < nodes.length; i++) {
        dom_adapter_1.DOM.appendChild(parent, nodes[i]);
    }
}
function decoratePreventDefault(eventHandler) {
    return function (event) {
        var allowDefaultBehavior = eventHandler(event);
        if (allowDefaultBehavior === false) {
            // TODO(tbosch): move preventDefault into event plugins...
            dom_adapter_1.DOM.preventDefault(event);
        }
    };
}
var COMPONENT_REGEX = /%COMP%/g;
exports.COMPONENT_VARIABLE = '%COMP%';
exports.HOST_ATTR = "_nghost-" + exports.COMPONENT_VARIABLE;
exports.CONTENT_ATTR = "_ngcontent-" + exports.COMPONENT_VARIABLE;
function _shimContentAttribute(componentShortId) {
    return lang_1.StringWrapper.replaceAll(exports.CONTENT_ATTR, COMPONENT_REGEX, componentShortId);
}
function _shimHostAttribute(componentShortId) {
    return lang_1.StringWrapper.replaceAll(exports.HOST_ATTR, COMPONENT_REGEX, componentShortId);
}
function _flattenStyles(compId, styles, target) {
    for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        if (lang_1.isArray(style)) {
            _flattenStyles(compId, style, target);
        }
        else {
            style = lang_1.StringWrapper.replaceAll(style, COMPONENT_REGEX, compId);
            target.push(style);
        }
    }
    return target;
}
var NS_PREFIX_RE = /^@([^:]+):(.+)/g;
function splitNamespace(name) {
    if (name[0] != '@') {
        return [null, name];
    }
    var match = lang_1.RegExpWrapper.firstMatch(NS_PREFIX_RE, name);
    return [match[1], match[2]];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX3JlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1VVGE3enpiTi50bXAvYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUJBQThDLHNCQUFzQixDQUFDLENBQUE7QUFDckUsa0NBQStCLHdDQUF3QyxDQUFDLENBQUE7QUFDeEUscUJBU08sMEJBQTBCLENBQUMsQ0FBQTtBQUVsQywyQkFBOEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUMvRSxtQ0FBa0Msc0JBQXNCLENBQUMsQ0FBQTtBQVN6RCw4QkFBMkIsd0JBQXdCLENBQUMsQ0FBQTtBQUVwRCwyQkFBdUIsY0FBYyxDQUFDLENBQUE7QUFDdEMseUJBQWdDLDRCQUE0QixDQUFDLENBQUE7QUFDN0QsNEJBQWtCLHVDQUF1QyxDQUFDLENBQUE7QUFDMUQscUJBQWtDLFFBQVEsQ0FBQyxDQUFBO0FBRTNDLElBQU0sY0FBYyxHQUNoQixpQkFBVSxDQUFDLEVBQUMsT0FBTyxFQUFFLDhCQUE4QixFQUFFLEtBQUssRUFBRSw0QkFBNEIsRUFBQyxDQUFDLENBQUM7QUFDL0YsSUFBTSxxQkFBcUIsR0FBRyxzQkFBc0IsQ0FBQztBQUNyRCxJQUFJLHFCQUFxQixHQUFHLDJCQUEyQixDQUFDO0FBRXhEO0lBR0UseUJBQW1CLFFBQWEsRUFBUyxZQUEwQixFQUNoRCxnQkFBcUMsRUFBUyxPQUF5QjtRQUR2RSxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDaEQscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFxQjtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBSGxGLDBCQUFxQixHQUE2QixJQUFJLEdBQUcsRUFBdUIsQ0FBQztJQUdJLENBQUM7SUFFOUYseUNBQWUsR0FBZixVQUFnQixjQUFtQztRQUNqRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqRSxFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLFFBQVEsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFkRCxJQWNDO0FBZHFCLHVCQUFlLGtCQWNwQyxDQUFBO0FBR0Q7SUFBc0Msb0NBQWU7SUFDbkQsMEJBQThCLFNBQWMsRUFBRSxhQUEyQixFQUM3RCxnQkFBcUMsRUFBRSxPQUF5QjtRQUMxRSxrQkFBTSxTQUFTLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFMSDtRQUFDLGVBQVUsRUFBRTttQkFFRSxXQUFNLENBQUMscUJBQVEsQ0FBQzs7d0JBRmxCO0lBTWIsdUJBQUM7QUFBRCxDQUFDLEFBTEQsQ0FBc0MsZUFBZSxHQUtwRDtBQUxZLHdCQUFnQixtQkFLNUIsQ0FBQTtBQUVEO0lBS0UscUJBQW9CLGFBQThCLEVBQVUsY0FBbUM7UUFBM0Usa0JBQWEsR0FBYixhQUFhLENBQWlCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQXFCO1FBQzdGLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM1RSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsYUFBYSxLQUFLLDRCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsS0FBSyw0QkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxZQUFZLEdBQUcscUJBQXFCLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBRUQsdUNBQWlCLEdBQWpCLFVBQWtCLFFBQWdCLEVBQUUsU0FBMEI7UUFDNUQsSUFBSSxFQUFFLEdBQUcsaUJBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEUsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLElBQUksMEJBQWEsQ0FBQyxvQkFBaUIsUUFBUSxrQ0FBOEIsQ0FBQyxDQUFDO1FBQ25GLENBQUM7UUFDRCxpQkFBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELG1DQUFhLEdBQWIsVUFBYyxNQUFlLEVBQUUsSUFBWSxFQUFFLFNBQTBCO1FBQ3JFLElBQUksU0FBUyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLEVBQUUsR0FBRyxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixpQkFBRyxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9ELGlCQUFHLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxpQkFBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsaUJBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELG9DQUFjLEdBQWQsVUFBZSxXQUFnQjtRQUM3QixJQUFJLFdBQVcsQ0FBQztRQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsS0FBSyw0QkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ25FLFdBQVcsR0FBRyxpQkFBRyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDN0MsaUJBQUcsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLGlCQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEUsQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsaUJBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDcEQsQ0FBQztZQUNELFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDNUIsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELDBDQUFvQixHQUFwQixVQUFxQixhQUFrQixFQUFFLFNBQTBCO1FBQ2pFLElBQUksT0FBTyxHQUFHLGlCQUFHLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDdkQsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsaUJBQUcsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxnQ0FBVSxHQUFWLFVBQVcsYUFBa0IsRUFBRSxLQUFhLEVBQUUsU0FBMEI7UUFDdEUsSUFBSSxJQUFJLEdBQUcsaUJBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsaUJBQUcsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGtDQUFZLEdBQVosVUFBYSxhQUFrQixFQUFFLEtBQVk7UUFDM0MsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ25DLFdBQVcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELHFDQUFlLEdBQWYsVUFBZ0IsSUFBUyxFQUFFLGFBQW9CO1FBQzdDLHFCQUFxQixDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMzQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFRCxnQ0FBVSxHQUFWLFVBQVcsYUFBb0I7UUFDN0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUMsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLGlCQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztJQUVELGlDQUFXLEdBQVgsVUFBWSxXQUFnQixFQUFFLFlBQW1CO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxLQUFLLDRCQUFpQixDQUFDLE1BQU0sSUFBSSxnQkFBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RixJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxpQkFBRyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLENBQUM7SUFDSCxDQUFDO0lBRUQsNEJBQU0sR0FBTixVQUFPLGFBQWtCLEVBQUUsSUFBWSxFQUFFLFFBQWtCO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUNuQixzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFRCxrQ0FBWSxHQUFaLFVBQWEsTUFBYyxFQUFFLElBQVksRUFBRSxRQUFrQjtRQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsTUFBTSxFQUFFLElBQUksRUFDWixzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRCx3Q0FBa0IsR0FBbEIsVUFBbUIsYUFBa0IsRUFBRSxZQUFvQixFQUFFLGFBQWtCO1FBQzdFLGlCQUFHLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELHlDQUFtQixHQUFuQixVQUFvQixhQUFrQixFQUFFLGFBQXFCLEVBQUUsY0FBc0I7UUFDbkYsSUFBSSxNQUFNLENBQUM7UUFDWCxJQUFJLFNBQVMsR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsYUFBYSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixpQkFBRyxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUMzRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04saUJBQUcsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNqRSxDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLGlCQUFHLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04saUJBQUcsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ3BELENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELHlDQUFtQixHQUFuQixVQUFvQixhQUFrQixFQUFFLFlBQW9CLEVBQUUsYUFBcUI7UUFDakYsSUFBSSxxQkFBcUIsR0FBRywwQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM5RCxFQUFFLENBQUMsQ0FBQyxpQkFBRyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxnQkFBZ0IsR0FBRyxvQkFBYSxDQUFDLFVBQVUsQ0FDM0MscUJBQXFCLEVBQUUsb0JBQWEsQ0FBQyxVQUFVLENBQUMsaUJBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUYsSUFBSSxjQUFjLEdBQUcsV0FBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLGFBQWEsQ0FBQztZQUN0RCxpQkFBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsSUFBSSxFQUMzQixXQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN2RSxDQUFDO0lBQ0gsQ0FBQztJQUVELHFDQUFlLEdBQWYsVUFBZ0IsYUFBa0IsRUFBRSxTQUFpQixFQUFFLEtBQWM7UUFDbkUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNWLGlCQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixpQkFBRyxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUMsQ0FBQztJQUNILENBQUM7SUFFRCxxQ0FBZSxHQUFmLFVBQWdCLGFBQWtCLEVBQUUsU0FBaUIsRUFBRSxVQUFrQjtRQUN2RSxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixpQkFBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLGdCQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixpQkFBRyxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUMsQ0FBQztJQUNILENBQUM7SUFFRCx5Q0FBbUIsR0FBbkIsVUFBb0IsYUFBa0IsRUFBRSxVQUFrQixFQUFFLElBQVc7UUFDckUsaUJBQUcsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsNkJBQU8sR0FBUCxVQUFRLFVBQWUsRUFBRSxJQUFZLElBQVUsaUJBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUvRTs7O09BR0c7SUFDSCxzQ0FBZ0IsR0FBaEIsVUFBaUIsSUFBVTtRQUN6QixFQUFFLENBQUMsQ0FBQyxpQkFBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLGlCQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7aUJBQzNCLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDO2lCQUNwQyxLQUFLLENBQWMsSUFBSSxDQUFDO2lCQUN4QixVQUFVLENBQUMsY0FBUSxpQkFBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDO0lBQ0gsQ0FBQztJQUdEOzs7O09BSUc7SUFDSCxzQ0FBZ0IsR0FBaEIsVUFBaUIsSUFBVTtRQUN6QixFQUFFLENBQUMsQ0FBQyxpQkFBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLGlCQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7aUJBQzNCLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDO2lCQUNwQyxLQUFLLENBQWMsSUFBSSxDQUFDO2lCQUN4QixVQUFVLENBQUM7Z0JBQ1YsaUJBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUNsQyxpQkFBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FBQztRQUNULENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLGlCQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25CLENBQUM7SUFDSCxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBN01ELElBNk1DO0FBN01ZLG1CQUFXLGNBNk12QixDQUFBO0FBRUQsK0JBQStCLE9BQU8sRUFBRSxLQUFLO0lBQzNDLElBQUksTUFBTSxHQUFHLGlCQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLGdCQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksV0FBVyxHQUFHLGlCQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN0QyxpQkFBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN0QyxpQkFBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVELHFCQUFxQixNQUFNLEVBQUUsS0FBSztJQUNoQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN0QyxpQkFBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztBQUNILENBQUM7QUFFRCxnQ0FBZ0MsWUFBc0I7SUFDcEQsTUFBTSxDQUFDLFVBQUMsS0FBSztRQUNYLElBQUksb0JBQW9CLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbkMsMERBQTBEO1lBQzFELGlCQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsSUFBSSxlQUFlLEdBQUcsU0FBUyxDQUFDO0FBQ25CLDBCQUFrQixHQUFHLFFBQVEsQ0FBQztBQUM5QixpQkFBUyxHQUFHLGFBQVcsMEJBQW9CLENBQUM7QUFDNUMsb0JBQVksR0FBRyxnQkFBYywwQkFBb0IsQ0FBQztBQUUvRCwrQkFBK0IsZ0JBQXdCO0lBQ3JELE1BQU0sQ0FBQyxvQkFBYSxDQUFDLFVBQVUsQ0FBQyxvQkFBWSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ25GLENBQUM7QUFFRCw0QkFBNEIsZ0JBQXdCO0lBQ2xELE1BQU0sQ0FBQyxvQkFBYSxDQUFDLFVBQVUsQ0FBQyxpQkFBUyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFFRCx3QkFBd0IsTUFBYyxFQUFFLE1BQTBCLEVBQUUsTUFBZ0I7SUFDbEYsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDdkMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sS0FBSyxHQUFHLG9CQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELElBQUksWUFBWSxHQUFHLGlCQUFpQixDQUFDO0FBRXJDLHdCQUF3QixJQUFZO0lBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBQ0QsSUFBSSxLQUFLLEdBQUcsb0JBQWEsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pELE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIE9wYXF1ZVRva2VufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge0FuaW1hdGlvbkJ1aWxkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9hbmltYXRlL2FuaW1hdGlvbl9idWlsZGVyJztcbmltcG9ydCB7XG4gIGlzUHJlc2VudCxcbiAgaXNCbGFuayxcbiAgSnNvbixcbiAgUmVnRXhwV3JhcHBlcixcbiAgQ09OU1RfRVhQUixcbiAgc3RyaW5naWZ5LFxuICBTdHJpbmdXcmFwcGVyLFxuICBpc0FycmF5XG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7RG9tU2hhcmVkU3R5bGVzSG9zdH0gZnJvbSAnLi9zaGFyZWRfc3R5bGVzX2hvc3QnO1xuXG5pbXBvcnQge1xuICBSZW5kZXJlcixcbiAgUm9vdFJlbmRlcmVyLFxuICBSZW5kZXJDb21wb25lbnRUeXBlLFxuICBSZW5kZXJEZWJ1Z0luZm9cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVuZGVyL2FwaSc7XG5cbmltcG9ydCB7RXZlbnRNYW5hZ2VyfSBmcm9tICcuL2V2ZW50cy9ldmVudF9tYW5hZ2VyJztcblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnLi9kb21fdG9rZW5zJztcbmltcG9ydCB7Vmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL21ldGFkYXRhJztcbmltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcbmltcG9ydCB7Y2FtZWxDYXNlVG9EYXNoQ2FzZX0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgTkFNRVNQQUNFX1VSSVMgPVxuICAgIENPTlNUX0VYUFIoeyd4bGluayc6ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ3N2Zyc6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyd9KTtcbmNvbnN0IFRFTVBMQVRFX0NPTU1FTlRfVEVYVCA9ICd0ZW1wbGF0ZSBiaW5kaW5ncz17fSc7XG52YXIgVEVNUExBVEVfQklORElOR1NfRVhQID0gL150ZW1wbGF0ZSBiaW5kaW5ncz0oLiopJC9nO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRG9tUm9vdFJlbmRlcmVyIGltcGxlbWVudHMgUm9vdFJlbmRlcmVyIHtcbiAgcHJpdmF0ZSBfcmVnaXN0ZXJlZENvbXBvbmVudHM6IE1hcDxzdHJpbmcsIERvbVJlbmRlcmVyPiA9IG5ldyBNYXA8c3RyaW5nLCBEb21SZW5kZXJlcj4oKTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZG9jdW1lbnQ6IGFueSwgcHVibGljIGV2ZW50TWFuYWdlcjogRXZlbnRNYW5hZ2VyLFxuICAgICAgICAgICAgICBwdWJsaWMgc2hhcmVkU3R5bGVzSG9zdDogRG9tU2hhcmVkU3R5bGVzSG9zdCwgcHVibGljIGFuaW1hdGU6IEFuaW1hdGlvbkJ1aWxkZXIpIHt9XG5cbiAgcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudFByb3RvOiBSZW5kZXJDb21wb25lbnRUeXBlKTogUmVuZGVyZXIge1xuICAgIHZhciByZW5kZXJlciA9IHRoaXMuX3JlZ2lzdGVyZWRDb21wb25lbnRzLmdldChjb21wb25lbnRQcm90by5pZCk7XG4gICAgaWYgKGlzQmxhbmsocmVuZGVyZXIpKSB7XG4gICAgICByZW5kZXJlciA9IG5ldyBEb21SZW5kZXJlcih0aGlzLCBjb21wb25lbnRQcm90byk7XG4gICAgICB0aGlzLl9yZWdpc3RlcmVkQ29tcG9uZW50cy5zZXQoY29tcG9uZW50UHJvdG8uaWQsIHJlbmRlcmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlcmVyO1xuICB9XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEb21Sb290UmVuZGVyZXJfIGV4dGVuZHMgRG9tUm9vdFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksIF9ldmVudE1hbmFnZXI6IEV2ZW50TWFuYWdlcixcbiAgICAgICAgICAgICAgc2hhcmVkU3R5bGVzSG9zdDogRG9tU2hhcmVkU3R5bGVzSG9zdCwgYW5pbWF0ZTogQW5pbWF0aW9uQnVpbGRlcikge1xuICAgIHN1cGVyKF9kb2N1bWVudCwgX2V2ZW50TWFuYWdlciwgc2hhcmVkU3R5bGVzSG9zdCwgYW5pbWF0ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvbVJlbmRlcmVyIGltcGxlbWVudHMgUmVuZGVyZXIge1xuICBwcml2YXRlIF9jb250ZW50QXR0cjogc3RyaW5nO1xuICBwcml2YXRlIF9ob3N0QXR0cjogc3RyaW5nO1xuICBwcml2YXRlIF9zdHlsZXM6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3Jvb3RSZW5kZXJlcjogRG9tUm9vdFJlbmRlcmVyLCBwcml2YXRlIGNvbXBvbmVudFByb3RvOiBSZW5kZXJDb21wb25lbnRUeXBlKSB7XG4gICAgdGhpcy5fc3R5bGVzID0gX2ZsYXR0ZW5TdHlsZXMoY29tcG9uZW50UHJvdG8uaWQsIGNvbXBvbmVudFByb3RvLnN0eWxlcywgW10pO1xuICAgIGlmIChjb21wb25lbnRQcm90by5lbmNhcHN1bGF0aW9uICE9PSBWaWV3RW5jYXBzdWxhdGlvbi5OYXRpdmUpIHtcbiAgICAgIHRoaXMuX3Jvb3RSZW5kZXJlci5zaGFyZWRTdHlsZXNIb3N0LmFkZFN0eWxlcyh0aGlzLl9zdHlsZXMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb21wb25lbnRQcm90by5lbmNhcHN1bGF0aW9uID09PSBWaWV3RW5jYXBzdWxhdGlvbi5FbXVsYXRlZCkge1xuICAgICAgdGhpcy5fY29udGVudEF0dHIgPSBfc2hpbUNvbnRlbnRBdHRyaWJ1dGUoY29tcG9uZW50UHJvdG8uaWQpO1xuICAgICAgdGhpcy5faG9zdEF0dHIgPSBfc2hpbUhvc3RBdHRyaWJ1dGUoY29tcG9uZW50UHJvdG8uaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb250ZW50QXR0ciA9IG51bGw7XG4gICAgICB0aGlzLl9ob3N0QXR0ciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc2VsZWN0Um9vdEVsZW1lbnQoc2VsZWN0b3I6IHN0cmluZywgZGVidWdJbmZvOiBSZW5kZXJEZWJ1Z0luZm8pOiBFbGVtZW50IHtcbiAgICB2YXIgZWwgPSBET00ucXVlcnlTZWxlY3Rvcih0aGlzLl9yb290UmVuZGVyZXIuZG9jdW1lbnQsIHNlbGVjdG9yKTtcbiAgICBpZiAoaXNCbGFuayhlbCkpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBUaGUgc2VsZWN0b3IgXCIke3NlbGVjdG9yfVwiIGRpZCBub3QgbWF0Y2ggYW55IGVsZW1lbnRzYCk7XG4gICAgfVxuICAgIERPTS5jbGVhck5vZGVzKGVsKTtcbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICBjcmVhdGVFbGVtZW50KHBhcmVudDogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBkZWJ1Z0luZm86IFJlbmRlckRlYnVnSW5mbyk6IE5vZGUge1xuICAgIHZhciBuc0FuZE5hbWUgPSBzcGxpdE5hbWVzcGFjZShuYW1lKTtcbiAgICB2YXIgZWwgPSBpc1ByZXNlbnQobnNBbmROYW1lWzBdKSA/XG4gICAgICAgICAgICAgICAgIERPTS5jcmVhdGVFbGVtZW50TlMoTkFNRVNQQUNFX1VSSVNbbnNBbmROYW1lWzBdXSwgbnNBbmROYW1lWzFdKSA6XG4gICAgICAgICAgICAgICAgIERPTS5jcmVhdGVFbGVtZW50KG5zQW5kTmFtZVsxXSk7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9jb250ZW50QXR0cikpIHtcbiAgICAgIERPTS5zZXRBdHRyaWJ1dGUoZWwsIHRoaXMuX2NvbnRlbnRBdHRyLCAnJyk7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQocGFyZW50KSkge1xuICAgICAgRE9NLmFwcGVuZENoaWxkKHBhcmVudCwgZWwpO1xuICAgIH1cbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICBjcmVhdGVWaWV3Um9vdChob3N0RWxlbWVudDogYW55KTogYW55IHtcbiAgICB2YXIgbm9kZXNQYXJlbnQ7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UHJvdG8uZW5jYXBzdWxhdGlvbiA9PT0gVmlld0VuY2Fwc3VsYXRpb24uTmF0aXZlKSB7XG4gICAgICBub2Rlc1BhcmVudCA9IERPTS5jcmVhdGVTaGFkb3dSb290KGhvc3RFbGVtZW50KTtcbiAgICAgIHRoaXMuX3Jvb3RSZW5kZXJlci5zaGFyZWRTdHlsZXNIb3N0LmFkZEhvc3Qobm9kZXNQYXJlbnQpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgRE9NLmFwcGVuZENoaWxkKG5vZGVzUGFyZW50LCBET00uY3JlYXRlU3R5bGVFbGVtZW50KHRoaXMuX3N0eWxlc1tpXSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNQcmVzZW50KHRoaXMuX2hvc3RBdHRyKSkge1xuICAgICAgICBET00uc2V0QXR0cmlidXRlKGhvc3RFbGVtZW50LCB0aGlzLl9ob3N0QXR0ciwgJycpO1xuICAgICAgfVxuICAgICAgbm9kZXNQYXJlbnQgPSBob3N0RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGVzUGFyZW50O1xuICB9XG5cbiAgY3JlYXRlVGVtcGxhdGVBbmNob3IocGFyZW50RWxlbWVudDogYW55LCBkZWJ1Z0luZm86IFJlbmRlckRlYnVnSW5mbyk6IGFueSB7XG4gICAgdmFyIGNvbW1lbnQgPSBET00uY3JlYXRlQ29tbWVudChURU1QTEFURV9DT01NRU5UX1RFWFQpO1xuICAgIGlmIChpc1ByZXNlbnQocGFyZW50RWxlbWVudCkpIHtcbiAgICAgIERPTS5hcHBlbmRDaGlsZChwYXJlbnRFbGVtZW50LCBjb21tZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1lbnQ7XG4gIH1cblxuICBjcmVhdGVUZXh0KHBhcmVudEVsZW1lbnQ6IGFueSwgdmFsdWU6IHN0cmluZywgZGVidWdJbmZvOiBSZW5kZXJEZWJ1Z0luZm8pOiBhbnkge1xuICAgIHZhciBub2RlID0gRE9NLmNyZWF0ZVRleHROb2RlKHZhbHVlKTtcbiAgICBpZiAoaXNQcmVzZW50KHBhcmVudEVsZW1lbnQpKSB7XG4gICAgICBET00uYXBwZW5kQ2hpbGQocGFyZW50RWxlbWVudCwgbm9kZSk7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcHJvamVjdE5vZGVzKHBhcmVudEVsZW1lbnQ6IGFueSwgbm9kZXM6IGFueVtdKSB7XG4gICAgaWYgKGlzQmxhbmsocGFyZW50RWxlbWVudCkpIHJldHVybjtcbiAgICBhcHBlbmROb2RlcyhwYXJlbnRFbGVtZW50LCBub2Rlcyk7XG4gIH1cblxuICBhdHRhY2hWaWV3QWZ0ZXIobm9kZTogYW55LCB2aWV3Um9vdE5vZGVzOiBhbnlbXSkge1xuICAgIG1vdmVOb2Rlc0FmdGVyU2libGluZyhub2RlLCB2aWV3Um9vdE5vZGVzKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpZXdSb290Tm9kZXMubGVuZ3RoOyBpKyspIHRoaXMuYW5pbWF0ZU5vZGVFbnRlcih2aWV3Um9vdE5vZGVzW2ldKTtcbiAgfVxuXG4gIGRldGFjaFZpZXcodmlld1Jvb3ROb2RlczogYW55W10pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXdSb290Tm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gdmlld1Jvb3ROb2Rlc1tpXTtcbiAgICAgIERPTS5yZW1vdmUobm9kZSk7XG4gICAgICB0aGlzLmFuaW1hdGVOb2RlTGVhdmUobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveVZpZXcoaG9zdEVsZW1lbnQ6IGFueSwgdmlld0FsbE5vZGVzOiBhbnlbXSkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFByb3RvLmVuY2Fwc3VsYXRpb24gPT09IFZpZXdFbmNhcHN1bGF0aW9uLk5hdGl2ZSAmJiBpc1ByZXNlbnQoaG9zdEVsZW1lbnQpKSB7XG4gICAgICB0aGlzLl9yb290UmVuZGVyZXIuc2hhcmVkU3R5bGVzSG9zdC5yZW1vdmVIb3N0KERPTS5nZXRTaGFkb3dSb290KGhvc3RFbGVtZW50KSk7XG4gICAgfVxuICB9XG5cbiAgbGlzdGVuKHJlbmRlckVsZW1lbnQ6IGFueSwgbmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3RSZW5kZXJlci5ldmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihyZW5kZXJFbGVtZW50LCBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdGVQcmV2ZW50RGVmYXVsdChjYWxsYmFjaykpO1xuICB9XG5cbiAgbGlzdGVuR2xvYmFsKHRhcmdldDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fcm9vdFJlbmRlcmVyLmV2ZW50TWFuYWdlci5hZGRHbG9iYWxFdmVudExpc3RlbmVyKHRhcmdldCwgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY29yYXRlUHJldmVudERlZmF1bHQoY2FsbGJhY2spKTtcbiAgfVxuXG4gIHNldEVsZW1lbnRQcm9wZXJ0eShyZW5kZXJFbGVtZW50OiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwcm9wZXJ0eVZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBET00uc2V0UHJvcGVydHkocmVuZGVyRWxlbWVudCwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlKTtcbiAgfVxuXG4gIHNldEVsZW1lbnRBdHRyaWJ1dGUocmVuZGVyRWxlbWVudDogYW55LCBhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZVZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB2YXIgYXR0ck5zO1xuICAgIHZhciBuc0FuZE5hbWUgPSBzcGxpdE5hbWVzcGFjZShhdHRyaWJ1dGVOYW1lKTtcbiAgICBpZiAoaXNQcmVzZW50KG5zQW5kTmFtZVswXSkpIHtcbiAgICAgIGF0dHJpYnV0ZU5hbWUgPSBuc0FuZE5hbWVbMF0gKyAnOicgKyBuc0FuZE5hbWVbMV07XG4gICAgICBhdHRyTnMgPSBOQU1FU1BBQ0VfVVJJU1tuc0FuZE5hbWVbMF1dO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgaWYgKGlzUHJlc2VudChhdHRyTnMpKSB7XG4gICAgICAgIERPTS5zZXRBdHRyaWJ1dGVOUyhyZW5kZXJFbGVtZW50LCBhdHRyTnMsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERPTS5zZXRBdHRyaWJ1dGUocmVuZGVyRWxlbWVudCwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNQcmVzZW50KGF0dHJOcykpIHtcbiAgICAgICAgRE9NLnJlbW92ZUF0dHJpYnV0ZU5TKHJlbmRlckVsZW1lbnQsIGF0dHJOcywgbnNBbmROYW1lWzFdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERPTS5yZW1vdmVBdHRyaWJ1dGUocmVuZGVyRWxlbWVudCwgYXR0cmlidXRlTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0QmluZGluZ0RlYnVnSW5mbyhyZW5kZXJFbGVtZW50OiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwcm9wZXJ0eVZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB2YXIgZGFzaENhc2VkUHJvcGVydHlOYW1lID0gY2FtZWxDYXNlVG9EYXNoQ2FzZShwcm9wZXJ0eU5hbWUpO1xuICAgIGlmIChET00uaXNDb21tZW50Tm9kZShyZW5kZXJFbGVtZW50KSkge1xuICAgICAgdmFyIGV4aXN0aW5nQmluZGluZ3MgPSBSZWdFeHBXcmFwcGVyLmZpcnN0TWF0Y2goXG4gICAgICAgICAgVEVNUExBVEVfQklORElOR1NfRVhQLCBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGwoRE9NLmdldFRleHQocmVuZGVyRWxlbWVudCksIC9cXG4vZywgJycpKTtcbiAgICAgIHZhciBwYXJzZWRCaW5kaW5ncyA9IEpzb24ucGFyc2UoZXhpc3RpbmdCaW5kaW5nc1sxXSk7XG4gICAgICBwYXJzZWRCaW5kaW5nc1tkYXNoQ2FzZWRQcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgIERPTS5zZXRUZXh0KHJlbmRlckVsZW1lbnQsIFN0cmluZ1dyYXBwZXIucmVwbGFjZShURU1QTEFURV9DT01NRU5UX1RFWFQsICd7fScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSnNvbi5zdHJpbmdpZnkocGFyc2VkQmluZGluZ3MpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0RWxlbWVudEF0dHJpYnV0ZShyZW5kZXJFbGVtZW50LCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHNldEVsZW1lbnRDbGFzcyhyZW5kZXJFbGVtZW50OiBhbnksIGNsYXNzTmFtZTogc3RyaW5nLCBpc0FkZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChpc0FkZCkge1xuICAgICAgRE9NLmFkZENsYXNzKHJlbmRlckVsZW1lbnQsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIERPTS5yZW1vdmVDbGFzcyhyZW5kZXJFbGVtZW50LCBjbGFzc05hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHNldEVsZW1lbnRTdHlsZShyZW5kZXJFbGVtZW50OiBhbnksIHN0eWxlTmFtZTogc3RyaW5nLCBzdHlsZVZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoaXNQcmVzZW50KHN0eWxlVmFsdWUpKSB7XG4gICAgICBET00uc2V0U3R5bGUocmVuZGVyRWxlbWVudCwgc3R5bGVOYW1lLCBzdHJpbmdpZnkoc3R5bGVWYWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBET00ucmVtb3ZlU3R5bGUocmVuZGVyRWxlbWVudCwgc3R5bGVOYW1lKTtcbiAgICB9XG4gIH1cblxuICBpbnZva2VFbGVtZW50TWV0aG9kKHJlbmRlckVsZW1lbnQ6IGFueSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgIERPTS5pbnZva2UocmVuZGVyRWxlbWVudCwgbWV0aG9kTmFtZSwgYXJncyk7XG4gIH1cblxuICBzZXRUZXh0KHJlbmRlck5vZGU6IGFueSwgdGV4dDogc3RyaW5nKTogdm9pZCB7IERPTS5zZXRUZXh0KHJlbmRlck5vZGUsIHRleHQpOyB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGFuaW1hdGlvbnMgaWYgbmVjZXNzYXJ5XG4gICAqIEBwYXJhbSBub2RlXG4gICAqL1xuICBhbmltYXRlTm9kZUVudGVyKG5vZGU6IE5vZGUpIHtcbiAgICBpZiAoRE9NLmlzRWxlbWVudE5vZGUobm9kZSkgJiYgRE9NLmhhc0NsYXNzKG5vZGUsICduZy1hbmltYXRlJykpIHtcbiAgICAgIERPTS5hZGRDbGFzcyhub2RlLCAnbmctZW50ZXInKTtcbiAgICAgIHRoaXMuX3Jvb3RSZW5kZXJlci5hbmltYXRlLmNzcygpXG4gICAgICAgICAgLmFkZEFuaW1hdGlvbkNsYXNzKCduZy1lbnRlci1hY3RpdmUnKVxuICAgICAgICAgIC5zdGFydCg8SFRNTEVsZW1lbnQ+bm9kZSlcbiAgICAgICAgICAub25Db21wbGV0ZSgoKSA9PiB7IERPTS5yZW1vdmVDbGFzcyhub2RlLCAnbmctZW50ZXInKTsgfSk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogSWYgYW5pbWF0aW9ucyBhcmUgbmVjZXNzYXJ5LCBwZXJmb3JtcyBhbmltYXRpb25zIHRoZW4gcmVtb3ZlcyB0aGUgZWxlbWVudDsgb3RoZXJ3aXNlLCBpdCBqdXN0XG4gICAqIHJlbW92ZXMgdGhlIGVsZW1lbnQuXG4gICAqIEBwYXJhbSBub2RlXG4gICAqL1xuICBhbmltYXRlTm9kZUxlYXZlKG5vZGU6IE5vZGUpIHtcbiAgICBpZiAoRE9NLmlzRWxlbWVudE5vZGUobm9kZSkgJiYgRE9NLmhhc0NsYXNzKG5vZGUsICduZy1hbmltYXRlJykpIHtcbiAgICAgIERPTS5hZGRDbGFzcyhub2RlLCAnbmctbGVhdmUnKTtcbiAgICAgIHRoaXMuX3Jvb3RSZW5kZXJlci5hbmltYXRlLmNzcygpXG4gICAgICAgICAgLmFkZEFuaW1hdGlvbkNsYXNzKCduZy1sZWF2ZS1hY3RpdmUnKVxuICAgICAgICAgIC5zdGFydCg8SFRNTEVsZW1lbnQ+bm9kZSlcbiAgICAgICAgICAub25Db21wbGV0ZSgoKSA9PiB7XG4gICAgICAgICAgICBET00ucmVtb3ZlQ2xhc3Mobm9kZSwgJ25nLWxlYXZlJyk7XG4gICAgICAgICAgICBET00ucmVtb3ZlKG5vZGUpO1xuICAgICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBET00ucmVtb3ZlKG5vZGUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlTm9kZXNBZnRlclNpYmxpbmcoc2libGluZywgbm9kZXMpIHtcbiAgdmFyIHBhcmVudCA9IERPTS5wYXJlbnRFbGVtZW50KHNpYmxpbmcpO1xuICBpZiAobm9kZXMubGVuZ3RoID4gMCAmJiBpc1ByZXNlbnQocGFyZW50KSkge1xuICAgIHZhciBuZXh0U2libGluZyA9IERPTS5uZXh0U2libGluZyhzaWJsaW5nKTtcbiAgICBpZiAoaXNQcmVzZW50KG5leHRTaWJsaW5nKSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBET00uaW5zZXJ0QmVmb3JlKG5leHRTaWJsaW5nLCBub2Rlc1tpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgRE9NLmFwcGVuZENoaWxkKHBhcmVudCwgbm9kZXNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBlbmROb2RlcyhwYXJlbnQsIG5vZGVzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBET00uYXBwZW5kQ2hpbGQocGFyZW50LCBub2Rlc1tpXSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVjb3JhdGVQcmV2ZW50RGVmYXVsdChldmVudEhhbmRsZXI6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICByZXR1cm4gKGV2ZW50KSA9PiB7XG4gICAgdmFyIGFsbG93RGVmYXVsdEJlaGF2aW9yID0gZXZlbnRIYW5kbGVyKGV2ZW50KTtcbiAgICBpZiAoYWxsb3dEZWZhdWx0QmVoYXZpb3IgPT09IGZhbHNlKSB7XG4gICAgICAvLyBUT0RPKHRib3NjaCk6IG1vdmUgcHJldmVudERlZmF1bHQgaW50byBldmVudCBwbHVnaW5zLi4uXG4gICAgICBET00ucHJldmVudERlZmF1bHQoZXZlbnQpO1xuICAgIH1cbiAgfTtcbn1cblxudmFyIENPTVBPTkVOVF9SRUdFWCA9IC8lQ09NUCUvZztcbmV4cG9ydCBjb25zdCBDT01QT05FTlRfVkFSSUFCTEUgPSAnJUNPTVAlJztcbmV4cG9ydCBjb25zdCBIT1NUX0FUVFIgPSBgX25naG9zdC0ke0NPTVBPTkVOVF9WQVJJQUJMRX1gO1xuZXhwb3J0IGNvbnN0IENPTlRFTlRfQVRUUiA9IGBfbmdjb250ZW50LSR7Q09NUE9ORU5UX1ZBUklBQkxFfWA7XG5cbmZ1bmN0aW9uIF9zaGltQ29udGVudEF0dHJpYnV0ZShjb21wb25lbnRTaG9ydElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsKENPTlRFTlRfQVRUUiwgQ09NUE9ORU5UX1JFR0VYLCBjb21wb25lbnRTaG9ydElkKTtcbn1cblxuZnVuY3Rpb24gX3NoaW1Ib3N0QXR0cmlidXRlKGNvbXBvbmVudFNob3J0SWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGwoSE9TVF9BVFRSLCBDT01QT05FTlRfUkVHRVgsIGNvbXBvbmVudFNob3J0SWQpO1xufVxuXG5mdW5jdGlvbiBfZmxhdHRlblN0eWxlcyhjb21wSWQ6IHN0cmluZywgc3R5bGVzOiBBcnJheTxhbnkgfCBhbnlbXT4sIHRhcmdldDogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHN0eWxlID0gc3R5bGVzW2ldO1xuICAgIGlmIChpc0FycmF5KHN0eWxlKSkge1xuICAgICAgX2ZsYXR0ZW5TdHlsZXMoY29tcElkLCBzdHlsZSwgdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUgPSBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGwoc3R5bGUsIENPTVBPTkVOVF9SRUdFWCwgY29tcElkKTtcbiAgICAgIHRhcmdldC5wdXNoKHN0eWxlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxudmFyIE5TX1BSRUZJWF9SRSA9IC9eQChbXjpdKyk6KC4rKS9nO1xuXG5mdW5jdGlvbiBzcGxpdE5hbWVzcGFjZShuYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGlmIChuYW1lWzBdICE9ICdAJykge1xuICAgIHJldHVybiBbbnVsbCwgbmFtZV07XG4gIH1cbiAgbGV0IG1hdGNoID0gUmVnRXhwV3JhcHBlci5maXJzdE1hdGNoKE5TX1BSRUZJWF9SRSwgbmFtZSk7XG4gIHJldHVybiBbbWF0Y2hbMV0sIG1hdGNoWzJdXTtcbn1cbiJdfQ==