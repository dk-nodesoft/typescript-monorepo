export type Post = {
  id: string;
  title: string;
};

export type Posts = {
  [key: string]: Post;
};

export enum CommentStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected'
}

export type Comment = {
  id: string;
  content: string;
  status: CommentStatus;
};

export type CommentsByPostId = {
  [key: string]: Comment[];
};

export type QueryPosts = {
  [key: string]: Post & { comments: Comment[] };
};
