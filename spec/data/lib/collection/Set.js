/*global collection */
/**
 * Set contains a collection of unique items
 * which may be of any type including Set. 
 * add() and remove() only affect 
 * the immediate members of the set
 * and will not affect members of sub-sets
 * members() returns the immediate members as an Array
 * members(true) returns members of subsets and their subsets 
 * contains(member) checks if a match is found in immediate members
 * contains(member, true) checks all subsets as well
 */

Ext.define('collection.Set', {

    extend: 'oop.InitProps',

    constructor: function (props) {
        this.callParent(this.applyProps(props, {
            _members: []
        }));
    },

    isSet: function () {
        return true;
    },

    contains: function (member, recursive) {
        var mem;
        if (recursive) {
            for (var i = 0; i < this._members.length; i++) {
                mem = this._members[i];
                if (mem === member) {
                    return true;
                } else if (mem.isSet) {
                    if (mem.contains(member, recursive)) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return Ext.Array.contains(this._members, member);
        }
    },

    add: function (member) {
        Ext.Array.include(this._members, member);
    },

    remove: function (member) {
        Ext.Array.remove(this._members, member);
    },

    //return members which are not sets only
    members: function (recursive) {
        var member_arrays;
        if (recursive) {
            member_arrays = Ext.Array.map(this.subsets(), function (m) {
                return m.members(recursive);
            });
            member_arrays.push(this.members());
            return Ext.Array.merge.apply(this, member_arrays);
        } else {
            return Ext.Array.clone(Ext.Array.filter(this._members, function (m) {
                return !m.isSet;
            }));
        }
    },

    subsets: function (recursive) {
        var subset_arrays;
        if (recursive) {
            subset_arrays = Ext.Array.map(this.subsets(), function (m) {
                return m.subsets(recursive);
            });
            subset_arrays.push(this.subsets());
            return Ext.Array.merge.apply(this, subset_arrays);
        } else {
            return Ext.Array.filter(this._members, function (m) {
                if (m.isSet) {
                    return m.isSet();
                }
            });
        }
    },

    union: function (set) {
        return Ext.Array.union(this.members(), set.members());
    },

    intersect: function (set) {
        return Ext.Array.intersect(this.members(), set.members());
    },

    copy: function () {
        return new collection.Set({
            _members: this.members()
        });
    }
});
