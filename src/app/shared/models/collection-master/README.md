# Collection

Collection is a light-weight implementation of Laravel's collection.

We created this library to work easily with datas from an API end.
That means we implemented the methods to work well with objects-in-array structure, like ``[{}, {}, {}]``.

## Gettings Started

You can download the repo and add it to your project. Then you can import the collection function.

```js
import { collection } from './Collection';
window.collection = collection;
```

## Methods
Please note, not all the methods are implemented yet!
Also, there are some minor changes compared to Laravel's collection.

In the docs and the code as well, we use both ``key`` and ``index`` expressions.
If we use ``key``, it refers to objects, like ``{}``, if we use ``index``, it refers to arrays, like ``[]``.

### Available Methods
- [``all``](#all)
- [``average``](#average)
- [``avg``](#avg)
- [``chunk``](#chunk)
- [``clear``](#clear)
- [``clone``](#clone)
- [``concat``](#concat)
- [``contains``](#contains)
- [``count``](#count)
- [``diff``](#diff)
- [``each``](#each)
- [``every``](#every)
- [``except``](#except)
- [``filter``](#filter)
- [``first``](#first)
- [``forget``](#forget)
- [``get``](#get)
- [``has``](#has)
- [``implode``](#implode)
- [``isEmpty``](#isempty)
- [``isNotEmpty``](#isnotempty)
- [``keys``](#keys)
- [``last``](#last)
- [``map``](#map)
- [``max``](#max)
- [``median``](#median)
- [``merge``](#merge)
- [``min``](#min)
- [``mode``](#mode)
- [``nth``](#nth)
- [``only``](#only)
- [``pluck``](#pluck)
- [``pop``](#pop)
- [``prepend``](#prepend)
- [``push``](#push)
- [``pull``](#pull)
- [``random``](#random)
- [``reduce``](#reduce)
- [``reject``](#reject)
- [``reverse``](#reverse)
- [``search``](#search)
- [``shift``](#shift)
- [``reverse``](#reverse)
- [``shuffle``](#shuffle)
- [``slice``](#slice)
- [``sort``](#sort)
- [``sortDesc``](#sortdesc)
- [``sortBy``](#sortby)
- [``sortByDesc``](#sortbydesc)
- [``splice``](#splice)
- [``split``](#split)
- [``take``](#take)
- [``tap``](#tap)
- [``times``](#times)
- [``toJson``](#tojson)
- [``transform``](#transform)
- [``unique``](#unique)
- [``where``](#where)
- [``whereIn``](#wherein)
- [``whereNotIn``](#wherenotin)

### Unimplemented Methods
- [``collapse``](https://laravel.com/docs/5.5/collections#method-collapse)
- [``combine``](https://laravel.com/docs/5.5/collections#method-combine)
- [``containsStrict``](https://laravel.com/docs/5.5/collections#method-containsstrict)
- [``crossJoin``](https://laravel.com/docs/5.5/collections#method-crossjoin)
- [``dd``](https://laravel.com/docs/5.5/collections#method-dd)
- [``diffAssoc``](https://laravel.com/docs/5.5/collections#method-diffassoc)
- [``diffKeys``](https://laravel.com/docs/5.5/collections#method-diffkeys)
- [``dump``](https://laravel.com/docs/5.5/collections#method-dump)
- [``eachSpread``](https://laravel.com/docs/5.5/collections#method-eachspread)
- [``flatMap``](https://laravel.com/docs/5.5/collections#method-flatmap)
- [``flatten``](https://laravel.com/docs/5.5/collections#method-flatten)
- [``flip``](https://laravel.com/docs/5.5/collections#method-flip)
- [``forPage``](https://laravel.com/docs/5.5/collections#method-forpage)
- [``intersect``](https://laravel.com/docs/5.5/collections#method-intersect)
- [``intersectByKeys``](https://laravel.com/docs/5.5/collections#method-intersectbykeys)
- [``keyBy``](https://laravel.com/docs/5.5/collections#method-keyby)
- [``macro``](https://laravel.com/docs/5.5/collections#method-macro)
- [``make``](https://laravel.com/docs/5.5/collections#method-make)
- [``mapInto``](https://laravel.com/docs/5.5/collections#method-mapinto)
- [``mapSpread``](https://laravel.com/docs/5.5/collections#method-mapspread)
- [``mapToDictionary``](https://laravel.com/docs/5.5/collections#method-maptodictonary)
- [``mapToGroups``](https://laravel.com/docs/5.5/collections#method-maptogroups)
- [``mapWithKeys``](https://laravel.com/docs/5.5/collections#method-mapwithkeys)
- [``pad``](https://laravel.com/docs/5.5/collections#method-pad)
- [``particion``](https://laravel.com/docs/5.5/collections#method-partition)
- [``pipe``](https://laravel.com/docs/5.5/collections#method-pipe)
- [``pad``](https://laravel.com/docs/5.5/collections#method-pad)
- [``put``](https://laravel.com/docs/5.5/collections#method-put)
- [``toArray``](https://laravel.com/docs/5.5/collections#method-toarray)
- [``union``](https://laravel.com/docs/5.5/collections#method-union)
- [``uniqueStrict``](https://laravel.com/docs/5.5/collections#method-uniquestrict)
- [``unless``](https://laravel.com/docs/5.5/collections#method-unless)
- [``unwrap``](https://laravel.com/docs/5.5/collections#method-unwrap)
- [``values``](https://laravel.com/docs/5.5/collections#method-values)
- [``whereStrict``](https://laravel.com/docs/5.5/collections#method-wherestrict)
- [``whereStrict``](https://laravel.com/docs/5.5/collections#method-wherestrict)
- [``whereInStrict``](https://laravel.com/docs/5.5/collections#method-whereinstrict)
- [``whereNotInStrict``](https://laravel.com/docs/5.5/collections#method-wherenotinstrict)
- [``wrap``](https://laravel.com/docs/5.5/collections#method-wrap)
- [``zip``](https://laravel.com/docs/5.5/collections#method-zip)

#### ``all()``
The ``all`` method returns the underlying array represented by the collection:

```js
collect([1, 2, 3, 4]).all(); // [1, 2, 3, 4]
```

#### ``average()``
Alias for the ``avg`` method.

#### ``avg()``
The ``avg`` method returns the average value of a given key:

```js
collect([1, 2, 3, 4]).avg(); // 2.5

collect([{price: 1}, {price: 2}, {price: 3}]).avg('price'); // 2
```

#### ``chunk()``
The ``chunk`` method breaks the collection into multiple, smaller collections of a given size:
> This method does not modifies the original collection!

```js
collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).chunk(3);

// [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
```

#### ``clear()``
The ``clear`` method removes all the items from the collection:
> This method modifies the original collection!
>
> This method is not implemented in Laravel's collection!

```js
collect([1, 2, 3, 4, 5, 6]).clear(); // []
```

#### ``clone()``
The ``clone`` method clones the collection instance:
> It's like moment.js' clone method.
>
> This method is not implemented in Laravel's collection!

```js
let original = collect([1, 2, 3, 4, 5, 6]);

original.clone().all(); // [1, 2, 3, 4, 5, 6]
```

#### ``concat()``
The ``concat`` method appends the given array or collection values onto the end of the collection:
> You may use ``merge`` instead of ``concat`` to have unique values after concatnation.

```js
let concatnated = collect([1, 2, 3, 4, 5]).concat([1, 2, 6, 7, 8]);

concatnated.all(); // [1, 2, 3, 4, 1, 2, 6, 7, 8]
```

#### ``contains()``
The ``contains`` method determines whether the collection contains a given item:

```js
collect([1, 2, 3, 4, 5]).contains(5); // true

collect([1, 2, 3, 4, 5]).contains(6); // false
```

#### ``count()``
The ``count`` method returns the total number of items in the collection:

```js
collect([1, 2, 3, 4]).count(); // 4
```

#### ``diff()``
The ``diff`` method compares the collection against another collection or an array based on its values.
This method will return the values in the original collection that are not present in the given collection:
> This method does not modify the original collection.

```js
let diff = collect([1, 2, 3, 4, 5, 6, 7]).diff([1, 2, 6, 7]);

diff.all(); // [3, 4, 5]
```

#### ``each()``
The ``each`` method iterates over the items in the collection and passes each item to a callback.
If you would like to stop iterating through the items, you may return ``false`` from your callback:

```js
collect([1, 2, 3, 4, 5, 6, 7, 8]).each((item, index) => {
    if (item > 5) return false;
});
```

#### ``every()``
The ``every`` method may be used to verify that all elements of a collection pass a given truth test:

```js
collect([1, 2, 3, 4, 5, 6, 7, 8]).every((item, index) => item > 3);

// false
```

#### ``except()``
The ``except`` method returns all items in the collection except for those with the specified keys:
> This method works only with object '{}' items.
>
> This method does not modify the original collection.
>
> For the inverse of ``except``, see the ``only`` method.

```js
let except = collect([
    {name: 'Adam', role: 'Front-end dev', site: 'pineco.de'},
    {name: 'Gergo', role: 'Back-end dev', site: 'pineco.de'}
]).except(['role', 'site']);

except.all() // [{name: 'Adam'}, {name: 'Gergo'}]
```

#### ``filter()``
The ``filter`` method filters the collection using the given callback, keeping only those items that pass a given truth test:
> If no callback is supplied, all entries of the collection that are equivalent to false will be removed.
>
> This method does not modify the original collection.
>
> For the inverse of ``filter``, see the ``reject`` method.


```js
let filtered = collect([1, 2, 3, 4, 5, 6, 7, 8]).filter((item, index) => item > 3);

filtered.all(); // [4, 5, 6, 7, 8]
```

#### ``first()``
The ``first`` method returns the first element in the collection that passes a given truth test.
You may also call the first method with no arguments to get the first element in the collection:
>  If the collection is empty, ``null`` is returned.

```js
collect([1, 2, 3, 4]).first((item, index) => item > 2); // 3

collect([1, 2, 3, 4]).first(); // 1
```

#### ``forget()``
The forget method removes an item from the collection by its index:
> Multiple indexes are accepted.
>
> This method modifies the original collection!

```js
let items = collect([1, 2, 3, 4, 5, 6, 7, 8]);

items.forget(7);
items.forget([0, 1, 2]);

items.all(); // [4, 5, 6, 7]
```

#### ``get()``
The ``get`` method returns the item at a given index. If the index does not exist, ``null`` is returned.
You may optionally pass a default value as the second argument.
You may even pass a callback as the default value.
The result of the callback will be returned if the specified key does not exist:
> It accepts "nested" index / keys combinations as well, via dot notation.

```js
let members = collect([
    {name: 'Adam', role: 'Front-end dev', site: 'pineco.de'},
    {name: 'Gergo', role: 'Back-end dev', site: 'pineco.de'}
]);

members.get('0');  // {name: 'Adam', role: 'Front-end dev', site: 'pineco.de'}

members.get('0.name'); // Adam

members.get('1.location', 'Budapest'); // Budapest
```

#### ``has()``
The ``has`` method determines if a given index exists in the collection:

```js
collect([1, 2, 3]).has(0); // true

collect([1, 2, 3]).has(3); // false
```

#### ``implode()``
The ``implode`` method joins the items in a collection.
Its arguments depend on the type of items in the collection.
If the collection contains objects, you should pass the key of the attributes you wish to join, and the "glue" string you wish to place between the values:

```js
collect([1, 2, 3]).implode('-'); // 1-2-3

collect([{name: 'Gergo'}, {name: 'Adam'}]).implode('name', '*'); // Gergo*Adam
```

#### ``isEmpty()``
The ``isEmpty`` method returns ``true`` if the collection is empty; otherwise, ``false`` is returned:

```js
collect([]).isEmpty(); // true
```

#### ``isNotEmpty()``
The ``isNotEmpty`` method returns ``true`` if the collection is not empty; otherwise, ``false`` is returned:

```js
collect([]).isNotEmpty(); // false
```

#### ``keys()``
The ``keys`` method returns all of the collection's indexes:

```js
let keys = collect([{name: 'Gergo'}, {name: 'Adam'}]).keys();

keys.all(); // [0, 1]
```

#### ``last()``
The ``last`` method returns the last element in the collection that passes a given truth test.
You may also call the last method with no arguments to get the last element in the collection:
> If the collection is empty, ``null`` is returned.

```js
collect([1, 2, 3, 4]).last((item, index) => item < 3); // 2

collect([1, 2, 3, 4]).last(); // 4
```

#### ``map()``
The ``map`` method iterates through the collection and passes each value to the given callback.
The callback is free to modify the item and return it, thus forming a new collection of modified items:
> This method does not modify the original collection!
>
>  If you want to transform the original collection, use the ``transform`` method.

```js
let mapped = collect([1, 2, 3, 4, 5]).map((item, index) => item * 2);

mapped.all(); // [2, 4, 6, 8, 10]
```

#### ``max()``
The ``max`` method returns the maximum value of a given key:

```js
collect([1, 6, 2, 4, 7, 8, 3]).max(); // 8

collect([{price: 200}, {price: 250}, {price: 300}]).max('price'); // 300
```

#### ``median()``
The ``median`` method returns the median value of a given key:

```js
collect([1, 2, 3, 4, 5, 6]).median(); // 3.5

collect([1, 2, 3, 4, 5]).median(); // 3

collect([{price: 1}, {price: 2}, {price: 3}]).median('price'); // 2

collect([
    {price: {normal: 2}},
    {price: {normal: 4}},
    {price: {normal: 10}}
]).median('price.normal'); // 4
```

#### ``merge()``
The ``merge`` method merges the given array or collection with the original collection:
> This method works differently than Laravel's.
>
> It's like basic array concatnation with unique values.
>
> Every duplicates will be removed in the new collection.
>
> You may use ``concat`` instead of ``merge`` to keep duplications after concatnation.

```js
let merged = collect([1, 2, 3, 4, 5]).merge([1, 2, 6, 7, 8]);

merged.all(); // [1, 2, 3, 4, 5, 6, 7, 8]
```

#### ``min()``
The ``min`` method returns the minimum value of a given key:

```js
collect([1, 6, 2, 4, 7, 8, 3]).min(); // 1

collect([{price: 200}, {price: 250}, {price: 300}]).min('price'); // 200
```

#### ``mode()``
The ``mode`` method returns the mode value of a given key:

```js
collect([1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5]).mode(); // 2

collect([
    {price: {normal: 2}},
    {price: {normal: 4}},
    {price: {normal: 4}}
]).mode('price.normal'); // 4
```

#### ``nth()``
The ``nth`` method creates a new collection consisting of every n-th element.
You may optionally pass an offset as the second argument:

```js
collect([1, 2, 3, 4, 5, 6, 7, 8]).nth(2); // [1, 3, 5, 7]

collect([1, 2, 3, 4, 5, 6, 7, 8]).nth(2, 1); // [2, 4, 6, 8]
```

#### ``only()``
The ``only`` method returns the items in the collection with the specified keys:
> This method works only with object ``{}`` items.
>
> This method does not modify the original collection.
>
> For the inverse of ``only``, see the ``except`` method.

```js
let except = collect([
    {name: 'Adam', role: 'Front-end dev', site: 'pineco.de'},
    {name: 'Gergo', role: 'Back-end dev', site: 'pineco.de'}
]).only(['role', 'site']);

except.all();

/*
    [
        {role: 'Front-end dev', site: 'pineco.de'},
        {role: 'Back-end dev', site: 'pineco.de'}
    ]
*/
```

#### ``pluck()``
The ``pluck`` method retrieves all of the values for a given key:
> This method works only with object ``{}`` items.
>
> You can pass nested keys as well.

```js
collect([
    {name: 'Product 1', meta: {weight: 300, sku: 'p_1'}},
    {name: 'Product 2', meta: {weight: 310, sku: 'p_2'}},
    {name: 'Product 3', meta: {weight: 320, sku: 'p_3'}},
    {name: 'Product 4', meta: {weight: 330, sku: 'p_4'}}
]).pluck('meta.weight');

// [300, 310, 320, 330]
```

#### ``pop()``
The ``pop`` method removes and returns the last item from the collection:
> This method modifies the original collection!

```js
let items = collect([1, 2, 3, 4, 5, 6]);

items.pop(); // 6

items.all(); // [1, 2, 3, 4, 5]
```

#### ``prepend()``
The ``prepend`` method adds an item to the beginning of the collection:
> This method modifies the original collection!

```js
let items = collect([1, 2, 3, 4, 5, 6]).prepend(0);

items.all(); // [0, 1, 2, 3, 4, 5, 6]
```

#### ``pull()``
The ``pull`` method removes and returns an item from the collection by its index:
> This method modifies the original collection!

```js
let items = collect([1, 2, 3, 4, 5, 6]);

items.pull(4); // 5

items.all(); // [1, 2, 3, 4, 6]
```

#### ``push()``
The ``push`` method appends an item to the end of the collection:
> This method modifies the original collection!

```js
let items = collect([1, 2, 3, 4, 5, 6]).push(7);

items.all(); // [1, 2, 3, 4, 5, 6, 7]
```

#### ``random()``
The ``random`` method returns a random item from the collection:

```js
let items = collect([1, 2, 3, 4, 5]);

items.random(); // 4 (retrieved randomly)
```

#### ``reduce()``
The reduce method reduces the collection to a single value, passing the result of each iteration into the subsequent iteration.
The value for ``carry`` on the first iteration is ``null``; however, you may specify its initial value by passing a second argument to ``reduce``:

```js
collect([1, 2, 3, 4, 5, 6]).reduce((carry, item) => carry + item); // 21

collect([1, 2, 3, 4, 5, 6]).reduce((carry, item) => carry + item, 10); // 31
```

#### ``reject()``
The ``reject`` method filters the collection using the given callback.
The callback should return ``true`` if the item should be removed from the resulting collection:
> This method does not modify the original collection!
>
> For the inverse of the ``reject`` method, see the ``filter`` method.

```js
let rejected = collect([1, 2, 3, 4, 5, 6, 7, 8]).reject((item, index) => item > 3);

rejected.all(); // [1, 2, 3]
```

#### ``reverse()``
The ``reverse`` method reverses the order of the collection's items:

```js
let reversed = collect([1, 2, 3, 4]).reverse();

reversed.all(); // [4, 3, 2, 1]
```

#### ``search()``
The ``search`` method searches the collection for the given value and returns its index if found.
If the item is not found, ``false`` is returned.
Alternatively, you may pass in your own callback to search for the first item that passes your truth test:

```js
collect([1, 2, 3, 4, 5, 6, 7, 8]).search(7); // 6

collect([1, 2, 3, 4, 5, 6, 7, 8]).search((item, index) => item > 6); // 6
```

#### ``shift()``
The ``shift`` method removes and returns the first item from the collection:
> This method modifies the original collection!

```js
let items = collect([1, 2, 3, 4, 5]);

item.shift(); // 1

items.all(); // [2, 3, 4, 5]
```

#### ``shuffle()``
The ``shuffle`` method randomly shuffles the items in the collection:
> This method does not modify the original collection!

```js
let shuffled = collect([1, 2, 3, 4, 5, 6, 7, 8]).shuffle();

shuffled.all(); // [4, 7, 8, 1, 3, 2, 6, 5] (randomly generated)
```

#### ``slice()``
The ``slice`` method returns a slice of the collection starting at the given index.
If you would like to limit the size of the returned slice, pass the desired size as the second argument to the method:

```js
collect([1, 2, 3, 4, 5]).slice(3); // [4, 5]

collect([1, 2, 3, 4, 5]).slice(1, 3); // [2, 3, 4]
```

#### ``sort()``
The ``sort`` method sorts the collection.
Alternatively, you may pass in your own callback to sort the items by a custom rule:
> This method does not modify the original collection!

```js
collect([9, 8, 10, 1, 5, 4]).sort(); // [1, 4, 5, 8, 9, 10]

collect([
    {price: 100},
    {price: 40},
    {price: 50}
]).sort((a, b) => a.price - b.price);

// [{price: 40}, {price: 50}, {price: 100}]
```

#### ``sortDesc()``
This method has the same signature as the ``sort`` method, but will sort the collection in the opposite order.

#### ``sortBy()``
The ``sortBy`` method sorts the collection by the given key.
> This method does not modify the original collection!

```js
collect([
    {price: 100},
    {price: 40},
    {price: 50}
]).sortBy('price');

// [{price: 40}, {price: 50}, {price: 100}]
```

#### ``sortByDesc()``
This method has the same signature as the ``sortBy`` method, but will sort the collection in the opposite order.

#### ``splice()``
The ``splice`` method removes and returns a slice of items starting at the specified index.
You may pass a second argument to limit the size of the resulting chunk.
In addition, you can pass a third argument containing the new items to replace the items removed from the collection:
> This method modifies the original collection!

```js
let original = collect([1, 2, 3, 4, 5, 6, 7, 8, 10]);

let chunk = original.splice(1, 3);

original.all(); // [1, 5, 6, 7, 8, 10]
chunk.all(); //  [2, 3, 4]

let replacer = original.splice(4, 2, [100, 200, 300]);

replacer.all() // [8, 10]
original.all() // [1, 5, 6, 7, 100, 200, 300]

let bigChunk = original.splice(2);

bigChunk.all(); // [6, 7, 100, 200, 300]
original.all(); // [1, 5]
```

#### ``split()``
The ``split`` method breaks a collection into the given number of groups:

```js
let items = collect([1, 2, 3, 4, 5]);

let groups = items.split(3); // [[1, 2], [3, 4], [5]]
```

#### ``sum()``
The ``sum`` method returns the sum of all items in the collection.
If the collection contains nested objects, you should pass a key to use for determining which values to sum.
In addition, you may pass your own callback to determine which values of the collection to sum:

```js
collect([1, 2, 3, 4, 5]).sum(); // 15

collect([
    {quantity: 2},
    {quantity: 3},
    {quantity: 5}
]).sum('quantity'); // 10

collect([
    {quantity: 2, price: 10},
    {quantity: 3, price: 15},
    {quantity: 5, price: 20}
]).sum(item => item.quantity * item.price); // 165
```

#### ``take()``
The ``take`` method returns a new collection with the specified number of items.
You may also pass a negative integer to take the specified amount of items from the end of the collection:

```js
let original = collect([0, 1, 2, 3, 4, 5]);

original.take(3); // [0, 1, 2]

original.take(-2); // [4, 5]
```

#### ``tap()``
The ``tap`` method passes the collection to the given callback, allowing you to "tap" into the collection at a specific point and do something with the items while not affecting the collection itself:

```js
collect([2, 4, 3, 1, 5])
    .sort()
    .tap(collection => {
        console.log(collection.all();trackBy: service.trackByFn);
    })
    .shift();

// 1
```

#### ``times()``
The ``times`` method creates a new collection by invoking the callback a given amount of times:

```js
let items = collect().times(10, item => item);

items.all(); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

#### ``toggle()``
The ``toggle`` method adds the given item to the collection if it is not present or removes it if it's in the collection.

```js
let items = collect([1, 2, 3, 4, 5]);

items.toggle(1); // [2, 3, 4, 5]

items.toggle(1); // [1, 2, 3, 4, 5]
```

#### ``toJson()``
The ``toJson`` method converts the collection into a JSON serialized string:

```js
collect([
    {quantity: 2, price: 10},
    {quantity: 3, price: 15},
    {quantity: 5, price: 20}
]).toJson();

// "[{"quantity":2,"price":10},{"quantity":3,"price":15},{"quantity":5,"price":20}]"
```

#### ``transform()``
The ``transform`` method iterates over the collection and calls the given callback with each item in the collection.
The items in the collection will be replaced by the values returned by the callback:
> This method modifies the original collection!
>
> If you wish to create a new collection instead, use the ``map`` method.

```js
let transformed = collect([1, 2, 3, 4, 5]);

transformed.transform((item, index) => item * 2);

transformed.all(); // [2, 4, 6, 8, 10]
```

#### ``unique()``
The ``unique`` method returns all of the unique items in the collection.
Also, you may provide a key for the counts of the same items.
If the items are objects, this count will be appended in the object as the given key.
Every match of the same item will increment the counter.
> This method does not modify the original collection!

```js
collect([1, 1, 2, 2, 3, 4, 2]).unique(); // [1, 2, 3, 4]

let unique = collect([
    {name: 'Item 1', price: 300},
    {name: 'Item 2', price: 288},
    {name: 'Item 1', price: 300},
    {name: 'Item 1', price: 300},
    {name: 'Item 2', price: 288}
]).unique('in_cart');

unique.all();

/*
    [
        {name: 'Item 1', price: 300, in_cart: 3},
        {name: 'Item 2', price: 288, in_cart: 2}
    ]
*/
```

#### ``where()``
The ``where`` method filters the collection by a given key / value pair:
> This method works only with object ``{}`` items.
>
> You can pass nested keys as well.

```js
let filtered = collect([
    {name: 'Item 1', price: 300},
    {name: 'Item 2', price: 300},
    {name: 'Item 3', price: 400},
    {name: 'Item 4', price: 450}
]).where('price', 300);

filtered.all();

/*
    [
        {name: 'Item 1', price: 300},
        {name: 'Item 1', price: 300}
    ]
*/
```

#### ``whereIn()``
The ``whereIn`` method filters the collection by a given key / value contained within the given array:

```js
let filtered = collect([
    {name: 'Item 1', price: 300},
    {name: 'Item 2', price: 300},
    {name: 'Item 3', price: 400},
    {name: 'Item 4', price: 450}
]).whereIn('price', [300, 400]);

filtered.all();

/*
    [
        {name: 'Item 1', price: 300},
        {name: 'Item 1', price: 300},
        {name: 'Item 3', price: 400}
    ]
*/
```

#### ``whereNotIn()``
The ``whereNotIn`` method filters the collection by a given key / value not contained within the given array:

```js
let filtered = collect([
    {name: 'Item 1', price: 300},
    {name: 'Item 2', price: 300},
    {name: 'Item 3', price: 400},
    {name: 'Item 4', price: 450}
]).whereNotIn('price', [300, 400]);

filtered.all();

// [{name: 'Item 4', price: 450}]
```
