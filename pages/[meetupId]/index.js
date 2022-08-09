import React, { Fragment } from 'react';
import UseRouter from 'next/router';
import MeetupDetail from '../../components/meetups/MeetupDetail';
import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head'

const ShowDetail = (props) => {
  //   const router = useRouter();
  //   const id = router.query.meetupId;
  const { id, image, title, address, description } = props.meetupData;
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description}/>
      </Head>
      <MeetupDetail
        id={id}
        image={image}
        title={title}
        address={address}
        description={description}
      />
    </Fragment>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://new-user:mongo-pwd@cluster0.yvmpsni.mongodb.net/?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); //first argument of find is filter criteria while second argument  is only interst in id parameter
  client.close();
  

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };

}

export async function getStaticProps(context) {
  //fetch data from API

  const meetupId = context.params.meetupId;
  console.log(meetupId);

  const client = await MongoClient.connect(
    'mongodb+srv://new-user:mongo-pwd@cluster0.yvmpsni.mongodb.net/?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const seletedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });
  client.close();

  return {
    props: {
      meetupData: {
        id: seletedMeetup._id.toString(),
        title: seletedMeetup.title,
        address: seletedMeetup.address,
        image: seletedMeetup.image,
        description: seletedMeetup.description,
      },
    },
  };
}
export default ShowDetail;
