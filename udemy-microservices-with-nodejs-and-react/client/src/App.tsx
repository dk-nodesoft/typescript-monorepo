import PostCreate from './PostCreate';
import PostList from './PostList';

const App = (): JSX.Element => {
  return (
    <div className="container">
      <h1>Create Post</h1>
      <PostCreate />
      <hr />
      <h1>Posts</h1>
      <PostList></PostList>
    </div>
  );
};

export default App;
