import React, { useContext } from 'react';
import TagBadges from './TagBadges';
import PostLists from './PostLists';
import { AuthContext } from './AuthContext';
import Announcements from './Announcements';
import Banner from './Banner';
import LoadingSpinner from './LoadingSpinner';

const Home = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-2">
            <Banner />
            <TagBadges />
            <PostLists user={user} />
            <Announcements />
        </div>
    );
};

export default Home;
