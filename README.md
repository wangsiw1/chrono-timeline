# Chrono TImeline

A Progressive Web App (PWA) of [React-Chrono](https://github.com/prabhuignoto/react-chrono) to create, view, and save/share timeline of stories and events.


## Usage

A live version is deployed on GitHub Page you can use now:

https://wangsiw1.github.io/chrono-timeline/

You can start creating a new Timeline from scratch, or load json data from local file or from Internet share.

#### Data

The json data follows the original [data structure and types](https://github.com/prabhuignoto/react-chrono?tab=readme-ov-file#timeline-item-model) defined by React-Chrono, but currently only support a subset of data property:

- title
- cardTitle
- cardSubtitle
- cardDetailedText
- url
- media

You can find examples in the "examples" folder, and try them out using raw json data(use "Raw" button on top right of the GitHub file preview page), for example: 

    https://raw.githubusercontent.com/wangsiw1/chrono-timeline/refs/heads/main/examples/ww1.json

#### Offline Usage (PWA)

This app is a Progressive Web App. After opening it in your browser, you can install it ("Add to Home Screen") and use it offline. The app will cache assets and work without an internet connection after the first load.


## **IMPORTANT**

**Be aware of misinformation**:

As people sharing stories and events, always make sure that

1. There are trust-worthy sources that backs up the information(Valid URL from official or news sites)
2. Double check with more sources(Searching online, check in person if possible)



## License

This project is licensed under the MIT License. You are free to use, distribute, modify, and do anything with this code. See the LICENSE file for details.

### Setup

#### Version Requirements

- **Node.js**: v20.x or higher
- **npm**: v9.x or higher
