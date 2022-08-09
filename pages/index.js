import Head from 'next/head';
import React, { Fragment } from 'react';
import MeetupList from '../components/meetups/MeetupList';

import { MongoClient } from 'mongodb'; //this import used in getStaticProps ,which means this is not include inside client files

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetup</title>
        <meta
          name="description"
          content="browe highly reactive React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

export async function getStaticProps(context) {
  //fetch data from API
  const client = await MongoClient.connect(
    'mongodb+srv://new-user:mongo-pwd@cluster0.yvmpsni.mongodb.net/?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        id: meetup._id.toString(),
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
      })),
    },
    revalidate: 1,
  };
}

// export async function getServerSideProps(props){
// const rea=context.req;
// const rs=context.res;
// //fetch at from API
// return {
//   props:{
//     meetups:DUMMY_MEETUPS
//   }
// }
// }

export default HomePage;
