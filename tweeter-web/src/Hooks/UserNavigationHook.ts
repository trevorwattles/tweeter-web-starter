import { useNavigate } from "react-router-dom";
import { AuthToken, User, FakeData } from "tweeter-shared";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../presenter/UserNavigationPresenter";
import { useState } from "react";

interface UseUserNavigationProps {
  authToken: AuthToken | null;
  displayedUser: User | null;
  setDisplayedUser: (user: User) => void;
  featurePath: string;
  displayErrorMessage: (message: string) => void;
}

export const useUserNavigation = ({
  authToken,
  displayedUser,
  setDisplayedUser,
  featurePath,
  displayErrorMessage,
}: UseUserNavigationProps) => {
  const navigate = useNavigate();

  const view: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    navigateTo: navigate,
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(() => new UserNavigationPresenter(view));

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const alias = extractAlias(target.innerText || target.textContent || "");

    await presenter.navigateToUser(
      authToken,
      alias,
      displayedUser,
      featurePath,
    );
  };

  return { navigateToUser };
};
