import {TableHead as TableHeadLC , TableRow, 
  TableHeaderCell, Button, theme, Box2, Chip } from '@looker/components'
import styled from 'styled-components';

export const TableContainer = styled(Box2)<{
  height: string
}>`
  height: ${({ height }) => height};
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  & {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  }
`

export const StyledTableHead = styled(TableHeadLC)`
  position: sticky; 
  top: 0; 
  z-index: 1;
`

export const StyledTableRow = styled(TableRow)<{
  background: string,
  hoverBackground: string,
  hoverColor: string,
  marginTop: string,
  marginBottom: string,
}>`
  background: ${({ background }) => background};
  cursor: pointer;
  margin-top: ${({ marginTop }) => marginTop};
  margin-bottom: ${({ marginBottom }) => marginBottom};
  &:hover {
    background: ${({ hoverBackground }) => hoverBackground};
    color: ${({ hoverColor }) => hoverColor};
  }
`
export const StyledButton = styled(Button)<{
  marginLeft: string
  background: string
}>`
margin-left: ${({ marginLeft }) => marginLeft};
background: ${({ background }) => background};
border-radius: 0;
`

export const StyledTableHeaderCell = styled(TableHeaderCell)<{
}>`
font-weight: bold;
`

export const StyledChip = styled(Chip)<{
  background: string,
  color: string
}>`
background: ${({ background }) => background};
color: ${({ color }) => color};
border-radius: ${({ theme }) => `${theme.sizes.xsmall}`};
&:hover {
  background: ${({ background }) => background};
}
`
export const IndicatorContainer = styled.div<{
  background: string,
}>`
  border: ${({ background }) => `1px solid ${background}`};
  height: 20px; 
  width: 80%; 
  margin: 0 auto;
  border-radius: ${({ theme }) => `${theme.sizes.xsmall}`};
  overflow: hidden;
`

export const Indicator = styled.div<{
  background: string,
  width: string,
  height: string
}>`
  background: ${({ background }) => `${background}`};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`
