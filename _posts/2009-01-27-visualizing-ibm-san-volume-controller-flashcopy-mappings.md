---
layout: post
title: Visualizing IBM SAN Volume Controller FlashCopy Mappings
date: 2009-01-27 18:34:44.000000000 -06:00
type: post
published: true
status: publish
categories:
- Storage
- Work
tags:
- Papers
- Storage
- SVC
- Visualization
meta:
  _edit_last: '1'
author:
  login: admin
  email: dancrumb@gmail.com
  display_name: dancrumb
  first_name: ''
  last_name: ''
---
[![disk]({{ site.github.url }}/assets/disk1.jpg "disk")](/wp-content/uploads/2009/01/disk1.jpg)

Last week, I completed a paper on [Visualizing SAN Volume Controller FlashCopy Mapping](/papers/visualfcms/visualisefcms.pdf).

SAN Volume Controller (SVC), for those who don't know, is a block level, in-band, storage virtualization appliance. FlashCopy is a function of SVC which allows you to take instant copies of a whole volume, capturing a single point in time.

As an SVC environment grows, disks become copies of disks and one disk can have multiple disks copied from it. This paper discusses a method to visualize these relationships graphically so that a Storage Administrator can understand the state of his system at a glance.

The paper also acts as a demonstration of automation of the SVC Command Line Interface, with the hope that readers will go on to write their own scripts for their own automation purposes.
