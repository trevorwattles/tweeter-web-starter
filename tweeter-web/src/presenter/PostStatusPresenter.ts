import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessagePresenter, MessageView } from "./MessagePresenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends MessagePresenter<PostStatusView> {
  private _service = new StatusService();

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken,
  ) {
    await this.doLoadingMessageOperation(
      "Posting status...",
      "post the status",
      async () => {
        const status = new Status(post, currentUser, Date.now());
        await this._service.postStatus(authToken, status);
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
    );
  }

  public checkButtonStatus(
    post: string,
    authToken: AuthToken | null,
    currentUser: User | null,
  ): boolean {
    return !post.trim() || !authToken || !currentUser;
  }
}
