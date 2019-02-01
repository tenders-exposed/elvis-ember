import Adapter from 'ember-data/adapter';
import {
  AdapterError,
  InvalidError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServerError,
  TimeoutError,
  AbortError
} from 'ember-data/adapters/errors';
import {
  BuildURLMixin,
  isEnabled,
  // runInDebug,
  // warn,
  deprecate,
  parseResponseHeaders
} from 'ember-data/-private';
import MapWithDefault from '@ember/map/with-default';
import { get } from '@ember/object';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';
import $ from 'jquery';

const { Promise } = RSVP;

let ElvisAdapter = Adapter.extend(BuildURLMixin, {
  defaultSerializer: '-rest',

  sortQueryParams(obj) {
    let keys = Object.keys(obj);
    let len = keys.length;
    if (len < 2) {
      return obj;
    }
    let newQueryParams = {};
    let sortedKeys = keys.sort();

    for (let i = 0; i < len; i++) {
      newQueryParams[sortedKeys[i]] = obj[sortedKeys[i]];
    }
    return newQueryParams;
  },

  coalesceFindRequests: false,
  //
  // shouldReloadAll(store, snapshotArray) {
  //   return true;
  // },

  findRecord(store, type, id, snapshot) {
    if (isEnabled('ds-improved-ajax') && !this._hasCustomizedAjax()) {
      let request = this._requestFor({
        store, type, id, snapshot,
        requestType: 'findRecord'
      });

      return this._makeRequest(request);
    } else {
      let url = this.buildURL(type.modelName, id, snapshot, 'findRecord');
      let query = this.buildQuery(snapshot);

      return this.ajax(url, 'GET', { data: query });
    }
  },

  findAll(store, type, sinceToken, snapshotRecordArray) {
    let query = this.buildQuery(snapshotRecordArray);

    if (isEnabled('ds-improved-ajax') && !this._hasCustomizedAjax()) {
      let request = this._requestFor({
        store, type, sinceToken, query,
        snapshots: snapshotRecordArray,
        requestType: 'findAll'
      });

      return this._makeRequest(request);
    } else {
      let url = this.buildURL(type.modelName, null, snapshotRecordArray, 'findAll');

      if (sinceToken) {
        query.since = sinceToken;
      }

      return this.ajax(url, 'GET', { data: query });
    }
  },

  query(store, type, query) {
    if (isEnabled('ds-improved-ajax') && !this._hasCustomizedAjax()) {
      let request = this._requestFor({
        store, type, query,
        requestType: 'query'
      });

      return this._makeRequest(request);
    } else {
      let url = this.buildURL(type.modelName, null, null, 'query', query);

      if (this.sortQueryParams) {
        query = this.sortQueryParams(query);
      }

      return this.ajax(url, 'GET', { data: query });
    }
  },

  queryRecord(store, type, query) {
    if (isEnabled('ds-improved-ajax') && !this._hasCustomizedAjax()) {
      let request = this._requestFor({
        store, type, query,
        requestType: 'queryRecord'
      });

      return this._makeRequest(request);
    } else {
      let url = this.buildURL(type.modelName, null, null, 'queryRecord', query);

      if (this.sortQueryParams) {
        query = this.sortQueryParams(query);
      }

      return this.ajax(url, 'GET', { data: query });
    }
  },

  findMany(store, type, ids, snapshots) {
    if (isEnabled('ds-improved-ajax') && !this._hasCustomizedAjax()) {
      let request = this._requestFor({
        store, type, ids, snapshots,
        requestType: 'findMany'
      });

      return this._makeRequest(request);
    } else {
      let url = this.buildURL(type.modelName, ids, snapshots, 'findMany');
      return this.ajax(url, 'GET', { data: { ids } });
    }
  },

  findHasMany(store, snapshot, url, relationship) {
    if (isEnabled('ds-improved-ajax') && !this._hasCustomizedAjax()) {
      let request = this._requestFor({
        store, snapshot, url, relationship,
        requestType: 'findHasMany'
      });

      return this._makeRequest(request);
    } else {
      let { id } = snapshot;
      let type   = snapshot.modelName;

      url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findHasMany'));

      return this.ajax(url, 'GET');
    }
  },

  findBelongsTo(store, snapshot, url, relationship) {
    if (isEnabled('ds-improved-ajax') && !this._hasCustomizedAjax()) {
      let request = this._requestFor({
        store, snapshot, url, relationship,
        requestType: 'findBelongsTo'
      });

      return this._makeRequest(request);
    } else {
      let { id } = snapshot;
      let type = snapshot.modelName;

      url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findBelongsTo'));
      return this.ajax(url, 'GET');
    }
  },

  createRecord(store, type, snapshot) {
    if (isEnabled('ds-improved-ajax') && !this._hasCustomizedAjax()) {
      let request = this._requestFor({
        store, type, snapshot,
        requestType: 'createRecord'
      });

      return this._makeRequest(request);
    } else {
      let data = {};
      let serializer = store.serializerFor(type.modelName);
      let url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

      serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

      return this.ajax(url, 'POST', { data });
    }
  },

  updateRecord(store, type, snapshot) {
    if (isEnabled('ds-improved-ajax') && !this._hasCustomizedAjax()) {
      let request = this._requestFor({
        store, type, snapshot,
        requestType: 'updateRecord'
      });

      return this._makeRequest(request);
    } else {
      let data = {};
      let serializer = store.serializerFor(type.modelName);

      serializer.serializeIntoHash(data, type, snapshot);

      let { id } = snapshot;
      let url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

      return this.ajax(url, 'PATCH', { data });
    }
  },

  deleteRecord(store, type, snapshot) {
    if (isEnabled('ds-improved-ajax') && !this._hasCustomizedAjax()) {
      let request = this._requestFor({
        store, type, snapshot,
        requestType: 'deleteRecord'
      });

      return this._makeRequest(request);
    } else {
      let { id } = snapshot;

      return this.ajax(this.buildURL(type.modelName, id, snapshot, 'deleteRecord'), 'DELETE');
    }
  },

  _stripIDFromURL(store, snapshot) {
    let url = this.buildURL(snapshot.modelName, snapshot.id, snapshot);

    let expandedURL = url.split('/');
    // Case when the url is of the format ...something/:id
    // We are decodeURIComponent-ing the lastSegment because if it represents
    // the id, it has been encodeURIComponent-ified within `buildURL`. If we
    // don't do this, then records with id having special characters are not
    // coalesced correctly (see GH #4190 for the reported bug)
    let lastSegment = expandedURL[expandedURL.length - 1];
    let { id } = snapshot;
    if (decodeURIComponent(lastSegment) === id) {
      expandedURL[expandedURL.length - 1] = '';
    } else if (endsWith(lastSegment, `?id=${id}`)) {
      // Case when the url is of the format ...something?id=:id
      expandedURL[expandedURL.length - 1] = lastSegment.substring(0, lastSegment.length - id.length - 1);
    }

    return expandedURL.join('/');
  },

  // http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
  maxURLLength: 2048,

  groupRecordsForFindMany(store, snapshots) {
    let groups = MapWithDefault.create({
      defaultValue() {
        return [];
      }
    });
    let adapter = this;
    let { maxURLLength } = this;

    snapshots.forEach((snapshot) => {
      let baseUrl = adapter._stripIDFromURL(store, snapshot);
      groups.get(baseUrl).push(snapshot);
    });

    function splitGroupToFitInUrl(group, maxURLLength, paramNameLength) {
      let baseUrl = adapter._stripIDFromURL(store, group[0]);
      let idsSize = 0;
      let splitGroups = [[]];

      group.forEach((snapshot) => {
        let additionalLength = encodeURIComponent(snapshot.id).length + paramNameLength;
        if (baseUrl.length + idsSize + additionalLength >= maxURLLength) {
          idsSize = 0;
          splitGroups.push([]);
        }

        idsSize += additionalLength;

        let lastGroupIndex = splitGroups.length - 1;
        splitGroups[lastGroupIndex].push(snapshot);
      });

      return splitGroups;
    }

    let groupsArray = [];
    groups.forEach((group) => {
      let paramNameLength = '&ids%5B%5D='.length;
      let splitGroups = splitGroupToFitInUrl(group, maxURLLength, paramNameLength);

      splitGroups.forEach((splitGroup) => groupsArray.push(splitGroup));
    });

    return groupsArray;
  },

  handleResponse(status, headers, payload, requestData) {
    if (this.isSuccess(status, headers, payload)) {
      return payload;
    } else if (this.isInvalid(status, headers, payload)) {
      return new InvalidError(payload.errors);
    }

    let errors          = this.normalizeErrorResponse(status, headers, payload);
    let detailedMessage = this.generatedDetailedMessage(status, headers, payload, requestData);

    if (isEnabled('ds-extended-errors')) {
      switch (status) {
        case 401:
          return new UnauthorizedError(errors, detailedMessage);
        case 403:
          return new ForbiddenError(errors, detailedMessage);
        case 404:
          return new NotFoundError(errors, detailedMessage);
        case 409:
          return new ConflictError(errors, detailedMessage);
        default:
          if (status >= 500) {
            return new ServerError(errors, detailedMessage);
          }
      }
    }

    return new AdapterError(errors, detailedMessage);
  },

  isSuccess(status/*, headers, payload*/) {
    return status >= 200 && status < 300 || status === 304;
  },

  isInvalid(status/*, headers, payload*/) {
    return status === 422;
  },

  ajax(url, type, options) {
    let adapter = this;

    let requestData = {
      url,
      method: type
    };

    return new Promise(function(resolve, reject) {
      let hash = adapter.ajaxOptions(url, type, options);

      hash.success = function(payload, textStatus, jqXHR) {
        let response = ajaxSuccess(adapter, jqXHR, payload, requestData);
        run.join(null, resolve, response);
      };

      hash.error = function(jqXHR, textStatus, errorThrown) {
        let responseData = {
          textStatus,
          errorThrown
        };
        let error = ajaxError(adapter, jqXHR, requestData, responseData);
        run.join(null, reject, error);
      };

      adapter._ajaxRequest(hash);
    }, `DS: ElvisAdapter#ajax ${type} to ${url}`);
  },

  _ajaxRequest(options) {
    $.ajax(options);
  },

  ajaxOptions(url, type, options) {
    let hash = options || {};
    hash.url = url;
    hash.type = type;
    hash.dataType = 'json';
    hash.context = this;

    if (hash.data && type !== 'GET') {
      hash.contentType = 'application/json; charset=utf-8';
      hash.data = JSON.stringify(hash.data);
    }

    let headers = get(this, 'headers');
    if (headers !== undefined) {
      hash.beforeSend = function(xhr) {
        Object.keys(headers).forEach((key) =>  xhr.setRequestHeader(key, headers[key]));
      };
    }

    return hash;
  },

  parseErrorResponse(responseText) {
    let json = responseText;

    try {
      json = $.parseJSON(responseText);
    } catch (e) {
      // ignored
    }

    return json;
  },

  normalizeErrorResponse(status, headers, payload) {
    if (payload && typeof payload === 'object' && payload.errors) {
      return payload.errors;
    } else {
      return [
        {
          status: `${status}`,
          title: 'The backend responded with an error',
          detail: `${payload}`
        }
      ];
    }
  },

  generatedDetailedMessage(status, headers, payload, requestData) {
    let shortenedPayload;
    let payloadContentType = headers['Content-Type'] || 'Empty Content-Type';

    if (payloadContentType === 'text/html' && payload.length > 250) {
      shortenedPayload = '[Omitted Lengthy HTML]';
    } else {
      shortenedPayload = payload;
    }

    let requestDescription = `${requestData.method} ${requestData.url}`;
    let payloadDescription = `Payload (${payloadContentType})`;

    return [`Ember Data Request ${requestDescription} returned a ${status}`,
            payloadDescription,
            shortenedPayload].join('\n');
  },

  // @since 2.5.0
  buildQuery(snapshot) {
    let query = {};

    if (snapshot) {
      let { include } = snapshot;

      if (include) {
        query.include = include;
      }
    }

    return query;
  },

  _hasCustomizedAjax() {
    if (this.ajax !== ElvisAdapter.prototype.ajax) {
      deprecate('ElvisAdapter#ajax has been deprecated please use. `methodForRequest`, `urlForRequest`, `headersForRequest` or `dataForRequest` instead.', false, {
        id: 'ds.rest-adapter.ajax',
        until: '3.0.0'
      });
      return true;
    }

    if (this.ajaxOptions !== ElvisAdapter.prototype.ajaxOptions) {
      deprecate('ElvisAdapter#ajaxOptions has been deprecated please use. `methodForRequest`, `urlForRequest`, `headersForRequest` or `dataForRequest` instead.', false, {
        id: 'ds.rest-adapter.ajax-options',
        until: '3.0.0'
      });
      return true;
    }

    return false;
  }
});

