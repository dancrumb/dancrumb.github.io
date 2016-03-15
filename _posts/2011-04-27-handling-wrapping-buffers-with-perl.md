---
layout: post
title: Handling wrapping buffers with Perl
date: 2011-04-27 20:14:48.000000000 -05:00
type: post
published: true
status: publish
categories:
- perl
- Programming
tags:
- buffer
- perl
- sample code
meta:
  aktt_notify_twitter: 'yes'
  _edit_last: '1'
  aktt_tweeted: '1'
author:
  login: admin
  email: dancrumb@gmail.com
  display_name: dancrumb
  first_name: ''
  last_name: ''
---
I'm currently working on some Perl that processes memory dumps from a hardware appliance.

Frequently, within these dumps, I'm face with a buffer that wraps. That is to say, each entry in the buffer is filled and, once the buffer is full, the next entry to be filled is the first, again (overwriting the old value).

At the point in time that the dump is taken, there is an index value that points to the 'start' of this buffer (i.e. the point in the buffer that is the oldest). Unfortunately, when Perl gets hold of the buffer, it represents it as an array, with the first entry in the array being the buffer entry with the lowest memory address.

So... given an array representing a buffer and an index to the logical start of the buffer, what's the simplest way to rejig it, so that the array represents the logical order of the buffer instead of the physical order?

Voila:

<pre lang="perl">splice @buffer, 0, 0, (splice @buffer, $start_index);
</pre>
