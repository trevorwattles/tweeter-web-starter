import { Link } from "react-router-dom";
import { Status, Type } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useUserNavigation } from "../../Hooks/UserNavigationHook";

interface Props {
  status: Status;
  featurePath: string;
}

const Post = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { navigateToUser } = useUserNavigation({
    authToken,
    displayedUser,
    setDisplayedUser,
    featurePath: props.featurePath,
    displayErrorMessage,
  });

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={`${props.featurePath}/${segment.text}`}
            onClick={navigateToUser}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        ),
      )}
    </>
  );
};

export default Post;
