// we require kue bcoz we want that our some of the mails or notification are delayed for sometime jo zyada zaruri ni h
const kue = require('kue');

const queue = kue.createQueue();

module.exports = queue;