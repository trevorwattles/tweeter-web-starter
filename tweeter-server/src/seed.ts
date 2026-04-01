import { DynamoDAOFactory } from "./model/dao/dynamodb/DynamoDAOFactory";
import { UserService } from "./model/service/UserService";
import { FollowService } from "./model/service/FollowService";
import { StatusService } from "./model/service/StatusService";
import { User, Status } from "tweeter-shared";

async function seed() {
  const factory = new DynamoDAOFactory();
  const userService = new UserService(factory);
  const followService = new FollowService(factory);
  const statusService = new StatusService(factory);

  console.log("Starting bulk data seed for pagination testing...");

  const authTokens: Record<string, any> = {};

  // Log in as main user
  console.log("Logging in main user @twattles...");
  let twattlesToken;
  try {
    const res = await userService.login({ alias: "@twattles", password: "password" } as any);
    twattlesToken = res.authToken;
  } catch (e: any) {
    console.log("Main user @twattles not found. Attempting to register...");
    const res = await userService.register({
      firstName: "Trevor",
      lastName: "Wattles",
      alias: "@twattles",
      password: "password",
      imageStringBase64: "", 
    } as any);
    twattlesToken = res.authToken;
  }

  // Generate 25 dummy users
  const dummyUsers = [];
  for (let i = 1; i <= 25; i++) {
    dummyUsers.push({
      firstName: `Dummy${i}`,
      lastName: `User`,
      alias: `@dummy${i}`,
      password: "password"
    });
  }

  console.log("Registering 25 dummy users...");
  // Register in batches of 5 to not overwhelm AWS limits (though limits are 4 RCUs so might throttle, let's just do sequential)
  for (const u of dummyUsers) {
    try {
      const res = await userService.register({
        firstName: u.firstName,
        lastName: u.lastName,
        alias: u.alias,
        password: u.password,
        imageStringBase64: "",
      } as any);
      authTokens[u.alias] = res.authToken;
      console.log(`Registered ${u.alias} `);
    } catch (e) {
      // Already exists, try login
      const res = await userService.login({ alias: u.alias, password: u.password } as any);
      authTokens[u.alias] = res.authToken;
    }
  }

  console.log("\nSetting up mutually following relationships for pagination...");
  const twattlesUserInfo = { firstName: "Trevor", lastName: "Wattles", alias: "@twattles", name: "Trevor Wattles" };

  for (const u of dummyUsers) {
    const token = authTokens[u.alias];
    if (!token) continue;
    
    // Dummy follows @twattles
    try {
      await followService.follow({
        authToken: token,
        userToFollow: twattlesUserInfo
      } as any);
    } catch(e) {}

    // @twattles follows Dummy
    try {
      await followService.follow({
        authToken: twattlesToken,
        userToFollow: { firstName: u.firstName, lastName: u.lastName, alias: u.alias, name: `${u.firstName} ${u.lastName}` }
      } as any);
    } catch(e) {}
  }
  console.log("Done adding 25 followers and 25 followees for @twattles.");

  console.log("\nPosting 30 statuses to trigger feed pagination...");
  // Have the dummy users post 1 status each (goes to @twattles feed)
  console.log("Dummy users posting statuses...");
  let count = 0;
  for (const u of dummyUsers) {
    const token = authTokens[u.alias];
    const user = new User(u.firstName, u.lastName, u.alias, "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
    const status = new Status(`This is pagination-test status #${++count} from ${u.alias}`, user, Date.now() + count); // offset timestamp so it sorts properly
    
    try {
      await statusService.postStatus({
        authToken: token,
        newStatus: status
      } as any);
    } catch(e) {}
  }

  // Have @twattles post 15 statuses directly to their own story
  console.log("@twattles posting statuses...");
  const twattlesUser = new User("Trevor", "Wattles", "@twattles", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
  for (let i = 1; i <= 15; i++) {
    const status = new Status(`My own story post #${i} for pagination testing`, twattlesUser, Date.now() + count + i);
    try {
      await statusService.postStatus({
        authToken: twattlesToken,
        newStatus: status
      } as any);
    } catch(e) {}
  }

  console.log("\nBulk seeding complete! You now have 25+ followers, 25+ followees, and 40+ statuses in your feed/story to scroll.");
}

seed().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
