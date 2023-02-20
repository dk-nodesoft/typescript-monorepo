export type PostId = string;
export type CommentId = string;

export type Post = {
  id: PostId;
  title: string;
};

export type Posts = {
  [key: PostId]: Post;
};

export enum CommentStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected'
}

export type Comment = {
  id: CommentId;
  content: string;
  status: CommentStatus;
};

export type CommentsByPostId = {
  [key: CommentId]: Comment[];
};

export type QueryPosts = {
  [key: PostId]: Post & { comments: Comment[] };
};

export enum EventType {
  PostCreated = 'PostCreated',
  CommentCreated = 'CommentCreated',
  CommentUpdated = 'CommentUpdated',
  CommentModerated = 'CommentModerated'
}

export type Event<D = any> = {
  type: EventType;
  data: D;
};

export type EventPostCreated = {
  id: PostId;
  title: string;
};

export type EventCommentCreated = {
  id: CommentId;
  content: string;
  postId: PostId;
  status: CommentStatus;
};
