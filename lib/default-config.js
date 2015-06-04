var moment = require('moment');
require('moment-duration-format');

module.exports = {
  willDeploy: function(context) {
    return Promise.resolve({
      slack: {
        startDeployDate: new Date()
      }
    });
  },

  didDeploy: function(context, slack) {
    var startDeployDate    = context.slack.startDeployDate;
    var endDeployDate      = new Date();
    var duration           = moment.duration(endDeployDate - startDeployDate);

    return slack.notify({
      attachments: [{
       "fallback":"Deployment finished! Revision <http://localhost:4567?index_key=123451|123451> was successfully uploaded.",
         "pretext":"Deployment finished! Revision <http://localhost:4567?index_key=123451|123451> was successfully uploaded.",
         "color":"good",
         "fields":[
            {
               "title":"Stats",
               "value":"Deploying revision 123451 took "+duration.format('m [min], s [s], S [ms]')+'.',
               "short":false
            }
         ]
      }]
    });
  },

  didFail: function(context, slack) {
    var message = "Ember-cli-deploy tried to deploy a revision but failed.";

    return slack.notify({
      attachments: [{
       "fallback": "Deployment failed!",
         "pretext": "Deployment failed!",
         "color": "danger",
         "fields":[
            {
               "title": "Failure",
               "value": message,
               "short": false
            }
         ]
      }]
    });
  }
};
