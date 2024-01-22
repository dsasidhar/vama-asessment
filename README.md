### Install

Clone the repo and install dependencies:

```bash
npm install
```

### Start the app in the `dev` environment:

```bash
npm start
```

### Start the api server in the `dev` environment:

```bash
cd api
npm run start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

### Credits

Initialized with the boilerplate [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

# Considerations

## Recoil for state management

- Easy to use and has low boilerplate, this turned out to be troublesome as this is not a full fledged state management library and has some limitations.
- Updating state outside of react component is very messy, I wish I used a more mature state management library like redux.

## Persisting state

- I used electron-store to persist the state of the app, this is a simple key value store that persists to a json file.
- I do not have a lot of experience with persisting state in electron apps, I used contextBridge to expose the electron-store to the renderer process.
- The node dependencies of most state management libraries are not compatible with the renderer process, so I exposed it using contextBridge.
- In a production app I would use a more performant solution like sqlite or indexedDB.

## Loading chat history

- I used IntersectionObserver to load the chat history when the user scrolls to the top of the chat window.
- I used a simple throttle function to prevent the observer from firing too many times.
- I keep track of the first element in view of the chat and restore the scroll position after loading the history.

## Singleton SocketManager

- I used a singleton SocketManager to manage the socket connection, this is a simple class that exposes the socket connection to the rest of the app.
- The singleton class is initialized with recoil callback functions to update the state of the app on socket events.

## Predefined chat history in the api

- I added a predefined chat history in the api, this is a simple array of messages that is returned when the user requests the chat history for testing purposes.
