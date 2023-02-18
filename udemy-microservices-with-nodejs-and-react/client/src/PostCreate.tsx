import axios from 'axios';
import { useState } from 'react';

const PostCreate = (): JSX.Element => {
  const [title, setTitle] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await axios.post('http://localhost:4000/posts', { title });

    setTitle('');
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input value={title} id="title" onChange={onChange} className="form-control"></input>
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </>
  );
};

export default PostCreate;
