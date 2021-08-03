import React, { useContext } from 'react';
import { GlobalContext } from 'contexts/context';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = props => {
    const context = useContext(GlobalContext);
    if (context.isLogger) {
        return <Route {...props}/>
    } else 
    {
        return <Redirect to="/auth/login"/>
    }
}

export default PrivateRoute