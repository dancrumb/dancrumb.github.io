---
layout: post
title: A History of Languages
date: 2009-02-15 19:30:22.000000000 -06:00
type: post
published: true
status: publish
categories:
- Home
- preDevCamp
- Programming
tags:
- assembler
- basic
- C
- java
- Javascript
- korn shell
- languages
- perl
- Programming
- python
---
![Laptop and Books]({{ site.github.url }}/assets/laptopAndBooks.jpg "Laptop and Books")

I saw [@mhat](http://twitter.com/mhat)'s tweet today about '[What language should I learn](http://twitter.com/mhat/status/1212746649)'  and it got me thinking about the times I've asked that question and how I might answer it. So, @mhat, I'm taking your tweet to be a challenge to write an unbiased and 'unwrong' post. To do this, I'm going to give you a history of the languages I have learned.  

## The early years

As I wrote in [my first post](/home/work/2009/01/25/all-geekness-great-and-small.html), I started at a tender age, on a ZX Spectrum. The Spectrum came with a dialect of BASIC, called 'Sinclair Basic'. Like all [BASIC](http://en.wikipedia.org/wiki/BASIC_programming_language) derivatives, it's a high level language, however unlike modern flavours of BASIC, it was untyped and unstructured. Lines of code were entered with the line number provided explicitly. There was no variable scoping and subroutines were implemented as a special 'GOTO' called 'GOSUB' which allowed you to 'RETURN' to the next line. However, since there was no variable scoping, recursion was impossible.

That said, I was 5 at the time, I wasn't too worried about recursion at the time. My programming was limited to copying code out of books containing page after page of ZX Spectrum programs. My brother and I would diligently type these out, then play the game for a while and then start playing with the code to see what changes we could make. This process was about as successful as genetic mutation. More often than not, our change would kill the program, but sometimes it would lead to great stuff.

As we got older, our 48K Spectrum was replaced with a 128K Spectrum. Along with the extra memory, came an update to BASIC to include keywords that allowed direct access to the MIDI chip. I continued to mess around with BASIC, making programs that would play both hands of a piano score, as well as simple games.

## The IBM PC arrives

My first experience with an IBM PC was the 286\. I migrated from Sinclair BASIC to [GW-BASIC](http://en.wikipedia.org/wiki/Microsoft_GW-BASIC_interpreter). At this point, I was writing programs from scratch, including a text adventure called 'Loup-Garou Chateau'. Tragically, this game has been lost from prosperity, but it was my first foray into actually _designing_ a program before coding it. I chose GW-BASIC, simply because I was very familiar with BASIC and it made for the simplest transition.

As the years passed, I would inherit my dad's old computers, moving up through the 386 to the 486\. At this point, I got my hands on [Visual Basic](http://en.wikipedia.org/wiki/Visual_Basic). Again, this transition was driven by the ease of transition from what I knew to something new. This was my first experience with a proper development IDE, as well as my first experience with creating GUIs. Beyond that, it wasn't a great step forward to me... that would come during university.

## Coding gets hardcore

I never studied computing at university; I was a physics student. However, the course I took, included some small computing components. For one lab rotation, we learned how to use computers for physical analysis. This was back in 2000 and they had us coding with [Pascal](http://en.wikipedia.org/wiki/Pascal_(programming_language)). At the same time, I was playing with [C](http://en.wikipedia.org/wiki/C_(programming_language)) at the suggestion of my dad. For the first time, I was learning about functions and variable typing. In addition, I was programming with the intention to solve problems that were being presented to me, instead of just 'playing' with a language and seeing what it could do. When you have an externally provided problem to solve, you're forced to learn how to use new facets of the language. If you're just playing around, you can be limited to seeing what you can do with the parts of the language you understand.

While at university, I also participated in an Electronics lab which involved learning about the 8086 processor. We had an experimental board which allowed us to commit opcodes to a region of memory and then execute them. As part of the practical, we actually had to wire up the SUB instruction, by running the clock signal through the appropriate logic gates and to the appropriate ALU pins. This was my first experience with the lowest level of programming.

In the summer between my second and third years, I spent four weeks working for [Milford Instruments](http://www.milinst.com/). While there, I developed a [DMX-512 Transceiver Controller](http://www.ppmilinst.redcetera.com/shop/DMX/pdf/1_463.pdf). I was working with the SX-Chip from Parallax and learned how to write assembler, how to work with interrupt handlers and how to get microcontrollers to talk to other microchips. For 4 weeks, I worked on the firmware and the hardware and really learned what programming was all about...

![]({{ site.github.url }}/assets/computerCode.jpg "Computer Code")

## Coding starts to bring in money

My month at Milford Instruments made me realise what I wanted to do with my time; I wanted to get into development professionally. It was an obvious choice to apply to IBM and I started working at their Hursley Development Lab, one weeks after school ended. They had me working on a protocol converter, (this time, a SCSI-SSA converter) and, as before, it was coded in assembler.

After a couple of years working on this, I moved to work on one of their Storage RAID controllers. This time I was coding in C, the first time I had done so, professionally. However, alongside all this production code, I was steadily learning how to write [Perl](http://en.wikipedia.org/wiki/Perl) and [Korn Shell](http://en.wikipedia.org/wiki/Korn_shell) scripts for developing test rigs. I was also teaching myself how to code for the web. I'd done some basic page development while at university, but I was beginning to learn about dynamic pages and DOM manipulation.

My next move got me into support and I started writing a web-based support tool. It uses Perl and [MySQL](http://en.wikipedia.org/wiki/MySQL) in the back-end and HTML and Javascript in the front-end.

The main thing I got from the IBM Development Lab was the chance to be surrounded by people writing a wide variety of code to solve a wide variety of problems and be exposed to what other people were doing with languages that I both knew and that I had never heard of. I learned that there is really no such thing as the one perfect language, rather the best language for the job in hand.

## What's the point of all this?

So, what's the point of this post? Is it possible to write a post about "Which language should I use" that is not biased and has some value? I hope so. Here's what I feel I've learned over the years.

People write code for a wide variety of reasons. The language that they code in is also determined by a multitude of factors. More often than not, we don't have a truly free hand when it comes to choosing the language we're coding in. However, looking back, I believe I see some benefits in the track I took.

*   Learning C allows you to truly understand what higher level languages such as Perl or Java are doing with objects and references. Although people get scared off by pointers, if you don't understand the concept, then you're going to struggle with the idea of references. Since all languages have variables, if you can get those nailed and totally understood, you're going to be in good stead when you move to a language which brings new data types
*   Learning Assembler allows you to truly understand what C is doing with pointers. Assembler has a tiny command set and you have to tell it to do every last thing. It's a struggle, but once you've got assembler in your tool belt you're in good shape. You may never go back to it, but the lessons you learn from it can be applied all the way up the language stack
*   Learning a wide variety of languages allows you to truly understand the patterns of development that are language-independent and stops you falling into the trap of becoming a language bigot. There's nothing wrong with having a favourite language, but saying that one language is categorically better than another because of the presence of a specific feature is like praising Inuit for its wide variety of words for snow. That's fine if you're describing snow, but not much use if you want to discuss the surfing conditions in Hawaii.
*   Learning a language is a lot easier if you're trying to solve a specific problem that has come from an external source. This is why it's such a good idea to do the exercises if you're learning from a textbook. There's nothing wrong with playing with a feature for its own sake, but unless you have some factor that is external to the language driving you, it's going to be tough to learn all that the language can do.

## Did I just cop out?

So, did I just cop out of the question? If someone asked me what language they should learn, how would I answer? That depends on the person. If they were just starting out, I would say Perl or Python. These languages have a huge development community and millions of pages dedicated to coding in them. They are in common usage and show no signs of disappearing in the near future. They are neither arcane nor limited in their range and they allow for procedural and object oriented style programming, meaning that the developer can transition to OO without having to change languages.

If I was being asked by someone with a reasonable amount of development, I would strongly suggest Javascript. As the powerhouse behind Web 2.0 and the basis for coding on the Palm Pre, it's critical to know this language. However, testing and debugging Javascript is not a trivial task and requires a developer who is comfortable writing code that has 'a good chance' of working so that troubleshooting is limited to ironing out wrinkle. Also, the problems of cross-browser support are bewildering enough for experienced coders; exposing a brand new coder to Javascript would probably be the end of their efforts in the field.

If someone wanted to spread their wings a little, I'd strongly suggest taking a look at Assembler or some other microprocessor based language. It's still coding, but you're forced to truly understand your code's interaction with external factors that don't care about your nice neat program. Spending time debugging microprocessor code; especially code that interacts with an external piece of hardware, gives you a true understanding of the many ways that code can fail to work.
