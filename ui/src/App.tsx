import './App.css';

import {
  Router,
  Switch,
  Route
} from "react-router-dom"
import PipelinesPage from "./pages/PipelinesPage";
import HomePage from "./pages/HomePage";
import EnvironmentsPage from "./pages/EnvironmentsPage";
import PipelineDetailPage from "./pages/PipelineDetailPage";
import PipelineStepLogRaws from "./pages/PipelineStepLogRawsPage";
import PipelineUsersManage from "./pages/PipelineUsersManagePage";
import UserManages from "./pages/UserManagesPage";
import LoginPage from "./pages/LoginPage";
import CreateEnvironmentPage from "./pages/CreateEnvironmentPage"
import EditEnvironmentPage from "./pages/EditEnvironmentPage"
import AutoLoginPages from "./pages/AutoLoginPages"

import AuthComponent from "./components/AuthComponent"
import { history } from "./helpers"
function App(): JSX.Element {

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/">
          <AuthComponent>
            <HomePage />
          </AuthComponent>
        </Route>
        <Route exact path="/pipelines">
          <AuthComponent>
            <PipelinesPage />
          </AuthComponent>
        </Route>
        <Route exact path="/pipelines/detail/:id?">
          <AuthComponent>
            <PipelineDetailPage />
          </AuthComponent>
        </Route>
        <Route path="/user-manages">
          <AuthComponent>
            <UserManages />
          </AuthComponent>
        </Route>
        <Route path="/pipelines/detail/logs/:id_job/raw/:id">
          <AuthComponent>
            <PipelineStepLogRaws />
          </AuthComponent>
        </Route>
        <Route path="/pipelines/detail/users-manage">
          <AuthComponent>
            <PipelineUsersManage />
          </AuthComponent>
        </Route>
        <Route path="/environments" exact>
          <AuthComponent>
            <EnvironmentsPage />
          </AuthComponent>
        </Route>
        <Route path="/environments/create">
          <AuthComponent>
            <CreateEnvironmentPage />
          </AuthComponent>
        </Route>
        <Route path="/environments/edit/:id">
          <AuthComponent>
            <EditEnvironmentPage />
          </AuthComponent>
        </Route>
        <Route path="/autologin/:accessToken">
          <AutoLoginPages/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
