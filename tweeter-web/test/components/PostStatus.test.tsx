import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import {
  mock,
  instance,
  verify,
  when,
  anyString,
  anything,
  deepEqual,
} from "@typestrong/ts-mockito";
import PostStatus from "../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { useUserInfo } from "../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";

// 1. Mock the hook using Jest
jest.mock("../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockUserInstance = new User("First", "Last", "@alias", "image_url");
  const mockAuthTokenInstance = new AuthToken("abc123", Date.now());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with Post Status and Clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { postStatusButton, clearButton, textArea, user } =
      renderPostStatusAndGetElements();

    await user.type(textArea, "Hello World");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when the text field is cleared", async () => {
    const { postStatusButton, clearButton, textArea, user } =
      renderPostStatusAndGetElements();

    await user.type(textArea, "Hello World");
    expect(postStatusButton).toBeEnabled();

    await user.clear(textArea);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    when(
      mockPresenter.checkButtonStatus(anyString(), anything(), anything()),
    ).thenReturn(false);

    const postText = "Testing 123";
    const { postStatusButton, textArea, user } = renderPostStatusAndGetElements(
      mockPresenterInstance,
    );

    await user.type(textArea, postText);
    await user.click(postStatusButton);

    verify(
      mockPresenter.submitPost(
        postText,
        deepEqual(mockUserInstance),
        deepEqual(mockAuthTokenInstance),
      ),
    ).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(<PostStatus presenter={presenter} />);
}

function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textArea = screen.getByPlaceholderText(/What's on your mind\?/i);

  return { user, postStatusButton, clearButton, textArea };
}
