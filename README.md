# MarverlousDiscordBridge

Simple discord bot that will relay discord messages and VC join notifications to "AMarverlousDisplay" API.
Note this is using the new message queueing API and must be updated to the latest version!

## config.json
```json
{
  "token": "BOT_TOKEN",
  "display": "127.0.0.1:7878",
  "channels": [
    "LIST OF CHANNELIDS TO MONITOR"
  ]
}
```