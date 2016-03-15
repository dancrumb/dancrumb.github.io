---
layout: post
title: Problems with Event handling and AOP advice in Dojo when hitch is in play
date: 2012-05-06 20:19:18.000000000 -05:00
type: post
published: true
status: publish
categories:
- Dojo
- Javascript
- Programming
tags:
- aspect
- connect
- dojo
- hitch
- problems
- quirks
meta:
  _edit_last: '1'
  aktt_tweeted: '1'
  _cws_is_markdown: '1'
  aktt_notify_twitter: 'yes'
author:
  login: admin
  email: dancrumb@gmail.com
  display_name: dancrumb
  first_name: ''
  last_name: ''
excerpt: An analysis of problems created when using Dojo's hitch, connect and aspect
  methods in a complex web application.
---
Anyone who has spent time developing web-apps with Dojo will have found the need to associate their own functionality with the raising of events and calling of methods on other objects that may not be within their control. Dojo allows developers to attach _Listeners_ (callback methods) to _Actions_ (DOM events or object method calls) in order to allow such wiring.

Some of you may have stumbled across an issue whereby a Listener has been attached to an Action, but isn't being called when that Action executes. This article explains what's going on an how to avoid it.

> Throughout this article, you'll see me using the <abbr title="Asynchronous Module Definition">AMD</abbr> style of module use. That is, I won't be referring to `dojo`.methods. If you're not familiar with Dojo's <abbr title="Asynchronous Module Definition">AMD</abbr>, take a look at this article about [the Dojo Loader](http://dojotoolkit.org/reference-guide/1.7/loader/amd.html) at some point. Until then, don't worry: all this affects for this article is what the method calls look like; the internals are the same.

# The problem

Take a look at this code and see if you can figure out what the output will be:

<pre lang="javascript" line="1">/*jshint dojo:true devel:true strict:false*/
require(['dojo/_base/declare', 'dojo/_base/lang',
         'dojo/_base/connect'],
    function(declare, lang,
             connect) {

        declare("Foo", [], {
        /*global Foo*/
            constructor : function(name) {
                this.name = name || "<undef>";
               console.log("Instantiated a Foo called '"+this.name+"'");
            },

            aMethod: function() {
                console.log(this.name+".aMethod called with arguments: %o", arguments);
            },

            secondMethod: function() {
                console.log(this.name+".secondMethod called with arguments: %o", arguments);
            }
        });

        declare("Bar", [], {
            /*global Bar */
           constructor : function(name) {
               this.name = name || "<undef>";
               console.log("Instantiated a Bar called '"+this.name+"'");
           },

           anotherMethod: function() {
                console.log(this.name+".anotherMethod called with arguments: %o", arguments);
           }
        });

        var foo = new Foo("foo");
        console.info("Calling foo.aMethod");
        foo.aMethod("After init");

        var bar = new Bar('bar');

        console.info("Calling bar.anotherMethod");
        bar.anotherMethod("After init");

        console.info("Getting a reference to bar.anotherMethod called barAM");
        var barAM = lang.hitch(bar, bar.anotherMethod);

        console.info("Connecting foo.aMethod to bar.anotherMethod");
        connect.connect(bar,'anotherMethod', foo, foo.aMethod);

        console.info("Calling bar.anotherMethod");
        bar.anotherMethod('Direct call');
        console.info("Calling barAM");
        barAM('Via barAM');

        console.info("Getting another reference to bar.anotherMethod called barAM2");
        var barAM2 = lang.hitch(bar, bar.anotherMethod);

        console.info("Connecting foo.secondMethod to bar.anotherMethod");
        connect.connect(bar,'anotherMethod', foo, foo.secondMethod);

        console.info("Calling bar.anotherMethod");
        bar.anotherMethod('Direct call');
        console.info("Calling barAM");
        barAM('Via barAM');
        console.info("Calling barAM2");
        barAM2('Via barAM2');        
    }
);</undef> </undef></pre>

Here's what you will see in your console:

<pre lang="none" line="1">Instantiated a Foo called 'foo'
Calling foo.aMethod
foo.aMethod called with arguments: ["After init"]

Instantiated a Bar called 'bar'
Calling bar.anotherMethod
bar.anotherMethod called with arguments: ["After init"]

Getting a reference to bar.anotherMethod called barAM
Connecting foo.aMethod to bar.anotherMethod
Calling bar.anotherMethod
bar.anotherMethod called with arguments: ["Direct call"]
foo.aMethod called with arguments: ["Direct call"]

Calling barAM
bar.anotherMethod called with arguments: ["Via barAM"]

Getting another reference to bar.anotherMethod called barAM2
Connecting foo.secondMethod to bar.anotherMethod
Calling bar.anotherMethod
bar.anotherMethod called with arguments: ["Direct call"]
foo.aMethod called with arguments: ["Direct call"]
foo.secondMethod called with arguments: ["Direct call"]

Calling barAM
bar.anotherMethod called with arguments: ["Via barAM"]

Calling barAM2
bar.anotherMethod called with arguments: ["Via barAM2"]
foo.aMethod called with arguments: ["Via barAM2"]
foo.secondMethod called with arguments: ["Via barAM2"]

</pre>

First, we instantiate two objects: `foo` and `bar` and we call some methods to demonstrate how those methods behave.  
Then, we get a reference to the `bar.anotherMethod` called `barAM`. We connect `foo.aMethod` to `bar.anotherMethod`, so that `foo.aMethod` is called whenever `bar.anotherMethod` is called.  
Next, we call `bar.anotherMethod` and, as expected, we see that `foo.aMethod` is called.  
After that, we call `barAM`, but we see that `foo.aMethod` is **not** called, even though `bar.anotherMethod` **was**.  
OK, so maybe it's because we created `barAM` _before_ we connected `foo.aMethod`. So, we create another reference to `bar.anotherMethod` and call it `barAM2`.  
We also connect another method (`foo.secondMethod`) to `bar.anotherMethod`.  
This time, when we call `bar.anotherMethod` we see both of our connected methods also being called. Great; this is what we expect.  
Then, we call `barAM` and we see that **only** `bar.anotherMethod` is called. Not what we want, but what we now expect.  
Finally, we call `barAM2`. This time, we see that **both** `foo` methods are called, even though we attached `secondMethod` _after_ we took our reference.

What's going on?

First, let's look at the wiring...

# The wiring

Prior to Dojo 1.7, this was all handled by the [connect](http://livedocs.dojotoolkit.org/dojo/connect) module. Since the advent of Dojo 1.7, this functionality has been split out into the [`on`][] module for event-handling and [aspect](http://livedocs.dojotoolkit.org/dojo/aspect) module for Aspect Oriented Programming (AOP) advice giving. Indeed, the 1.7 version of `connect.connect()` is essentially a wrapper around calls to `on()` and `aspect.after()`. First, let's look at `connect`

## Dojo connect

If you take a look at the [connect API](http://dojotoolkit.org/api/dojo#dojo.connect), you'll see the method signature:

    connect.connect(obj, event, context, method, dontFix);

<dl>

<dt>`obj`</dt>

<dd>This is the object that fires the Action. It might be a DOM node or just a plain old object. It can be omitted, but we're not going to worry about that here.</dd>

<dt>`event`</dt>

<dd>This is the Action that was mentioned above. It might be an event; it might be a method name. Either way, it's just a String that represents the Action that we're interested in connecting to</dd>

<dt>`context`</dt>

<dd>This is the context in which the `method` will be called. Basically, the context of a method is the value that is returned if the method refers to `this`. If no context is given to `connect.connect()`, then the context will be set to the event's context.</dd>

<dt>`method`</dt>

<dd>This is the function that will be called after the Action takes place. This can be a Function object (i.e. a reference to a function) or it can be a String. If it is a String, then the function that is called is `context[method]`.</dd>

<dt>`dontFix`</dt>

<dd>Don't worry about this. It's not relevant to this discussion.</dd>

</dl>

In Dojo 1.7, `connect.connect()` follow this recipe:

1.  Normalises the input parameters, to handle any that were set to `null` or left undefined
2.  **Hitch the `method` to the `context`**
3.  If `obj` is not a DOM node, then use `aspect.after()` to attach the Listener to the Action
4.  If `obj` _is_ a DOM node, do some clean up for the `event` to ensure that cross-browser support works and then use `on()` to attach the Listener to the Action

If you've already moved away from using `connect.connect()`, you're probably using `lang.hitch()` yourself, to ensure that your Listener is called in the context of its providing object. Here's where you can get into problems. To understand why, though, lets look at how `aspect.*` works.

## Dojo aspect

The Dojo [aspect API](http://dojotoolkit.org/api/dojo/aspect) defines three functions: `before`, `after` and `around`. They have very similar signatures:

    aspect.before(target,methodName,advice)
    aspect.around(target,methodName,advice)
    aspect.after(target,methodName,advice,receiveArguments)

<dl>

<dt>`target`</dt>

<dd>This is the object that is being targeted with the advice.</dd>

<dt>`methodName`</dt>

<dd>This is the method of the `target` that is being targeted with the advice.</dd>

<dt>`advice`</dt>

<dd>This is the function to be called at a time indicated by the `aspect.*` method. More often than not, this will be a method that has been hitched to another object.</dd>

<dt>`receiveArguments`</dt>

<dd>This just controls whether the `after` advice receives the arguments that were passed to `methodName`</dd>

</dl>

The way that Dojo handles this is to create a dispatch Function that creates a linked list of Function objects. The `before` advice comes first, then the targeted method, then the `after` advice. A little more work is needed for `around` advice, but the principle remains the same.

# How it all works

In Javascript, an Object is simply an [associative array](http://en.wikipedia.org/wiki/Associative_array) with some special features. The keys of the Object are the field names and method names. The values of the Object are the field values and Function objects. In the image below, you can see a representation of the two objects created in our code sample:

![Basic object diagram]({{ site.github.url }}/assets/basic_objects.jpg)

You can see the Function objects represented as rounded rectangles. Plain rectangles represent variable names.  
Whenever a call is made to `bar.anotherMethod`, the `anotherMethod` Function object is called, with `bar` as the context.

In the next diagram, we create our reference to `bar.anotherMethod`. When this happens, Javascript looks to see what `bar.anotherMethod` points to and points `barAM` to that. The little `bar` on the arrow tells us that this is a hitch and that the context for this call will be `bar`.  
At this point, you can see that a call to `bar.anotherMethod` and `barAM` will be identical. They point to the same Function object and will be called with the same context.

![Initial hitch]({{ site.github.url }}/assets/reference.jpg)

Next, we perform our `connect`, which is just an `aspect.after`. Here's where the problem kicks in.

![Initial connect]({{ site.github.url }}/assets/connect.jpg)

When the `aspect.after` is performed, Dojo replaces the `anotherMethod` Function with the `DISPATCHER` function that handles all of the AOP magic. Now, `bar.anotherMethod` points to `DISPATCHER`. `DISPATCHER`'s job is to call all of the `aspect.before` Functions, then the Function that is being advised (in this case `anotherMethod`) and then the `aspect.after` functions. (We're ignoring `aspect.around` here, just for diagrammatic clarity... it doesn't alter the explanation). You can see here, that `barAM` and `bar.anotherMethod` no longer point to the same thing.

Now, we add our second hitch:

![Second hitch]({{ site.github.url }}/assets/reference2.jpg)

Now, `bar.anotherMethod` is pointing to the AOP dispatcher, so that's what `barAM2` points to. When we connect our second method:

![Second connect]({{ site.github.url }}/assets/connect2.jpg)

`bar.anotherMethod` and `barAM2` are still pointing to the same thing. That explains what we saw in our console. Once AOP advice has been attached to a method, any newly created references to this method will see any advice attached **after** that reference is made

# Conclusions

So what conclusions can we draw here?

The crucial one is that any references made to an object method _before_ connections are made or AOP advice is attached will, when called, **NOT** result in these attachments being called.

Since the very nature of web-apps results is asynchronous, you often cannot guarantee the order of execution of code. In addition, future modifications to your code base, could result in these incompatible hitches and connections being made. This can lead to very tricky bugs.

So how do we avoid this? Luckily, it's really easy. `hitch` allows you to provide a `method` as a String, rather than a Function. When you do this, your reference points to the method in a different way:

![Safe hitch]({{ site.github.url }}/assets/safe_hitch.jpg)

Your code would now look like:

<pre lang="javascript" line="46">var barAM = lang.hitch(bar, "anotherMethod");
</pre>

Any time you make a call to your hitched Function, it has to look up `bar["aMethod"]`. Therefore, any changes to where this points are picked up by your hitched reference. This does have a minor penalty performance, but it makes your code **way** more robust, so it's worth the cost.

So, in summary: whenever you create a hitch, either explicitly, or (as in the case of `connect`) implicitly, do so with the method as a String, rather than a Function. If you don't, you may end up observing unexpected behaviour, once AOP comes in to play.