if (isEnabled('ds-improved-ajax')) {

  ElvisAdapter.reopen({

    dataForRequest(params) {
      let { store, type, snapshot, requestType, query } = params;

      // type is not passed to findBelongsTo and findHasMany
      type = type || (snapshot && snapshot.type);

      let serializer = store.serializerFor(type.modelName);
      let data = {};

      switch (requestType) {
        case 'createRecord':
          serializer.serializeIntoHash(data, type, snapshot, { includeId: true });
          break;

        case 'updateRecord':
          serializer.serializeIntoHash(data, type, snapshot);
          break;

        case 'findRecord':
          data = this.buildQuery(snapshot);
          break;

        case 'findAll':
          if (params.sinceToken) {
            query = query || {};
            query.since = params.sinceToken;
          }
          data = query;
          break;

        case 'query':
        case 'queryRecord':
          if (this.sortQueryParams) {
            query = this.sortQueryParams(query);
          }
          data = query;
          break;

        case 'findMany':
          data = { ids: params.ids };
          break;

        default:
          data = undefined;
          break;
      }

      return data;
    },

    methodForRequest(params) {
      let { requestType } = params;

      switch (requestType) {
        case 'createRecord': return 'POST';
        case 'updateRecord': return 'PATCH';
        case 'deleteRecord': return 'DELETE';
      }

      return 'GET';
    },

    urlForRequest(params) {
      let { type, id, ids, snapshot, snapshots, requestType, query } = params;

      // type and id are not passed from updateRecord and deleteRecord, hence they
      // are defined if not set
      type = type || (snapshot && snapshot.type);
      id = id || (snapshot && snapshot.id);

      switch (requestType) {
        case 'findAll':
          return this.buildURL(type.modelName, null, snapshots, requestType);

        case 'query':
        case 'queryRecord':
          return this.buildURL(type.modelName, null, null, requestType, query);

        case 'findMany':
          return this.buildURL(type.modelName, ids, snapshots, requestType);

        case 'findHasMany':
        case 'findBelongsTo': {
          let url = this.buildURL(type.modelName, id, snapshot, requestType);
          return this.urlPrefix(params.url, url);
        }
      }

      return this.buildURL(type.modelName, id, snapshot, requestType, query);
    },

    headersForRequest() {
      return this.get('headers');
    },

    _requestFor(params) {
      let method = this.methodForRequest(params);
      let url = this.urlForRequest(params);
      let headers = this.headersForRequest(params);
      let data = this.dataForRequest(params);

      return { method, url, headers, data };
    },

    _requestToJQueryAjaxHash(request) {
      let hash = {};

      hash.type = request.method;
      hash.url = request.url;
      hash.dataType = 'json';
      hash.context = this;

      if (request.data) {
        if (request.method !== 'GET') {
          hash.contentType = 'application/json; charset=utf-8';
          hash.data = JSON.stringify(request.data);
        } else {
          hash.data = request.data;
        }
      }

      let { headers } = request;
      if (headers !== undefined) {
        hash.beforeSend = function(xhr) {
          Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key]));
        };
      }

      return hash;
    },

    _makeRequest(request) {
      let adapter = this;
      let hash = this._requestToJQueryAjaxHash(request);

      let { method, url } = request;
      let requestData = { method, url };

      return new RSVP.Promise((resolve, reject) => {

        hash.success = function(payload, textStatus, jqXHR) {
          let response = ajaxSuccess(adapter, jqXHR, payload, requestData);
          run.join(null, resolve, response);
        };

        hash.error = function(jqXHR, textStatus, errorThrown) {
          let responseData = {
            textStatus,
            errorThrown
          };
          let error = ajaxError(adapter, jqXHR, requestData, responseData);
          run.join(null, reject, error);
        };

        adapter._ajaxRequest(hash);

      }, `DS: ElvisAdapter#makeRequest: ${method} ${url}`);
    }
  });

}

