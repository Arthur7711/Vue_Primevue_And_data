export default (str) => str.toLowerCase().replace(/([-_][a-z])/g, group =>
  group.toUpperCase().replace('-', '').replace('_', ''))
