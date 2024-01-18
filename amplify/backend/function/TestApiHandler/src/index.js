import mongoose from 'mongoose';

const DATABASE_NAME = 'cartapp';
const DATABASE_URL =
  'mongodb+srv://ayushporwal:my_mongodb_pwd@cluster0.t90pkcc.mongodb.net';

async function connectToDb() {
  try {
    const connectionInstance = await mongoose.connect(
      DATABASE_URL + '/' + DATABASE_NAME,
    );
    console.log('connectionInstance: ', connectionInstance);
    console.log(
      'connectionInstance Connection: ',
      connectionInstance.connection,
    );
    console.log(
      `Mongodb connected, host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error('Error connecting to database: ', error);
    throw new Error(error);
  }
}

const User = mongoose.model('User', {});

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  let users;
  try {
    await connectToDb(); // Wait for the database connection
    users = await User.find({});
    console.log('logging users:', users);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching users' }),
    };
  } finally {
    console.log('Finishing now: ', users);
    await mongoose.disconnect();
    return {
      statusCode: 200,
      // Uncomment below to enable CORS requests
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({ message: 'Query successful', data: users }),
    };
  }
};
