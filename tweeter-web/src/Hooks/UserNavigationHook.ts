import { useNavigate } from "react-router-dom";
import { AuthToken, User, FakeData } from "tweeter-shared";

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

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> => {
    return FakeData.instance.findUserByAlias(alias);
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const target = event.target as HTMLElement;
      const alias = extractAlias(target.innerText || target.textContent || "");

      if (!authToken) return;

      const toUser = await getUser(authToken, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  return { navigateToUser };
};
