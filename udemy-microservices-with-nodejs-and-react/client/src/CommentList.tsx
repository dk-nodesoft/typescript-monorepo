/* eslint-disable react-hooks/exhaustive-deps */
import type { Comment } from 'mnjsreact-comments';

type Props = {
  comments: Comment[];
};

const CommentList = ({ comments }: Props): JSX.Element => {
  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
