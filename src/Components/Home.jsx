import React, { useContext } from 'react';
import TagBadges from './TagBadges';
import PostsList from './PostLists';
import { AuthContext } from './AuthContext';
import Announcements from './Announcements';
import Banner from './Banner';

const Home = () => {
    const { user } = useContext(AuthContext); // get logged-in user

    return (
        <div className="space-y-1.5">
            <Banner></Banner>
            <TagBadges />
            <PostsList user={user} /> {/* pass user prop */}
            <Announcements></Announcements>
        </div>
    );
};

export default Home;






