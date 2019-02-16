import { firebase } from '@firebase/app';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from './404';
import Admin from './admin';

const config = {
    apiKey: "AIzaSyDPfl9DQCTCGlTdMExQbByDZEOCRFF3vno",
    authDomain: "mtcc-15237.firebaseapp.com",
    databaseURL: "https://mtcc-15237.firebaseio.com",
    projectId: "mtcc-15237",
    storageBucket: "mtcc-15237.appspot.com",
    messagingSenderId: "704137003456"
};
console.log(firebase)
firebase.initializeApp(config);

// requires babel-react to compile
render(
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact strict path='/admin' component={Admin} />
                <Route component={NotFound} />
            </Switch>
        </div>
    </BrowserRouter>,
    document.getElementById('root')
);
