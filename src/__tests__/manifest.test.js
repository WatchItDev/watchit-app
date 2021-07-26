import fs from 'fs'
import path from 'path'
import * as manifest from '@public/manifest.json'

describe('Manifest', function () {

  it('should have valid `short_name`', function () {
    expect(manifest.short_name).toBeDefined()
    expect(manifest.short_name).toMatch(/WatchIT/)
  })

  it('should have valid `name`', function () {
    expect(manifest.name).toBeDefined()
    expect(manifest.name).toMatch(/WatchIT/)
  })

  it('should have valid `description`', function () {
    expect(manifest.description).toBeDefined()
    expect(manifest.description).toMatch(/Open Movies Everywhere/)
  })

  it('should have valid `start_url`', function () {
    expect(manifest.start_url).toBeDefined()
  })

  it('should have valid `display`', function () {
    expect(manifest.display).toBeDefined()
  })

  it('should have valid `theme_color`', function () {
    expect(manifest.theme_color).toBeDefined()
    expect(manifest.theme_color).toBe('#000000')
  })

  it('should have valid `background_color`', function () {
    expect(manifest.background_color).toBeDefined()
    expect(manifest.background_color).toBe('#000000')
  })

  it('should have valid icons', function () {
    expect(manifest.icons).toBeDefined()
    expect(Array.isArray(manifest.icons)).toBeTruthy()

    const iconExists = manifest.icons.map(function (i) {
      const iconPath = path.resolve('public', `${i.src}`)
      return fs.existsSync(iconPath)
    })

    expect(iconExists.every((e) => e === true)).toBeTruthy()

  })

})
