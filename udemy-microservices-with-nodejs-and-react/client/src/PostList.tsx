/* eslint-disable @typescript-eslint/no-floating-promises */
import axios from 'axios';
import type { Posts } from 'mnjsreact-posts';
import { useEffect, useState } from 'react';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = (): JSX.Element => {
  const [posts, setPosts] = useState<Posts>({});

  useEffect((): void => {
    fetchPosts();
  }, []);

  const fetchPosts = async (): Promise<void> => {
    const res = await axios.get('http://localhost:4000/posts');

    setPosts(res.data);
  };

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div className="card" style={{ width: '30%', marginBottom: '20px' }} key={post.id}>
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList postId={post.id}></CommentList>
          <CommentCreate postId={post.id}></CommentCreate>
        </div>
      </div>
    );
  });

  return <div className="d-flex flex-row flex-wrap justify-content-between">{renderedPosts}</div>;
};

export default PostList;
