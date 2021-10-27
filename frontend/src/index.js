import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import UserInterface from './UserInterface';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const SurfApp = React.lazy(() => import('./Components/SurfApp'));
const Background = React.lazy(() => import('./StyledTags/Background'));
const CAHashing = React.lazy(() => import ('./Components/CAHashing'));
const CloudComponent = React.lazy(() => import('./Components/Clouds'));

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
          <Route exact path="/">
            <UserInterface />
          </Route>
          <Route exact path="/demo/surfapp">
            <Suspense fallback={<div>...loading</div>}>
              <SurfApp />
            </Suspense>
          </Route>
          <Route exact path="/demo/cellular-background">
            <Suspense fallback={<div>...loading</div>}>
              <Background showAutomata={true}/>
            </Suspense>
          </Route>
          <Route exact path="/demo/cellular-hashing">
            <Suspense fallback={<div>...loading</div>}>
            <CAHashing />
            </Suspense>
          </Route>
          <Route exact path="/demo/clouds">
            <Suspense fallback={<div>...loading</div>}>
              <CloudComponent />
            </Suspense>
          </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