function ajaxSuccess(adapter, jqXHR, payload, requestData) {
  let response;
  try {
    response = adapter.handleResponse(
      jqXHR.status,
      parseResponseHeaders(jqXHR.getAllResponseHeaders()),
      payload,
      requestData
    );
  } catch (error) {
    return Promise.reject(error);
  }

  if (response && response.isAdapterError) {
    return Promise.reject(response);
  } else {
    return response;
  }
}

function ajaxError(adapter, jqXHR, requestData, responseData) {
  /*runInDebug(function() {
    let message = `The server returned an empty string for ${requestData.method} ${requestData.url}, which cannot be parsed into a valid JSON. Return either null or {}.`;
    let validJSONString = !(responseData.textStatus === 'parsererror' && jqXHR.responseText === '');
    warn(message, validJSONString, {
      id: 'ds.adapter.returned-empty-string-as-JSON'
    });
  });*/

  let error;

  if (responseData.errorThrown instanceof Error) {
    error = responseData.errorThrown;
  } else if (responseData.textStatus === 'timeout') {
    error = new TimeoutError();
  } else if (responseData.textStatus === 'abort' || jqXHR.status === 0) {
    error = new AbortError();
  } else {
    try {
      error = adapter.handleResponse(
        jqXHR.status,
        parseResponseHeaders(jqXHR.getAllResponseHeaders()),
        adapter.parseErrorResponse(jqXHR.responseText) || responseData.errorThrown,
        requestData
      );
    } catch (e) {
      error = $.parseJSON(jqXHR.responseText);
    }
  }

  return error;
}

// From http://stackoverflow.com/questions/280634/endswith-in-javascript
function endsWith(string, suffix) {
  if (typeof String.prototype.endsWith !== 'function') {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
  } else {
    return string.endsWith(suffix);
  }
}

export default ElvisAdapter;
