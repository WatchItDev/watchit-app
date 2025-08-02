import { FC } from 'react';
import ShareButton from '@src/components/share-button';
import { shareLinks, urlToShare } from '@src/sections/publication/CONSTANTS';
import { Post } from '@src/graphql/generated/graphql.ts';

interface Props {
  post: Post;
}

const PublicationShare: FC<Props> = ({ post }) => (
  <ShareButton
    placeholder="publicationId"
    pathPrefix="publication/"
    targetId={post.id}
    shareLinks={shareLinks}
    templateUrl={urlToShare}
    buttonVariant="text"
    buttonSx={{
      borderColor: '#FFFFFF',
      color: '#FFFFFF',
      height: 40,
      minWidth: 40,
    }}
  />
);

export default PublicationShare;
