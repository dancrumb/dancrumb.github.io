---
layout: post
type: post
comments: true
categories:
 - Engineering
 - Agile
---
An offhand comment from a colleague alerted me to a common misconception that abounds among some Product Owners.

_Technical Debt_ is a term that is used a lot in the software industry. Unfortunately, like many terms in our industry, it is used loosely
to mean many things, as if it doesn't actually have a definition.

The kicker with Technical Debt, is that its definition is hard to grasp. This is a shame, because it's a powerful concept and it has
the power to bring previously productive organizations to a grinding halt if it's not recognized and dealt with sensibly.
In addition, a misunderstanding of its meaning can perpetuate its negative impact while resources are being wasted trying to address it
in ineffectual ways.

If you take nothing more than this away, know this:

> Bugs are not Technical Debt

Bugs can be the result of Technical Debt, but they are not the same thing.

Also:

> You cannot determine the scope of your technical debt by having QA run tests

As before, QA teams can identify some consequences of Technical Debt, but it's a much more subtle and insidious thing.

## What is Technical Debt?
Technical Debt is a metaphor that captures the deferral of costs associated with writing software quickly to get a feature completed at
the expense of the long term cost of that feature.

It's based on the idea of monetary debt. It's not inherently good or bad. If debt is managed well, it can bring about expedient access
to otherwise unreachable things.

As with monetary debt, Technical Debt carries a cost and, if not well looked after, this cost can grow and grow until all your efforts
are spent simply servicing the debt without actually moving forward.

Martin Fowler writes nicely about [different types of Technical Debt](1). What he generously calls "Reckless & Inadvertent" Technical Debt,
I would just call crappy engineering

## Why are Bugs not Technical Debt?
Technical Debt is used to get features out the door quickly. Rapid development can lead to bugs, so it's certainly true that bugs
can be caused by Technical Debt. The subtle killer here is that you can have bug free code that is riddled with Technical Debt.

The Technical Debt only becomes apparent when you try to change part of the system and discover that, due to bad design, changes in
one area of code raises problems in other areas. Again, bugs are attendant to Technical Debt, but they are not the same.

Technical Debt is the latent cost of delivering new features without breaking old one.

Thus, scouring your application for bugs is a fools errand, if you're searching for Technical Debt. Instead, stay on top of it or, if you're trying
to fix old mistakes, set aside time for experienced engineers to review the code, either manually or with the help of static analysis tools
that can spot common problems, and assess the current state of play.

## How to avoid this

Don't make a mess

Simple as that really. Technical Debt is fine if you're careful about it. Be aware that you're making compromises that you'll want to
address later and build accordingly. Also, make sure you're being deliberate and prudent.

Leaving out tests is not Technical Debt. It's crappy engineering.

Skipping design is not Technical Debt. It's crappy engineering.

Test well, design carefully and you'll find you get a favourable interest rate on that Technical Debt and you'll be able to pay it down easily.



  [1]: http://martinfowler.com/bliki/TechnicalDebtQuadrant.html
