import React from 'react';
import { createBrowserHistory } from "history";
import {Switch, Route, Router, Redirect} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import AdminLayout from 'layouts/Admin.js';
import AuthLayout from "layouts/Auth.js";
import TemplateLayout from "layouts/Template.js";

const hist = createBrowserHistory();

const Routes = () => (
    <Router history={hist}>
        <Switch>
            <Route path="/auth" component={AuthLayout} />
            <Route path="/template" component={TemplateLayout} />
            <PrivateRoute path="/admin" render={(props) => <AdminLayout {...props} />} />
            <Redirect to="/admin/dashboard" />

        </Switch>
    </Router>
)

export default Routes;