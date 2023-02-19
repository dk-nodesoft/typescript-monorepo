/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
import axios from 'axios';
import type { Posts } from 'mnjsreact-query';
import { useEffect, useState } from 'react';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = (): JSX.Element => {
  const [posts, setPosts] = useState<Posts>({});

  // useEffect fetching data with cleanup preventing race condition.
  // you will se that the setPosts are only called once but the fetchPosts are called twice in development (strict mode)
  useEffect(() => {
    let ignore = false;

    fetchPosts().then((data) => {
      if (!ignore) {
        setPosts(data);
      }
    });

    return (): void => {
      ignore = true;
    };
  }, []);

  const fetchPosts = async (): Promise<Posts> => {
    const res = await axios.get('http://localhost:4002/posts');

    return res.data;
  };

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div className="card" style={{ width: '30%', marginBottom: '20px' }} key={post.id}>
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments}></CommentList>
          <CommentCreate postId={post.id}></CommentCreate>
        </div>
      </div>
    );
  });

  return <div className="d-flex flex-row flex-wrap justify-content-between">{renderedPosts}</div>;
};

export default PostList;
