import axios from 'axios';
import { useState } from 'react';

type Props = {
  postId: string;
};

const CommentCreate = ({ postId }: Props): JSX.Element => {
  const [content, setContent] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await axios.post(`http://localhost:4001/posts/${postId}/comments`, { content });

    setContent('');
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setContent(event.target.value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="comment">New Comment</label>
          <input value={content} onChange={onChange} id="comment" className="form-control" />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
