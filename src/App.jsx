import { useEffect, useState } from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { get } from 'aws-amplify/api';

async function getUsers() {
  try {
    const restOperation = get({
      apiName: 'testapi',
      path: '/test',
    });
    const result = await restOperation.response;
    return await result.body.json();
  } catch (error) {
    console.log('GET call failed: ', error);
  }
}

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((data) => setUsers(data.data));
  }, []);
  return (
    <>
      <p>Howing fetched users</p>
      <ul>
        {users.map((user) => (
          <JsonView src={user} key={user._id} />
        ))}
      </ul>
    </>
  );
}

export default App;
