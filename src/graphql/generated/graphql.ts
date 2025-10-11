import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Timestamp: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type AgentInput = {
  message: Scalars['String']['input'];
};

export type AgentOutput = {
  __typename?: 'AgentOutput';
  done?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Message>;
};

export type BaseContent = {
  __typename?: 'BaseContent';
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  user: User;
  visibility: VisibilitySetting;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Comment = {
  __typename?: 'Comment';
  base: BaseContent;
  body: Scalars['String']['output'];
  id: Scalars['String']['output'];
  parent?: Maybe<Comment>;
  post: Post;
  replies?: Maybe<Array<Comment>>;
};


export type CommentRepliesArgs = {
  page?: InputMaybe<PaginationInput>;
};

export type CommentByIdentifierInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type CommentsFilterInput = {
  parentId?: InputMaybe<Scalars['Int']['input']>;
  postId?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateCommentInput = {
  body: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  postId: Scalars['Int']['input'];
};

export type CreatePostInput = {
  body: Scalars['String']['input'];
  title: Scalars['String']['input'];
  visibility: VisibilitySetting;
};

export type CreateUserInput = {
  address: Scalars['String']['input'];
  bio: Scalars['String']['input'];
  cover?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  picture?: InputMaybe<Scalars['String']['input']>;
  socials?: InputMaybe<Array<SocialInput>>;
  username: Scalars['String']['input'];
};

export type Edge = {
  __typename?: 'Edge';
  followedAt?: Maybe<Scalars['Date']['output']>;
  isBlocked: Scalars['Boolean']['output'];
  isFollowing: Scalars['Boolean']['output'];
  user: User;
};

export type EdgeByIdentifierInput = {
  toUserId: Scalars['Int']['input'];
};

export enum EdgeState {
  Block = 'BLOCK',
  Follow = 'FOLLOW',
  None = 'NONE'
}

export type HidePostInput = {
  postId: Scalars['Int']['input'];
};

export type MediaAttachment = {
  __typename?: 'MediaAttachment';
  cid: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: Comment;
  createPost: Post;
  createUser: User;
  hidePost?: Maybe<Scalars['Boolean']['output']>;
  sendHumanMessage?: Maybe<Message>;
  setEdgeStatus: Edge;
  updateComment: Comment;
  updatePost: Post;
  updateUser: User;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationHidePostArgs = {
  input: HidePostInput;
};


export type MutationSendHumanMessageArgs = {
  input: AgentInput;
};


export type MutationSetEdgeStatusArgs = {
  input: SetEdgeStatusInput;
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Post = {
  __typename?: 'Post';
  base: BaseContent;
  body: Scalars['String']['output'];
  comments?: Maybe<Array<Comment>>;
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};


export type PostCommentsArgs = {
  page?: InputMaybe<PaginationInput>;
};

export type PostByIdentifierInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type PostFilterInput = {
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type Profile = {
  __typename?: 'Profile';
  bio: Scalars['String']['output'];
  cover?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getComment?: Maybe<Comment>;
  getComments?: Maybe<Array<Comment>>;
  getEdgeStatus?: Maybe<Edge>;
  getPost?: Maybe<Post>;
  getPosts: Array<Post>;
  getUser?: Maybe<User>;
};


export type QueryGetCommentArgs = {
  input: CommentByIdentifierInput;
};


export type QueryGetCommentsArgs = {
  input: CommentsFilterInput;
  page?: InputMaybe<PaginationInput>;
};


export type QueryGetEdgeStatusArgs = {
  input: EdgeByIdentifierInput;
};


export type QueryGetPostArgs = {
  input: PostByIdentifierInput;
};


export type QueryGetPostsArgs = {
  input: PostFilterInput;
  page?: InputMaybe<PaginationInput>;
};


export type QueryGetUserArgs = {
  input: UserByIdentifierInput;
};

export type SetEdgeStatusInput = {
  status: EdgeState;
  toUserId: Scalars['Int']['input'];
};

export type Social = {
  __typename?: 'Social';
  platform: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type SocialInput = {
  platform: Scalars['String']['input'];
  url: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onAgentMessage?: Maybe<AgentOutput>;
};

export type UpdateCommentInput = {
  body: Scalars['String']['input'];
  id: Scalars['Int']['input'];
};

export type UpdatePostInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<VisibilitySetting>;
};

export type UpdateUserInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
  socials?: InputMaybe<Array<SocialInput>>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  address: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  profile?: Maybe<Profile>;
  socials?: Maybe<Array<Social>>;
  verified: Scalars['Boolean']['output'];
};

export type UserByIdentifierInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type UsersFilterInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum VisibilitySetting {
  FollowersOnly = 'FOLLOWERS_ONLY',
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type GetPostQueryVariables = Exact<{
  input: PostByIdentifierInput;
}>;


export type GetPostQuery = { __typename?: 'Query', getPost?: { __typename?: 'Post', body: string, id: number, title: string, base: { __typename?: 'BaseContent', active: boolean, createdAt: any, id: number, visibility: VisibilitySetting, user: { __typename?: 'User', address: string, createdAt: number, displayName: string, email: string, id: number, verified: boolean, profile?: { __typename?: 'Profile', bio: string, cover?: string | null, picture?: string | null, username: string } | null, socials?: Array<{ __typename?: 'Social', platform: string, url: string }> | null } } } | null };

export type GetPostsQueryVariables = Exact<{
  input: PostFilterInput;
  getPostsPage2?: InputMaybe<PaginationInput>;
}>;


export type GetPostsQuery = { __typename?: 'Query', getPosts: Array<{ __typename?: 'Post', body: string, id: number, title: string, base: { __typename?: 'BaseContent', visibility: VisibilitySetting, id: number, createdAt: any, active: boolean, user: { __typename?: 'User', address: string, createdAt: number, displayName: string, email: string, id: number, verified: boolean, profile?: { __typename?: 'Profile', bio: string, cover?: string | null, picture?: string | null, username: string } | null, socials?: Array<{ __typename?: 'Social', platform: string, url: string }> | null } } }> };


export const GetPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostByIdentifierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"socials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}}]}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<GetPostQuery, GetPostQueryVariables>;
export const GetPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostFilterInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getPostsPage2"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getPostsPage2"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"socials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<GetPostsQuery, GetPostsQueryVariables>;