import {
  Paper,
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  Chip,
  CardActions,
  Alert,
} from '@mui/material';

import { Markdown } from '../../components/Markdown';
import { getRawPath } from '../../components/CollabEditButton';
import { Navigation } from '../../components/NavigationButton';
import { FlexBox } from '../../components/FlexBox';
import { useComponent } from '@state-less/react-client';
import {
  UpDownButtons,
  VotingApp,
  calc,
} from '../../server-components/examples/VotingApp';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { NewPost } from './newPost';
import { NewPostButton } from '.';
import {
  Comments,
  CommunityComments,
} from '../../server-components/examples/Comments';
import { useSyncedState } from '../../lib/hooks';

export const PostsPage = (props) => {
  const params = useParams();
  if (params.post === 'new') {
    return <NewPost />;
  }
  return (
    <Container maxWidth="lg" disableGutters sx={{ py: 4 }}>
      <Post id={params.post} />
      <ComposeAnswer id={params.post} />
    </Container>
  );
};

const Post = ({ id }) => {
  const [forum] = useComponent('community-forum');
  const [component, { error, refetch }] = useComponent(id);
  const [edit, setEdit] = useState(false);
  const [body, setBody, { loading }] = useSyncedState(
    component?.props?.body,
    component?.props?.setBody
  );
  const editTitle = edit ? 'Ok' : 'Edit';
  if (error) return null;
  return (
    <>
      <FlexBox sx={{ alignItems: 'center', height: 'min-content' }}>
        <CardHeader title={component?.props?.title}></CardHeader>
        <NewPostButton />
      </FlexBox>
      <Card sx={{ mb: 1 }} color="info">
        {component?.props?.deleted && (
          <Alert severity="error">This post has been deleted.</Alert>
        )}
        <FlexBox>
          <UpDownButtons
            id={component?.children[0]?.component}
            wilson={false}
          />
          <Box sx={{ display: 'flex', width: '100%' }}>
            <CardContent sx={{ flex: 1 }}>
              {edit && (
                <TextField
                  color={
                    component?.props?.body === body ? 'success' : 'primary'
                  }
                  multiline
                  fullWidth
                  label={
                    'Body' + (component?.props?.body !== body ? '...' : '')
                  }
                  rows={7}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                ></TextField>
              )}
              {!edit && <Markdown>{component?.props?.body}</Markdown>}
            </CardContent>
          </Box>
        </FlexBox>
        <CardActions>
          {component?.props?.canDelete && (
            <Button onClick={() => component.props.del()}>Delete</Button>
          )}
          {component?.props?.canDelete && (
            <Button key={editTitle} onClick={() => setEdit(!edit)}>
              {editTitle}
            </Button>
          )}
        </CardActions>
      </Card>
      {component?.children.slice(1)?.map((comment) => {
        return (
          <Card sx={{ mb: 1 }} color="info">
            <FlexBox>
              <UpDownButtons
                id={comment?.children[0]?.component}
                wilson={false}
              />
              <Box>
                <CardContent>
                  <Markdown>{comment?.props?.body}</Markdown>
                </CardContent>
              </Box>
            </FlexBox>
            <CommunityComments id={comment?.children[1]?.component} />
          </Card>
        );
      })}
    </>
  );
};

const ComposeAnswer = ({ id }) => {
  const [component, { error, loading }] = useComponent(id);
  const [body, setBody] = useState('');
  return (
    <Card sx={{ p: 2 }}>
      <TextField
        multiline
        fullWidth
        label="Answer"
        rows={7}
        onChange={(e) => setBody(e.target.value)}
        value={body}
      />
      <CardActions>
        <Button
          disabled={body.length === 0}
          onClick={async () => {
            setBody('');
            await component?.props?.createAnswer({
              body,
            });
          }}
        >
          Post Answer
        </Button>
      </CardActions>
    </Card>
  );
};