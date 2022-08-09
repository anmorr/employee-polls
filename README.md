# This Employee Polls App was build by Anthony Morris

The project uses redux toolkit to impelement app wide state management. This is in contrast to the container method that was covered in the course. I decided to explore further into redux by doing the official tutorials and I found the redux toolkit, which is used in the react native elective, to be more concise and consistent, in addition to being the recommended approach from redux.

# Installing the project

The project can be installed by running:

### `npm install`

There is nothing out of the ordinary about running the application.

# Changes I made to \_DATA.js

The \_DATA.js file is located in src/api. I added an additional user to the data, which has an ID of 'antmor85-at-gmail.com'.

# Authentication Flow

The authentication flow uses Amazon Web Services Cognito. It will not work for new accounts because the fake backend has no way of adding new users. With that said, the user accounts all have the same username and password as stated in the \_DATA.js file, but they are authenticated in Cognito.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

# App Architecture

The app is structured as follows:

- src/api: Has all of the API code and tests
- src/app: Contains the redux store.
- src/auth: Has all of the auth components and pages. There is alot of cognito functionality within.
- src/context: App wide context for login. I used this as it was included with the cognito tutorial I followed.
- src/features: Has the User and Questions Slices and all of the corresponding components.
- src/Layout: Has the main navigation
- src/shared: Has custom hooks, utils, and cognito code that was reused throughout the project.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

The rubric states that the tests should use **_npm start test_**, but this doesn't work because npm start is used for running the app. npm run test works as an alternative. The preferred is **_npm test_**, which launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
