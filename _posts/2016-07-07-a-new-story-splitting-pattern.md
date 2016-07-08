---
layout: post
type: post
status: publish
comments: true
categories:
 - Agile
---
A significant part of Agile development is figuring out how to make storiest smaller as part of refinement.

Back in 2009, Richard Lawrence wrote [a post, covering nine patterns](1) that
he uses to effectively split large stories into smaller ones.

To his nine patterns, I'd like to add a tenth that I've discovered through
working with Agile teams in the real world - teams that don't have the luxury of working
on pure Agile software products.

## External Dependencies
Sometimes a story involves integrating with a system that is outside of the development team's control.
Perhaps it involves integrating with an API that is under development (either by another team in the company or maybe
a customer). Perhaps it involves integrating with a system that is currently undergoing a great deal of change.

Traditionally, such a story is pretty much a non-starter for an Agile team as they would not be able to commit to it.

By applying the External Dependencies pattern, a team can split the riskiest parts of the original story out into its own story.
For instance:

> As a User, I can see live changes in the price of my favourite stock

Let's imagine that implementing this story, as defined, would require integration with an API that provides live stock
prices. Let's also imagine that this API has not yet been implemented and is owned by another team. 

Starting this story would be very risky, due to dependencies on another team.

Instead, the team could split this into:

> As a User, I can see past trends in the price of a selection of stocks

> As a User, I can see current trends in the price of my favourite stock

Implementing the first story no longer requires integration with the unfinished API. Past trends are effectively static, 
so the implementation is now bound to static data.

However, the development team can mock up an API that mimics the live data API and use this to access historical data.

This would allow the team to establish how the UI should behave without worrying too much about the mechanics
of getting live data. They can mock up the relevant API explicitly or via an API Gateway system.

Once the live data API is complete, they can attack the second story by either replacing their API with the new one or
by proxying the live API through their API gateway.

This approach allows the Product Owner to understand how the data will appear well in advance of having the live data API
giving greater opportunity for iteration.

Certainly, avoiding dependencies altogether is preferred, but when you're not that lucky, this is a great patterns to try
to reduce risk and reduce story size.

  [1]:http://agileforall.com/patterns-for-splitting-user-stories/
