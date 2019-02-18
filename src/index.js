import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from './404';
import Admin from './page/Admin';


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
