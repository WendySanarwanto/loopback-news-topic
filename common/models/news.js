'use strict';

module.exports = function(News) {
  // Ensure that 'status' property is assigned with one of these values: 'publish', 'draft', 'deleted'
  News.validatesInclusionOf('status', {
    in: ['draft', 'publish', 'deleted']
  });
};
