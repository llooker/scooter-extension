import React, { useContext, useEffect, useState } from 'react'
import {Table, TableHead, TableBody, TableRow, TableDataCell, TableHeaderCell, Truncate } from '@looker/components'
import {titleCaseHelper} from '../utils'
import styled from 'styled-components';
import {trim} from 'lodash'
import {AppContext} from '../context'

export const DataTable: React.FC = ({data, columnsToRender}) => {
  // console.log("DataTable")
  // console.log({data, columnsToRender})
  // console.log(columnsToRender.length)

  const {setPointOfInterest} = useContext(AppContext);

  const handleTableRowClick = ({e, id}) => {
    const dataIndexClicked = data[id.split("-").pop() || 0]
    setPointOfInterest(dataIndexClicked)
  }

  return(
    <TableContainer>
      <Table>
      <TableHead>
            <TableRow>
              {columnsToRender.map((item)=> {
                return (
                  <TableHeaderCell key={`TableHeaderCell-${trim(item)}`}
                  id={`TableHeaderCell-${trim(item)}`}
                  >
                   <b>{titleCaseHelper(Object.keys(data[0])[item].split(".").pop())}</b>
                  </TableHeaderCell>)
              })}
            </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index)=>{
          return (
            <StyledTableRow
            key={`TableRow-${trim(index)}`}
            id={`TableRow-${trim(index)}`}
            onClick={(e) => handleTableRowClick({e, id: `TableRow-${trim(index)}`})}
            backgroundColor={
                  index % 2 ? "#DEE1E5" : "oops" //ui2 for now, needs to be fixed
                }
              >
                {columnsToRender.map((innerItem)=> {
              return (
                <TableDataCell
                key={`TableDataCell-${trim(innerItem)}`}
                  id={`TableDataCell-${trim(innerItem)}`}
                  >
                  <Truncate>
                    {Object.values(item)[innerItem].value}
                  </Truncate>
                </TableDataCell>)
            })}
              </StyledTableRow>
            
          )
        })}
      </TableBody>
    </Table>
    </TableContainer>)
}

const TableContainer = styled.div`
 max-width: 100%;
 max-height: 100%;
 overflow: scroll`;

 const StyledTableRow = styled(TableRow)<{
  backgroundColor: string
}>`
  background: ${({ backgroundColor }) => backgroundColor};
  cursor: pointer
`