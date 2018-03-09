# Audio player application

Audio player built with typescript, node, react & rxjs

Based on `create-react-app --scripts-version=react-scripts-ts`

### Install

1. Install node https://nodejs.org/en/, node 8 is required
2. Install yarn globally `npm i -g yarn`
3. Install packages `yarn`

### Launch

1. Run app `yarn start`
2. Open browser at localhost:3000

### Controls

1. UP/DOWN to select track
2. ENTER to play track
3. LEFT/RIGHT play previous/next track
4. SPACE toggle pause

### Adding tracks

New tracks can be added manually through filesystem
Player will update them during runtime ( there's no filter by file type currently so any accidental .DS_Store etc will popup)

1. Before launch tracks can be added to `./public/tracks`
2. After launch tracks can be added to `./build/assets/tracks`

### Tests

1. Run `yarn test`
