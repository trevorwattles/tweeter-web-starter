import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastType } from "../toaster/Toast";
import { ToastActionsContext } from "../toaster/ToastContexts";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

type OAuthProvider = "Facebook" | "Google" | "Twitter" | "LinkedIn" | "GitHub";

interface OAuthProps {
  provider: OAuthProvider;
  icon: IconProp;
}

const tooltipIdByProvider: Record<OAuthProvider, string> = {
  Google: "googleTooltip",
  Facebook: "facebookTooltip",
  Twitter: "twitterTooltip",
  LinkedIn: "linkedInTooltip",
  GitHub: "githubTooltip",
};

const OAuth = ({ provider, icon }: OAuthProps) => {
  const { displayToast } = useContext(ToastActionsContext);

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayToast(
      ToastType.Info,
      message,
      3000,
      undefined,
      "text-white bg-primary",
    );
  };

  return (
    <button
      type="button"
      className="btn btn-link btn-floating mx-1"
      onClick={() =>
        displayInfoMessageWithDarkBackground(
          `${provider} registration is not implemented.`,
        )
      }
      aria-label={provider}
    >
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={tooltipIdByProvider[provider]}>{provider}</Tooltip>
        }
      >
        <span>
          <FontAwesomeIcon icon={icon} />
        </span>
      </OverlayTrigger>
    </button>
  );
};

export default OAuth;
