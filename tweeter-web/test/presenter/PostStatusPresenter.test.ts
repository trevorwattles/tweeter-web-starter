import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
  mock,
  instance,
  verify,
  spy,
  when,
  anything,
  capture,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const currentUser = new User("First", "Last", "@alias", "image_url");
  const postText = "Hello World";

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    mockStatusService = mock<StatusService>();

    const mockPostStatusViewInstance = instance(mockPostStatusView);

    // Stub displayInfoMessage to return a specific ID so we can verify its deletion
    when(
      mockPostStatusView.displayInfoMessage(anything(), anything()),
    ).thenReturn("messageId123");

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance),
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    // Stub the service getter to return our mock service
    // Note: Ensure your PostStatusPresenter has: public get service() { return this._service; }
    when(postStatusPresenterSpy.service).thenReturn(
      instance(mockStatusService),
    );
  });

  it("Tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(postText, currentUser, authToken);
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0),
    ).once();
  });

  it("Calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(postText, currentUser, authToken);

    // We use capture to verify the status object created inside the presenter
    const [capturedAuthToken, capturedStatus] = capture(
      mockStatusService.postStatus,
    ).last();

    expect(capturedAuthToken).toBe(authToken);
    expect(capturedStatus.post).toBe(postText);
    expect(capturedStatus.user).toBe(currentUser);
    verify(mockStatusService.postStatus(authToken, anything())).once();
  });

  it("tells the view to clear the info message, clear the post, and display a status posted message when successful", async () => {
    await postStatusPresenter.submitPost(postText, currentUser, authToken);

    verify(mockPostStatusView.deleteMessage("messageId123")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
    const error = new Error("Failed to post");
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost(postText, currentUser, authToken);

    // Verify error handling
    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post the status because of exception: Failed to post",
      ),
    ).once();

    // Still clears the "Posting status..." message
    verify(mockPostStatusView.deleteMessage("messageId123")).once();

    // Does NOT clear the post or show success
    verify(mockPostStatusView.setPost(anything())).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).never();
  });
});
