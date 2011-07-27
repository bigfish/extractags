/*global collection */

Ext.require('collection.Set', function () {

    var animals = new collection.Set({
        _members: ['heron', 'lizard']
    });

    console.log(animals.members());

    var mammals = new collection.Set({
        _members: ['cat']
    });
    console.log(mammals.members());

    var dogs = new collection.Set({
        _members: ['StBernard', 'Greyhound']
    });

    console.log(dogs.members());

    //add subset
    mammals.add(dogs);
    var subsets = mammals.subsets();
    console.log("mammal subsets: ", subsets);
    console.log("mammal members: ", mammals.members(true));

    animals.add(mammals);
    console.log("animal subsets: ", animals.subsets());
    console.log("animal subsets(true): ", animals.subsets(true));
    console.log("animal members: ", animals.members());
    console.log("animal members(true): ", animals.members(true));

    //add member to subset
    dogs.add('Chihuahua');
    console.log("animal members(true): ", animals.members(true));

    //remove
    dogs.remove('StBernard');
    console.log("animal members(true): ", animals.members(true));
    console.log("animal contains('Chihuahua') non-recursive: ", animals.contains('Chihuahua'));
    console.log("animal contains('Chihuahua'): ", animals.contains('Chihuahua', true));
});
