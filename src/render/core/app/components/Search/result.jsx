import React from 'react';
import PointsLoader from '@components/PointsLoader';
import CustomScrollbars from '@components/Scroller';
import { Box, Typography, List, styled } from '@mui/material';
import SearchResultItem from './item';
import gateway from '@helpers/gateway';

const SearchResult = (props) => {
  return (
      <ResultsWrapper>
        {props.searching ? (
            <ResultsEmpty>
              <PointsLoader />
            </ResultsEmpty>
        ) : (
            <CustomScrollbars
                autoHide
                autoHeight
                autoHeightMax={500}
                autoHideTimeout={1000}
                autoHideDuration={200}
                thumbMinSize={30}
                universal
            >
              {props.result?.length > 0 ? (
                  <ResultsContent>
                    <ResultsCollection>
                      {props.result.map((i) => (
                          <SearchResultItem
                              key={i._id}
                              onClick={props.onClick}
                              {...Object.assign(i, {
                                image: gateway.parse(i.images?.small),
                              })}
                          />
                      ))}
                    </ResultsCollection>
                  </ResultsContent>
              ) : (
                  <ResultsEmpty>
                    <NoResultsText>No results were found</NoResultsText>
                  </ResultsEmpty>
              )}
            </CustomScrollbars>
        )}
      </ResultsWrapper>
  );
};

export default React.memo(SearchResult);

const ResultsWrapper = styled(Box)(() => ({
  width: '100%',
  position: 'absolute',
  zIndex: 100,
  left: 0,
  top: '100%',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const ResultsContent = styled(Box)(() => ({
  borderRadius: '5px',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  width: '100%',
}));

const ResultsCollection = styled(List)(() => ({
  margin: '1px 0 1rem 0',
  borderRadius: '2px',
  overflow: 'hidden',
  position: 'relative',
  listStyleType: 'none',
  padding: 0,
  border: 'none',
}));

const ResultsEmpty = styled(Box)(() => ({
  borderRadius: '5px',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
}));

const NoResultsText = styled(Typography)(() => ({
  fontWeight: 'bold',
  color: '#fff',
  fontSize: '1rem',
}));
