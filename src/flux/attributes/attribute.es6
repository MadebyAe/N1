import Matcher from './matcher';
import SortOrder from './sort-order';

/*
Public: The Attribute class represents a single model attribute, like 'account_id'.
Subclasses of {Attribute} like {AttributeDateTime} know how to covert between
the JSON representation of that type and the javascript representation.
The Attribute class also exposes convenience methods for generating {Matcher} objects.

Section: Database
*/
export default class Attribute {
  constructor({modelKey, queryable, jsonKey}) {
    this.modelKey = modelKey;
    this.jsonKey = jsonKey || modelKey;
    this.queryable = queryable;
  }

  _assertPresentAndQueryable(fnName, val) {
    if (val === undefined) {
      throw new Error(`Attribute::${fnName} (${this.modelKey}) - you must provide a value`);
    }
    if (!this.queryable) {
      throw new Error(`Attribute::${fnName} (${this.modelKey}) - this field cannot be queried against`);
    }
  }

  // Public: Returns a {Matcher} for objects `=` to the provided value.
  equal(val) {
    this._assertPresentAndQueryable('equal', val);
    return new Matcher(this, '=', val);
  }

  // Public: Returns a {Matcher} for objects `=` to the provided value.
  in(val) {
    this._assertPresentAndQueryable('in', val);

    if (!(val instanceof Array)) {
      throw new Error(`Attribute.in: you must pass an array of values.`);
    }
    if (val.length === 0) {
      console.warn(`Attribute::in (${this.modelKey}) called with an empty set. You should avoid this useless query!`);
    }
    return (val.length === 1) ? new Matcher(this, '=', val[0]) : new Matcher(this, 'in', val);
  }

  // Public: Returns a {Matcher} for objects `!=` to the provided value.
  not(val) {
    this._assertPresentAndQueryable('not', val);
    return new Matcher(this, '!=', val);
  }

  // Public: Returns a descending {SortOrder} for this attribute.
  descending() {
    return new SortOrder(this, 'DESC');
  }

  // Public: Returns an ascending {SortOrder} for this attribute.
  ascending() {
    return new SortOrder(this, 'ASC');
  }

  toJSON(val) {
    return val;
  }

  fromJSON(val) {
    return val || null;
  }
}
