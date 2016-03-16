---
layout: post
title: Handling arbitrary sort order in a database table
date: 2011-03-27 22:15:41.000000000 -05:00
type: post
published: true
status: publish
categories:
- Database
- Programming
tags: []
---
There are times when your web application needs to retain an arbitrary sort order for object. For example, you may have a slideshow of photographs and you want to be able to arrange them in any order you like. The simplest way to do this is to assign an attribute to each object that explicitly represents its sort position.

This raises the question, when you decide to move an object to a new position in the sort order, what is the simplest way to update the other objects to ensure that you maintain consecutive sort positions.

Imagine the following SQL table:

```sql
CREATE TABLE "projects" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name" VARCHAR(255),
    "sort_order" INTEGER UNSIGNED
);
```

The 'sort_order' field contains a simple integer that indicates the position that the object should appear in. To get the 'projects' in the desired order, you'd execute:

<pre lang="mysql">SELECT * FROM projects ORDER BY sort_order DESC</pre>

To move an object from one position to another is a fairly simple operation. Each object has a unique (and immutable) "id".  An appropriate method signature would be something like this:

<pre lang="ruby">def change_sort_location(object_id, new_location)</pre>

The following steps should be followed:

1.  Identify the current location of the objects as `old_location`
2.  If `old_location < new_location`
    1.  Subtract 1 from `sort_order` for all objects where `old_location < sort_order ≤ new_location`
3.  If `new_location < old_location`
    1.  Add 1 to `sort_order` for all objects where `new_location < sort_order ≤ old_location`
4.  Set `sort_order` for the provided `id` to `new_location`

The SQL for this is pretty straightforward:

```sql
UPDATE projects SET sort_order = sort_order-1
  WHERE sort_order > @old_location AND sort_order <= @new_location
```

or

```sql
UPDATE projects SET sort_order = sort_order+1
  WHERE sort_order > @new_location AND sort_order <= @old_location
```

followed by

```sql
UPDATE projects SET sort_order = @new_location
  WHERE id = @object_id
```

Clearly, in a full implementation, you'd probably not be using SQL variables, but the point stands.

One complaint might be that the object that is getting moved can get updated twice here, but that's unlikely to be a major performance impact.

Currently, once object move requires 2 SQL queries. _N_ object moves will require _2N_ SQL queries. I'm currently trying to figure out a method to reduce the number of SQL queries needed for multiple moves.
