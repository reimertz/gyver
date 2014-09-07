#!/usr/bin/env node
"use strict";
var inquirer = require("inquirer"),
    htmlToText = require('html-to-text'),
    chalk = require("chalk"),
    tools = require("./tools/index.js"),
    _ = require('underscore'),
    gyver = '  _________________________________\n'+
            '   /                                 \\\n'+
            '  /     _                             \\\n'+
            ' /    _| |_            gyver           \\\n'+
            '|    |_   _|       a toolbox for        |\n'+
            ' \\     |_|     developers/designers    /\n'+
            '  \\                                   /\n'+
            '   \\_________________________________/\n',

    thisIsTheEnd = '\n'

var phases = {
  question: chalk.green("\nHi dear, what's up?"),
  answers: [new inquirer.Separator(),
    'Energizers - I need Energy!',
    'Ideations - My brain is empty, I need Ideas!',
    'Idea Evaluation - I have ideas, but how good are they?',
    'Concept Development - Does my Concept compute?',
    'Testing - No one need user tests, right?' + thisIsTheEnd
  ]
};

var preperation = {
  question: "Do you have time to prepare?",
  answers: [new inquirer.Separator(),
    'No, I want to start right away!',
    'Okay, like 15 Minutes or so.',
    'An hour or two..',
    'Half a day could work..',
    'Time ain\'t a problem' + thisIsTheEnd
  ]
};

var participants = {
  question: "Are you doing this by yourself?",
  answers: [new inquirer.Separator(),
    'Yep, Just me.. (1)',
    'No, just me and some friends (2-6)',
    'It\'s a company meeting! (7-12)',
    'I have a lot of friends yo know.. (+12)' + thisIsTheEnd
  ]
}

var filteredList = [];
function filterToolsBySelection(answer) {
  filteredList = tools.filterBy(answer.phase, answer.preperation, answer.participants);  
  return filteredList;
}

function getByName(n) {
  return _.find(filteredList, function(item){
    return item.name == n;
  });
}

inquirer.prompt([
  {
    type: "list",
    name: "phase",
    message: gyver + phases.question,
    choices: phases.answers,
    filter: function( val ) { 
      return phases.answers.indexOf(val)-1;
    }
  },
  {
    type: "list",
    name: "preperation",
    message: preperation.question,
    choices: preperation.answers,
    filter: function( val ) { 
      return preperation.answers.indexOf(val)-1;
    }
  },
  {
    type: "list",
    name: "participants",
    message: participants.question,
    choices: participants.answers,
    filter: function( val ) { 
      return participants.answers.indexOf(val)-1;
    }
  }
], function( answer ) {
  filterToolsBySelection(answer);
  
  inquirer.prompt([
    {
      type: "list",
      name: "selection",
      message: 'I found these for you',
      choices: filteredList,
      filter: function( val ) {
        return val; 
      }
    }
  ], function( answer ) {
    var parsedText = htmlToText.fromString(getByName(answer.selection).description);
    console.log(thisIsTheEnd + parsedText + thisIsTheEnd);
  })});
