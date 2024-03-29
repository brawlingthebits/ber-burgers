import { Switch } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { Signin } from "../pages/Signin";
import { Signup } from "../pages/Signup";
import { Route } from "./Route"

export const Routes = () => (
    <Switch>
        <Route exact path="/" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/dashboard" component={Dashboard}  isPrivate />
    </Switch>
)