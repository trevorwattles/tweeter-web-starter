import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
  setIsLoading: (isLoading: boolean) => void;
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string,
  ) => string;
  clearMessage: (messageId: string) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private _service: StatusService;

  public constructor(view: PostStatusView) {
    this._view = view;
    this._service = new StatusService();
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken,
  ) {
    let postingStatusToastId = "";

    try {
      this._view.setIsLoading(true);
      postingStatusToastId = this._view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(post, currentUser, Date.now());

      await this._service.postStatus(authToken, status);

      this._view.setPost("");
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this._view.clearMessage(postingStatusToastId);
      this._view.setIsLoading(false);
    }
  }

  public checkButtonStatus(
    post: string,
    authToken: AuthToken | null,
    currentUser: User | null,
  ): boolean {
    return !post.trim() || !authToken || !currentUser;
  }
}
