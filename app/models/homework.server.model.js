'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Homework Schema
 */
var HomeworkSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill homework name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        required: 'Please fill homework description',
        trim: true
    },
    course: {
        type: String,
        default: '',
        required: 'Please fill homework course',
        trim: true
    },
    url: {
        type: String,
        default: ''
    },
    deadline: {
        type: Date,
        required: 'Please set homework deadline',
        default: Date.now
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Homework', HomeworkSchema);