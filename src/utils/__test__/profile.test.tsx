import { Profile } from '@lens-protocol/api-bindings'
import {URI} from "@lens-protocol/react"
import {ProfileId} from "@lens-protocol/react-web"
import { describe, it, expect } from 'vitest'

import { ProfileData } from '@src/auth/context/web3Auth/types'
import { buildProfileMetadata, filterHiddenProfiles } from '@src/utils/profile'

describe('testing buildProfileMetadata', () => {
  it('returns metadata object with cleaned social links', () => {
    const data: ProfileData = {
      backgroundImage: null, profileImage: null, username: "cswni",
      name: 'Cswni Inc',
      bio: 'Developer',
      socialLinks: { twitter: '_cswni', instagram: '', orb: '', farcaster: '' }
    }
    const profileImageURI = 'http://example.com/profile.jpg'
    const backgroundImageURI = 'http://example.com/background.jpg'

    const result = buildProfileMetadata(data, profileImageURI, backgroundImageURI)

    expect(result).toEqual({
      $schema: "https://json-schemas.lens.dev/profile/2.0.0.json",
      lens: {
        id: expect.any(String),
        name: 'Cswni Inc',
        bio: 'Developer',
        picture: 'http://example.com/profile.jpg',
        coverPicture: 'http://example.com/background.jpg',
        attributes: [{ key: 'twitter', value: '_cswni', type: 'String' }],
      },
    })
  })

  it('removes empty values from metadata object', () => {
    const data: ProfileData = {
      backgroundImage: null, profileImage: null, username: "cswni",
      name: '',
      bio: 'null',
      socialLinks: { twitter: '', farcaster: '', orb: '', instagram: '' }
    }

    const result = buildProfileMetadata(data)

    expect(result).toEqual({
      $schema: "https://json-schemas.lens.dev/profile/2.0.0.json",
      lens: {
        id: expect.any(String),
        bio: 'null',
      },
    })
  })
})

const profile = {
  id: '0x0555' as ProfileId,
  metadata: {
    displayName: '###HIDDEN###',
    bio: 'Developer',
    picture: null,
    coverPicture: null,
    appId: null,
    rawURI: 'https://uri.com' as URI,
    attributes: null,
    __typename: 'ProfileMetadata'
  },
  __typename: 'Profile',
  invitedBy: null,
  txHash: '',
  createdAt: '',
} as Partial<Profile>

describe('testing filterHiddenProfiles', () => {
  it('filters out profiles with hidden indicators', () => {
    const profiles = [
      {
        ...profile,
        id: '1',
        metadata: {
          ...profile.metadata,
          displayName: '###HIDDEN###',
          bio: 'Developer',
        },
      },
      {
        ...profile,
        id: '2',
        metadata: {
          ...profile.metadata,
          displayName: 'demo',
          bio: '###HIDDEN###',
        },
      },
      {
        ...profile,
        id: '3',
        metadata: {
          ...profile.metadata,
          displayName: 'Carlos Perez',
          bio: 'Developer',
        },
      },
    ]

    const result = filterHiddenProfiles(profiles as Profile[])

    expect(result).toEqual([
      {
        ...profile,
        id: '3',
        metadata: {
          ...profile.metadata,
          displayName: 'Carlos Perez',
          bio: 'Developer',
        },
      },
    ])
  })

  it('returns undefined if input is undefined', () => {
    const result = filterHiddenProfiles()

    expect(result).toBeUndefined()
  })

  it('returns empty array if filtered all profiles', () => {
    const result = filterHiddenProfiles([profile] as Profile[])

    expect(result).toEqual([])
  })
})
