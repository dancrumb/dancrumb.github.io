---
layout: post
title: Figuring out Method Resolution Order in Dojo
date: 2012-05-08 23:22:07.000000000 -05:00
type: post
published: true
status: publish
categories:
- Dojo
- Programming
tags:
- dojo
- inheritance
- mro
- utility
---
Dojo allows the simulation of class-based inheritance with the [declare](http://dojotoolkit.org/reference-guide/1.7/dojo/declare.html) function. It even allows for multiple inheritance. However, this raises questions of how to figure out which Function to call, when a method of an instantiated Object is provided by a parent object. This article provides guidance on how to figure it out and a handy little function to determine <abbr title="Method Resolution Order">MRO</abbr> for certain.

# Method Resolution Order

When you have an Object that inherits methods from multiple parent Object, there needs to be a definitive way to determine which of the parent Objects implements methods not directly implemented in the child object. Dojo uses the [C3 Method Resolution Order](http://www.python.org/download/releases/2.3/mro/) and you can read all the details by following that link. However, it gets a little technical, so I'll try to summarize here.

Normally, it's pretty easy to figure things out. Consider the following:

![Basic Inheritance Chain]({{ site.github.url }}/assets/simple_inheritance.jpg)

It's easy to figure out which Function object to use for the method call `C.method()`. If it's not in `C`, look in `B`. If it's not there, look in `A`.

Now consider this diagram, which shows the well-known [Diamond problem](http://en.wikipedia.org/wiki/Diamond_problem)

![Diamond problem diagram]({{ site.github.url }}/assets/diamond.jpg)

In this diagram, `C` inherits from `B` and `D`, which both inherit from `A`. So here's the question: if `C` overrides a method from `A` called `foo`, and `B` and `D` both override that method differently, which Function will be used for the method call `C.foo()`?

That's where <abbr title="Method Resolution Order">MRO</abbr> comes in. <abbr title="Method Resolution Order">MRO</abbr> is used to determine which order to search for a method in a network of classes. The [C3 Method Resolution Order](http://www.python.org/download/releases/2.3/mro/) guarantees that this will be predictable.

# Figuring out <abbr title="Method Resolution Order">MRO</abbr> for your classes

Let's say you've declare the following classes:

```javascript
require(['dojo/_base/declare'],function(declare) {
  declare('A',[],{});
  declare('B',[],{});
  declare('C',[],{});
  declare('D',[A,B,C],{});
  declare('E',[C,D],{});
}
```

If you want to know which order E will use to search for a method, you could hand crunch the <abbr title="Method Resolution Order">MRO</abbr> yourself. If you don't want to, then the following function will help you out:

```javascript
define('mro', ['dojo/_base/array'], function(arrayUtils) {
  return function(proto) {
    return arrayUtils.map(proto._meta.bases,function(base) {
      return base.prototype.declaredClass
    }).join(" -> ");
  }
});
```

With this function: `mro`, you can take the constructor of any Object and determine its <abbr title="Method Resolution Order">MRO</abbr>, like so:

```javascript            
require(['dojo/_base/declare','mro'],function(declare, mro) {
  declare('A',[],{});
  declare('B',[],{});
  declare('C',[],{});
  declare('D',[A,B,C],{});
  declare('E',[C,D],{});

  alert(mro(E));
})
```

This will display `E -> D -> C -> B -> A` in an alert box. This shows you the order of Objects that will be search in order to resolve a method call.

If you'd like to play with this, you can do so in a [Dojo sandbox](http://dojo-sandbox.net/public/d4190/0). And that's all you need to know. If you're interested in why I wrote this, you can read on, but that's all you need in order to starting checking MROs for your Objects.

# Why did I need to know about <abbr title="Method Resolution Order">MRO</abbr>?

If you've ever used the [Dijit Toolbar](http://livedocs.dojotoolkit.org/dijit/Toolbar), you may know that it captures the left and right arrow keys in order to move focus between buttons. Unfortunately, if you put a text box into your toolbar, you can no longer move the caret, as the arrow keys just shit focus instead of shifting the cursor.

It does this with the `_KeyNavContainer` mixin:

```javascript
define([
    "require",
    "dojo/_base/declare", // declare
        ...
    "./_Widget",
    "./_KeyNavContainer",
    "./_TemplatedMixin"
], function(require, declare, ... , _Widget, _KeyNavContainer, _TemplatedMixin){
    ...
    declare("dijit.Toolbar", [_Widget, _TemplatedMixin, _KeyNavContainer], { ... });
    ...
})
```

In order to override this behaviour, I created my own `Toolbar` and `_KeyNavContainer`:

```javascript
define(["dojo/_base/declare", // declare
        ...
    "dijit/_KeyNavContainer"
], function(declare, ... ,_KeyNavContainer){
    declare("danrumney._KeyNavContainer", [_KeyNavContainer], { ... });
})

...

define(["dojo/_base/declare", // declare
        ...
    "dijit/Toolbar",
        "danrumney/_KeyNavContainer"
], function(declare, ... ,_KeyNavContainer){
    declare("danrumney.Toolbar", [Toolbar, _KeyNavContainer], { ... });
})
```

In order to confirm that my overriding Objects would be the ones to provide Functions for method calls against `danrumney.Toolbar`, I wrote the <abbr title="Method Resolution Order">MRO</abbr> code:

```javascript
define('mro', ['dojo/_base/array'], function(arrayUtils) {
  return function(proto) {
    return arrayUtils.map(proto._meta.bases,function(base) {
      return base.prototype.declaredClass
    }).join(" -> ");
  }
});

require(['dojo/_base/declare','mro'],function(declare, mro) {
  declare('dijit_Widget',[],{});
  declare('dijit_TemplatedMixin',[],{});
  declare('dijit_KeyNavContainer',[],{});
  declare('dijit_Toolbar',[dijit_Widget, dijit_TemplatedMixin, dijit_KeyNavContainer ],{});
  declare('dcr_KeyNavContainer',[dijit_KeyNavContainer ],{});
  declare('dcr_Toolbar',[dijit_Toolbar,dcr_KeyNavContainer],{});

  alert(mro(dcr_Toolbar));
})
```

This gives

    dcr_Toolbar -> dcr_KeyNavContainer -> dijit_Toolbar
                -> dijit_KeyNavContainer -> dijit_TemplatedMixin
                -> dijit_Widget

which is exactly what I wanted. Hooray for <abbr title="Method Resolution Order">MRO</abbr>!
