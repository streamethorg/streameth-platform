//import AuthRoute from './auth.route';
import IndexRoute from './index.route';
//import UsersRoute from './users.route';
import OrganizationRoute from './organization.route';
import EventRoute from './event.route';

const Routes = [
  //new AuthRoute(),
  new IndexRoute(),
  //new UsersRoute(),
  new OrganizationRoute(),
  new EventRoute(),
];

export default Routes;
