import { Divider, styled, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import React, { useState } from 'react';
import Feed from 'src/components/feed/Feed';
import MyProfileCard from 'src/components/profile/MyProfileCard';
import { DataQuery, PostInteractionType, PostOrder } from 'src/db/apis/DataQuery';
import { UserEntity } from 'src/db/entities/users/UserEntity';
import useAuth from 'src/hooks/useAuth';
import { convertToObject } from 'typescript';
import ProfileCard from './ProfileCard';

interface ProfileCardProps {
  profileUser: UserEntity;
}

enum FeedSelection {
  submission = PostInteractionType.Submission,
  favorite = PostInteractionType.Favorite,
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  border: 0,
  marginTop: theme.spacing(1/2),
  marginBottom: theme.spacing(1/2),
  '& .MuiToggleButtonGroup-root': {

  },
  '& .MuiToggleButtonGroup-grouped': {
    //margin: theme.spacing(0.5),
  },
}));

const queryGenerator = (profileID: string, feedSelection: FeedSelection) => async function getNewPosts(lastPage: any) {
  try {
    if (feedSelection === FeedSelection.submission) {
      return await DataQuery.searchPostByUserID(profileID, PostInteractionType.Submission, PostOrder.Trendscore, lastPage);
    } else {
      return await DataQuery.searchPostByUserID(profileID, PostInteractionType.Favorite, PostOrder.Trendscore, lastPage);
    }
  } catch (error) {
    console.log(error)
  }
};

export default function ProfileFeed( { profileUser }: ProfileCardProps ) {
  const [feedSelection, setFeedSelection] = useState<FeedSelection>(FeedSelection.submission)
  let [feedSelectionQueryCall, setFeedSelectionQueryCall] = useState(() => queryGenerator(profileUser.id, feedSelection));

  async function getNewPosts() {
    try {
      if (feedSelection === FeedSelection.submissions) {
        return await DataQuery.searchPostByUserID(profileUser.id, PostInteractionType.Submission, PostOrder.Trendscore);
      } else {
        return await DataQuery.searchPostByUserID(profileUser.id, PostInteractionType.Favorite, PostOrder.Trendscore);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleFeedSelectionToggle = (event: React.MouseEvent<HTMLElement>, newFeedSelection: FeedSelection | null) => {
    if (newFeedSelection !== null) {
      setFeedSelection(newFeedSelection);
    }
  };
  //when feed selec
  useUpdateEffect(() => {
    setFeedSelectionQueryCall(() => queryGenerator(profileUser.id, feedSelection));
  }, [feedSelection]);

  return (
    <> 
      {authedUser && authedUser.nonauth.profile.username === profileUser.profile.username ?
        <ProfileCard profileUser={profileUser} /> //TODO consider changing back to myprofilecard
      : 
        <ProfileCard profileUser={profileUser} />
      }
      <Divider variant="fullWidth" />
      <StyledToggleButtonGroup fullWidth value={feedSelection} exclusive onChange={handleFeedSelectionToggle}>
        <ToggleButton disableRipple value={FeedSelection.submission}>게시물</ToggleButton>
        <ToggleButton disableRipple value={FeedSelection.favorite}>저장됨</ToggleButton>
      </StyledToggleButtonGroup>
      {/* <Divider sx={{mb:theme.spacing(2)}} variant="fullWidth" /> */}
      <Feed getNewPosts={getNewPosts} />
    </>
  )
}
