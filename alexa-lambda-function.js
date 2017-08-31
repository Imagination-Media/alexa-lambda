var http = require('http')

exports.handler = (event, context) => {

  var store_url = '';// http://yourstore.com/
  var im_token = '';// Token from ImaginationMedia_Alexa extension

  try {

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`)
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Hello! I can provide some information about your sales, refunds and customers.", true),
            {}
          )
        )
        break;

      case "IntentRequest":
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
            case "Sales":
                var endpoint = store_url+'alexa/?token='+im_token+'&action=sales';
                var body = ""
                http.get(endpoint, (response) => {
                  response.on('data', (chunk) => { body += chunk })
                  response.on('end', () => {
                    var data = JSON.parse(body);
                    var receivedMessage = data.result;
                    context.succeed(
                      generateResponse(
                        buildSpeechletResponse(`${receivedMessage}`, true),
                        {}
                      )
                    )
                  })
                })
                
                break;
            case "Refunds":
                var endpoint = store_url+'alexa/?token='+im_token+'&action=refunds';
                var body = ""
                http.get(endpoint, (response) => {
                  response.on('data', (chunk) => { body += chunk })
                  response.on('end', () => {
                    var data = JSON.parse(body);
                    var receivedMessage = data.result;
                    context.succeed(
                      generateResponse(
                        buildSpeechletResponse(`${receivedMessage}`, true),
                        {}
                      )
                    )
                  })
                })
                
                break;
            case "Customers":
                var endpoint = store_url+'alexa/?token='+im_token+'&action=customers';
                var body = ""
                http.get(endpoint, (response) => {
                  response.on('data', (chunk) => { body += chunk })
                  response.on('end', () => {
                    var data = JSON.parse(body);
                    var receivedMessage = data.result;
                    context.succeed(
                      generateResponse(
                        buildSpeechletResponse(`${receivedMessage}`, true),
                        {}
                      )
                    )
                  })
                })
                
                break;
          default:
            throw "Invalid intent"
        }

        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`)
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}