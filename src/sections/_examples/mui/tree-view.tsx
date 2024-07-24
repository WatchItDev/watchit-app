// @mui
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

const StyledTreeView = styled(TreeView)({
  height: 240,
  flexGrow: 1,
  maxWidth: 400,
});

const StyledTreeItem = styled((props: TreeItemProps) => <TreeItem {...props} />)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

// ----------------------------------------------------------------------

export default function TreeViews() {
  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Tree View"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Tree View' },
            ]}
            moreLink={['https://mui.com/components/tree-view']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          <ComponentBlock title="Basic">
            <StyledTreeView
              defaultCollapseIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              defaultExpandIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              defaultEndIcon={null}
            >
              <TreeItem nodeId="1" label="Applications">
                <TreeItem nodeId="2" label="Calendar" />
                <TreeItem nodeId="3" label="Chrome" />
                <TreeItem nodeId="4" label="Webstorm" />
              </TreeItem>
              <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="10" label="OSS" />
                <TreeItem nodeId="6" label="Material-UI">
                  <TreeItem nodeId="7" label="src">
                    <TreeItem nodeId="8" label="index.js" />
                    <TreeItem nodeId="9" label="tree-view.js" />
                  </TreeItem>
                </TreeItem>
              </TreeItem>
            </StyledTreeView>
          </ComponentBlock>

          <ComponentBlock title="Multi Select">
            <StyledTreeView
              multiSelect
              defaultCollapseIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              defaultExpandIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              defaultEndIcon={null}
            >
              <TreeItem nodeId="1" label="Applications">
                <TreeItem nodeId="2" label="Calendar" />
                <TreeItem nodeId="3" label="Chrome" />
                <TreeItem nodeId="4" label="Webstorm" />
              </TreeItem>
              <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="6" label="Material-UI">
                  <TreeItem nodeId="7" label="src">
                    <TreeItem nodeId="8" label="index.js" />
                    <TreeItem nodeId="9" label="tree-view.js" />
                  </TreeItem>
                </TreeItem>
              </TreeItem>
            </StyledTreeView>
          </ComponentBlock>

          <ComponentBlock title="Customization">
            <StyledTreeView defaultExpanded={['1']}>
              <StyledTreeItem nodeId="1" label="Main">
                <StyledTreeItem nodeId="2" label="Hello" />
                <StyledTreeItem nodeId="3" label="Subtree with children">
                  <StyledTreeItem nodeId="6" label="Hello" />
                  <StyledTreeItem nodeId="7" label="Sub-subtree with children">
                    <StyledTreeItem nodeId="9" label="Child 1" />
                    <StyledTreeItem nodeId="10" label="Child 2" />
                    <StyledTreeItem nodeId="11" label="Child 3" />
                  </StyledTreeItem>
                  <StyledTreeItem nodeId="8" label="Hello" />
                </StyledTreeItem>
                <StyledTreeItem nodeId="4" label="World" />
                <StyledTreeItem nodeId="5" label="Something something" />
              </StyledTreeItem>
            </StyledTreeView>
          </ComponentBlock>
        </Box>
      </Container>
    </>
  );
}
