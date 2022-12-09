export interface StoreModel {
  user: UserInterface;
  post: PostInterface[];
  story: StoryInterface[];
  isLoading: boolean;
  isLoggedIn: boolean;
}

export interface UserInterface {
  _id: string;
  fname: string;
  lname: string;
  coverPic: string;
  createdAt: string;
  coverPicId: string;
  email: string;
  friends: [];
  isAdmin: boolean;
  profilePic: string;
  profilePicId: string;
  updatedAt: string;
}

export interface PostInterface {
  _id: string;
  userId: string;
  fname: string;
  lname: string;
  profilePic: string;
  desc: string;
  comments: [];
  image: string;
  imageID: string;
  likes: [];
  createdAt: string;
}

export interface StoryInterface {
  userId: string;
  fname: string;
  lname: string;
  profilePic: string;
  image: string;
  imageID: string;
}
