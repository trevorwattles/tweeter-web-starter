import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { Status, User } from "tweeter-shared";
import {
  PagedItemView,
  PagedItemPresenter,
} from "./presenter/PagedItemPresenter";
import { Service } from "./model.service/Service";

// --- New Helper Component for Type Safety ---
interface PagedRouteProps<
  T,
  S extends Service,
  P extends PagedItemPresenter<T, S>,
> {
  path: string;
  PresenterClass: new (view: PagedItemView<T>) => P;
  render: (item: T, path: string) => JSX.Element;
}

const PagedRoute = <T, S extends Service, P extends PagedItemPresenter<T, S>>({
  path,
  PresenterClass,
  render,
}: PagedRouteProps<T, S, P>) => {
  const { displayedUser } = useUserInfo();

  return (
    <ItemScroller
      key={`${path}-${displayedUser!.alias}`}
      featureURl={`/${path}`}
      // TypeScript now correctly infers 'view' as PagedItemView<T>
      presenterFactory={(view: PagedItemView<T>) => new PresenterClass(view)}
      itemComponentFactory={(item: T) => render(item, `/${path}`)}
    />
  );
};
// --------------------------------------------

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  // Helper functions for rendering specific item types
  const renderStatusItem = (item: Status, path: string) => (
    <StatusItem status={item} featurePath={path} />
  );

  const renderUserItem = (item: User, path: string) => (
    <UserItem user={item} featurePath={path} />
  );

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            <PagedRoute
              path="feed"
              PresenterClass={FeedPresenter}
              render={renderStatusItem}
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <PagedRoute
              path="story"
              PresenterClass={StoryPresenter}
              render={renderStatusItem}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <PagedRoute
              path="followees"
              PresenterClass={FolloweePresenter}
              render={renderUserItem}
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <PagedRoute
              path="followers"
              PresenterClass={FollowerPresenter}
              render={renderUserItem}
            />
          }
        />

        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
