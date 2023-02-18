/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
import axios from 'axios';
import type { Comment } from 'mnjsreact-comments';
import { useEffect, useState } from 'react';

type Props = {
  postId: string;
};

const CommentList = ({ postId }: Props): JSX.Element => {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async (): Promise<void> => {
    const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);

    setComments(res.data);
  };

  useEffect((): void => {
    fetchComments();
  }, []);

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
