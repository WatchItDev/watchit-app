import { FC, useState } from 'react';
import { styled, Box, BoxProps, Typography } from '@mui/material'
/* import { Check } from '@mui/icons-material'
import { withTheme } from '../../../hoc/withTheme' */

export type Item = {
  id: string
  title: string
}

export type ListItemProps = {
  defaultSelect?:string
  list:Item[]
  title?:string
  onChange?: ( id: string )=> void
}

const ListItems: FC<ListItemProps> = ( props ) : JSX.Element => {
  const [setSelected] = useState( props.defaultSelect || '' )

  // @ts-ignore
  const handleOnChange = ( id:string ) => setSelected(id)

  return (
    <Box sx={{margin:'0 10px'}}>
      {props.title
        && <Typography noWrap
              sx={{ margin:'0 0 10px 0' }}
            >
              {props.title}
           </Typography>
      }
      { props.list.map(( item:Item ) => {
        return(
          <ListItemWrapper onClick={ () => handleOnChange( item.id )}sx={{ paddingLeft:props.title ? '16px' : '0' }}>
            <Typography noWrap
                sx={{margin:'5px 0'}}
              >
                {item.title}
            </Typography>
            {/* <Check sx={{
                visibility:`${ item.id == selected ? 'visible' : 'hidden' }`,
                width:'18px',
                height:'auto',
                marginLeft:'1.5rem',
                color: '#D1D2D3 !important'
              }}
            /> */}
          </ListItemWrapper>
        )
      })}
    </Box>
  )
}

const ListItemWrapper = styled(Box)<BoxProps >(() => ({
  display: 'flex',
  alignitem: 'center',
  justifyContent: 'space-between',
  cursor:'pointer',
  margin:'0 0.8rem',
  userSelect:'none',
}))

export default ListItems
