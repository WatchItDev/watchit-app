import React from 'react';

export interface NotLoggedInProps {
  icon: string;
  title: string;
  description: string;
}

export interface WithAuthProps {
  component: React.ComponentType;
  header: string;
  icon: string;
  description: string;
}
