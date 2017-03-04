# Lion-bot for Slack

Do you and your team use Slack?
Now you can get some good jokes delivered to you right inside the app.

The Lion-bot has compiled jokes from more than 1 website, and it can send you a joke whenever you ask it to.

You can smile, or act like a grumpy cat, it’s all up to you.

## Usage

Visit [Lion-bot's website](https://lion-bot.herokuapp.com) and click **Add to Slack** button.

`/lion-bot` shows a random item

`/lion-bot [id]` shows an item with the specified id

`/lion-bot filtered` shows a SFW random item

`/lion-bot filtered [id]` shows a SFW item with the specified id

`/lion-bot help` shows list of commands

## Deployment

1. `npm i` installs depencies, as usual.

1. To host database on your machine, make sure to have [MondoDB](https://www.mongodb.com/download-center) installed and running. To use remote database, get **MONGOURI** from your teammates.

1. `npm run setup` creates **.env** file with default **MONGOURI** and populates DB with sample data. You can edit **.env** file with your custom **MONGOURI** and then rerun the script to populate remote DB.

1. `npm test` runs tests

1. `npm start` starts a server of bot itself and a landing page for it.

