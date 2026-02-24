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
import { PagedItemView } from "./presenter/PagedItemPresenter";

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

  // Configuration for paged routes to eliminate <Route> duplication
  const pagedRoutes = [
    { path: "feed", presenter: FeedPresenter, render: renderStatusItem },
    { path: "story", presenter: StoryPresenter, render: renderStatusItem },
    { path: "followees", presenter: FolloweePresenter, render: renderUserItem },
    { path: "followers", presenter: FollowerPresenter, render: renderUserItem },
  ];

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />

        {/* Dynamically generate all paged routes */}
        {pagedRoutes.map(({ path, presenter, render }) => (
          <Route
            key={path}
            path={`${path}/:displayedUser`}
            element={
              <ItemScroller
                key={`${path}-${displayedUser!.alias}`}
                featureURl={`/${path}`}
                presenterFactory={(view: PagedItemView<any>) =>
                  new presenter(view)
                }
                itemComponentFactory={(item) => render(item, `/${path}`)}
              />
            }
          />
        ))}

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
