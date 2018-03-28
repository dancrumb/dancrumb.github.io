---
layout: post
type: post
comments: true
categories:
 - Engineering
 - Facebook
---
Last year, I deleted my Facebook account. It was great for many reasons.
I avoided a lot of toxic chatter and found better ways to fritter my time away.

I have since returned because there is no avoiding that fact that it is the
prime tool that many of my friends and acquaintances plan events. I very nearly
missed an enjoyable NYE party due to being off Facebook and have since
attended a number events that I would have otherwise missed.

However, I'm sliding into bad habits and I needed a way to prevent that.
Facebook is very well designed to get its hooks into you, but today, I found
a way to temper its impact.

In short, I want to make the feed go away.

Here's how: _User Stylesheets_.

For the uninitiated, web sites use a language call CSS to create files call
_stylesheets_ that tell the browser how it should display the pages you visit. 
Everything from the colour
of some text, to the location of a box to the shape of your cursor when
you roll over a button are controllable via CSS.

Critically, the visibility of a thing can also be controlled.

A User Stylesheet is one that you create (rather than the website designer) and it can
be applied to any site you like.

So, with a very simple piece of code, I can make the feed disappear:

```css
[role='feed'] {
    display: none;
}
```

When I apply this to https://facebook.com, the Feed disappears! HOORAY!!

Now, how do I tell my browser to load my CSS whenever I visit Facebook? For that, you're
going to need a browser extension.

I use an extension called Stylish which is available on 
[Chrome](https://chrome.google.com/webstore/detail/stylish-custom-themes-for/fjnbnpbmkenffdnngjfgmeleoegfcffe),
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/stylish/),
[Safari](https://safari-extensions.apple.com/details/?id=com.sobolev.stylish-5555L95H45) and
[Opera](https://addons.opera.com/en-gb/extensions/details/stylish/).

Once you have installed the plugin, you can install my little CSS file from the 
[UserStyles site](https://userstyles.org/styles/157707/facebook-no-feed).

Now, whenever I visit, I don't get inundated with the feed, but I can still see events, still
use the Messenger and even still create posts and updates.
