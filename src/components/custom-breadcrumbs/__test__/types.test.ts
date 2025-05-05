import React from 'react'
import { BreadcrumbsLinkProps, CustomBreadcrumbsProps } from '../types';

describe('[TYPES]: Breadcrumbs types testing', () => {
  it('to match snapshot', () => {
    const sampleLink: BreadcrumbsLinkProps = {
      name: 'Dashboard',
      href: '/dashboard',
      icon: React.createElement('span', null, '🏠'),
    };

    const sampleBreadcrumbs: CustomBreadcrumbsProps = {
      heading: 'Page Title',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/dashboard' },
      ],
      activeLast: true,
      moreLink: ['https://example.com'],
      action: React.createElement('button', null, 'Action'),
    };

    expect({ sampleLink, sampleBreadcrumbs }).toMatchSnapshot();
  });

  it('creates valid BreadcrumbsLinkProps with all properties', () => {
    const link: BreadcrumbsLinkProps = {
      name: 'Settings',
      href: '/settings',
      icon: React.createElement('span', null, '⚙️'),
    };

    expect(link).toHaveProperty('name', 'Settings');
    expect(link).toHaveProperty('href', '/settings');
    expect(link).toHaveProperty('icon');
  });

  it('creates valid BreadcrumbsLinkProps with only required properties', () => {
    // All properties are optional in BreadcrumbsLinkProps
    const minimalLink: BreadcrumbsLinkProps = {};
    expect(minimalLink).toEqual({});
  });

  it('creates valid CustomBreadcrumbsProps with all properties', () => {
    const breadcrumbs: CustomBreadcrumbsProps = {
      heading: 'Users',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Users', href: '/users' },
      ],
      activeLast: true,
      moreLink: ['https://docs.example.com/users'],
      action: React.createElement('button', null, 'Add user'),
      sx: { marginBottom: 2 }
    };

    expect(breadcrumbs).toHaveProperty('heading', 'Users');
    expect(breadcrumbs).toHaveProperty('links');
    expect(breadcrumbs.links).toHaveLength(2);
    expect(breadcrumbs).toHaveProperty('activeLast', true);
    expect(breadcrumbs).toHaveProperty('moreLink');
    expect(breadcrumbs).toHaveProperty('action');
    expect(breadcrumbs).toHaveProperty('sx');
  });

  it('creates valid CustomBreadcrumbsProps with only required properties', () => {
    const minimalBreadcrumbs: CustomBreadcrumbsProps = {
      links: [{ name: 'Home', href: '/' }],
    };

    expect(minimalBreadcrumbs).toHaveProperty('links');
    expect(minimalBreadcrumbs.links).toHaveLength(1);
    expect(minimalBreadcrumbs.heading).toBeUndefined();
    expect(minimalBreadcrumbs.activeLast).toBeUndefined();
    expect(minimalBreadcrumbs.moreLink).toBeUndefined();
    expect(minimalBreadcrumbs.action).toBeUndefined();
  });

  it('supports an array of strings for moreLink property', () => {
    const breadcrumbs: CustomBreadcrumbsProps = {
      links: [{ name: 'Home' }],
      moreLink: ['https://example.com/docs', 'https://example.com/help'],
    };

    expect(Array.isArray(breadcrumbs.moreLink)).toBe(true);
    expect(breadcrumbs.moreLink).toHaveLength(2);
    expect(typeof breadcrumbs.moreLink![0]).toBe('string');
  });

  it('supports empty links array', () => {
    const breadcrumbs: CustomBreadcrumbsProps = {
      links: [],
    };

    expect(breadcrumbs.links).toEqual([]);
  });
});
