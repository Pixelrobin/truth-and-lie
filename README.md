# Truth and Lie

![Example screenshot of a game in progress. The choices on the screen are "I've been to Disney Land Twice" and "I've never been to the Dentist". The question is "Which is the truth?". Players can vote on their devices.](./screenshot.png)

Large group game meant to be played on two screens and phones. I originally made this to be played at a church event with 100+ people.

This is purposefully built to be super simple. I didn't have a lot of time and I wanted to minimize the chance of something going wrong. Everything runs on a simple Express server with socket.io.

## The game

1. To start, several tables pick someone who has a good "Truth and Lie" question. Kinda like the classic "Two truths and a lie" but with just one of each.
2. Each table then takes turns sending their person on stage where they can share their question with the crowd. For example the question could be "I've been to disneyland twice" or "I've never been to a dentist", which is true?
3. The crowd members use their phones to go to the URL where the game is hosted and vote for which statement made before a timer runs out.
4. At the end the person on stage reveals the answer and the table playing automatically gets points based on how many people the fooled
5. At the end of all the rounds the table with the greatest amount of points wins

## Getting Started

This game requires a large group of people split into tables and at least two large screens that everybody can see.

An announcer moves the game along on the stage. Meanwhile someone works behind the scenes to control the game accordingly.

1. Clone the repo
2. Copy the `.env.sample` file into `.env` and change the values as needed
3. `nvm use` and `npm install`
4. `npm run start`
5. Go to `/game` on the main screen and `/timer` on a side screen
6. Click "Click to start" on the main screen (this allows audio to play)
7. Visit `/controls` on another device to operate the game from there behind the scenes

When developing, while a game is running, you can run `node testplayers.js` to simulate the players on the phones.

## Controlling the game

As the person working behind the scenes, this is how to use `/controls` for every round.

1. Have the announcer ask the person on the stage what their table number is and their question.
2. Enter the information into the "Game" section and press "Set Question". This will display the options on the main screen and start the timer. Usually there won't be enough time to actually enter both answers, so I would just enter a key word. For example if the options are "I've been to disneyland twice" or "I've never been to a dentist" I'd just type "Disneyland" and "Dentist"
3. While the timer is running, type the full options into the "Full A" and "Full B" boxes of the "Result" group.
4. When the timer runs out, have the host ask which is true. Select that option in the "Result" group and press "Show Result" to show it on the main screen. The full option text will be used.
5. After the crowd reaction, press "Show Fooled" to show how many people got it wrong.
6. After the crowd reacts again, press "Clear" to show the current leaderboard and reset the game. Repeat!

## Attributions

**Bell sound:** "Bell, Counter, A.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org