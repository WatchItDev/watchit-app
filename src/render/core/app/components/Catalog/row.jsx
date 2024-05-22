import React, { memo } from 'react';
import uid from 'shortid';
import PropTypes from 'prop-types';
import gatewayHelper from '@helpers/gateway';
import { Box, styled } from '@mui/material';
import { Poster } from '@watchitapp/watchitapp-uix';

const CatalogRow = ({ chunk, chunkSize, style, onClick, end, cid }) => {
  return (
      <RowWrapper className='row-img' style={style}>
        {chunk.map((i) => (
            <Poster
                key={i.id || uid.generate()}
                img={gatewayHelper.dummyParse(i.images?.['medium'] ?? '')}
                onClick={() => { onClick(i); }}
                title={i.meta?.title}
                rate={i.meta?.rating}
                end={end}
                year={i.meta?.year}
                canHover={true}
            />
        ))}
        {chunk.length < chunkSize &&
            Array(chunkSize - chunk.length).fill(0).map(() => (
                <Poster
                    key={uid.generate()}
                    img={'https://i0.wp.com/www.themoviedb.org/t/p/w185/ncKCQVXgk4BcQV6XbvesgZ2zLvZ.jpg'}
                    title={''}
                    end={end}
                    empty
                />
            ))}
      </RowWrapper>
  );
};

CatalogRow.propTypes = {
  chunk: PropTypes.array.isRequired,
  chunkSize: PropTypes.number.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  end: PropTypes.bool.isRequired,
  cid: PropTypes.string,
};

export const RowWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '1rem',
  paddingRight: '1rem'
}));

export default memo(CatalogRow, (prevProps, nextProps) => (
    prevProps.chunkSize === nextProps.chunkSize &&
    prevProps.chunk.length === nextProps.chunk.length &&
    prevProps.end === nextProps.end &&
    prevProps.cid === nextProps.cid
));
