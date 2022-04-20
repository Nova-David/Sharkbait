import User from "./User";

const DUMMY_DATA = [
  new User("1", "David", "Hello, how are you?", "now", "", false),
  new User("2", "Austin", "Hi!", "3m ago", "", false),
  new User(
    "3",
    "Mom",
    "Can you pick up your brother in 30 minutes?",
    "2h ago",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/2048px-User_icon_2.svg.png",
    true
  ),
  new User("4", "Dr. Kumar", "Presentations next week.", "3h ago", "", true),
  new User(
    "5",
    "JJ",
    "We are number one!",
    "1d ago",
    "",
    true
  ),
  new User(
    "6",
    "Haani",
    "Meeting tomorrow?",
    "1d ago",
    "",
    true
  ),
  new User("7", "User", "Hello, how are you?", "3d ago", "", true),
  new User("8", "User", "Hello, how are you?", "3d ago", "", false),
  new User("9", "User", "Hello, how are you?", "3d ago", "", true),
  new User("10", "User", "Hello, how are you?", "3d ago", "", false),
  new User("11", "User", "Hello, how are you?", "3d ago", "", true),
  new User("12", "User", "Hello, how are you?", "3d ago", "", true),
];

export default DUMMY_DATA;
