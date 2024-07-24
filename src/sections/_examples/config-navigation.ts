// utils
import { paramCase, snakeCase } from 'src/utils/change-case';

// ----------------------------------------------------------------------

const getHref = (category: string, name: string) => `/components/${category}/${paramCase(name)}`;

export const foundationNav = ['Colors', 'Typography', 'Shadows', 'Grid', 'Icons'].map((name) => ({
  name,
  href: getHref('foundation', name),
  icon: `/assets/icons/components/ic_${snakeCase(name)}.svg`,
}));

export const muiNav = [
  'Accordion',
  'Alert',
  'Autocomplete',
  'Avatar',
  'Badge',
  'Breadcrumbs',
  'Buttons',
  'Checkbox',
  'Chip',
  'Dialog',
  'List',
  'Menu',
  'Pagination',
  'Pickers',
  'Popover',
  'Progress',
  'Radio Button',
  'Rating',
  'Slider',
  'Stepper',
  'Switch',
  'Table',
  'Tabs',
  'Textfield',
  'Timeline',
  'Tooltip',
  'Transfer List',
  'Tree View',
  'Data Grid',
].map((name) => ({
  name,
  href: getHref('mui', name),
  icon: `/assets/icons/components/ic_${snakeCase(name)}.svg`,
}));

export const extraNav = [
  'Chart',
  'Map',
  'Editor',
  'Copy to clipboard',
  'Upload',
  'Carousel',
  'Multi language',
  'Animate',
  'Mega Menu',
  'Form Validation',
  'Lightbox',
  'Image',
  'Label',
  'Scroll',
  'Scroll Progress',
  'Snackbar',
  'Text Max Line',
  'Navigation Bar',
  'Organization Chart',
  'Markdown',
].map((name) => ({
  name,
  href: getHref('extra', name),
  icon: `/assets/icons/components/ic_extra_${snakeCase(name)}.svg`,
}));
