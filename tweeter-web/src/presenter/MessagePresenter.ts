import { Presenter, messageView } from "./Presenter";

export interface MessageView extends messageView {
  setIsLoading: (isLoading: boolean) => void;
}

export abstract class MessagePresenter<
  V extends MessageView,
> extends Presenter<V> {
  protected async doLoadingMessageOperation(
    message: string,
    description: string,
    operation: () => Promise<void>,
  ) {
    let messageId = "";
    try {
      this.view.setIsLoading(true);
      messageId = this.view.displayInfoMessage(message, 0);
      await this.doFailureReportingOperation(operation, description);
    } finally {
      this.view.deleteMessage(messageId);
      this.view.setIsLoading(false);
    }
  }
}
