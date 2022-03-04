import React, { useContext, useEffect, useState, useRef } from 'react'
import {Table, TableHead, TableBody, TableRow,TableDataCell, TableHeaderCell, Truncate } from '@looker/components'
import {titleCaseHelper} from '../utils'
import styled from 'styled-components';
import {trim, toLower} from 'lodash'
import {AppContext} from '../context'

export const DataTable: React.FC = ({data, columnsToRender, initialSortValue, initialSortOrder}) => {
  // console.log("DataTable")
  // console.log({data, columnsToRender, initialSortValue, initialSortOrder})

  const {setPointOfInterest, pointOfInterest} = useContext(AppContext);
  const [tableData, setTableData] = useState(undefined)
  const [sortValue, setSortValue] = useState(undefined)
  const [sortOrder, setSortOrder] = useState(undefined)
  const prevSortValue = usePrevious(sortValue);
  const prevSortOrder = usePrevious(sortOrder);

  const handleTableRowClick = ({e, id}) => {
    const rowClicked = tableData[id.split("-").pop() || 0]
    setPointOfInterest(rowClicked)
  } 

  const handleTableHeaderCellClick = ({ id}) => {
    const thClicked =  document.getElementById(id);
    const thClickedDataAttr = thClicked.getAttribute('data');
    setSortValue(thClickedDataAttr)
    setSortOrder(prevSortOrder === "DESC" ? "ASC" : "DESC")
  } 

  //initialize onload
  useEffect(() => {
    setSortValue(initialSortValue)
    setSortOrder(initialSortOrder)
  }, [])

  //listen to changes in props
  useEffect(() => {
    setSortValue(initialSortValue)
    setSortOrder(initialSortOrder)
  }, [initialSortValue, initialSortOrder]);

  useEffect(()=>{
    if (sortValue && sortOrder ){
      sortHelper();
    }
  }, [sortValue, sortOrder, data])


  function sortHelper(){
    const dataCopy = [...data]
    if (sortOrder === "ASC"){
      dataCopy.sort((a, b) => {   
        if (typeof a[`${sortValue}`].value === 'string'){
          const valueA = toLower(a[`${sortValue}`].value);
          const valueB = toLower(b[`${sortValue}`].value);
          if (valueA < valueB) return -1
          if (valueA > valueB) return 1
          return 0
        } else {
          return ([a[`${sortValue}`].value - b[`${sortValue}`].value])
        }
      })
    } else {
      dataCopy.sort((a, b) => {
        if (typeof a[`${sortValue}`].value === 'string'){
          const valueA = toLower(a[`${sortValue}`].value);
          const valueB = toLower(b[`${sortValue}`].value);
          if (valueA < valueB) return 1
          if (valueA > valueB) return -1
          return 0
        } else {
          return ([b[`${sortValue}`].value - a[`${sortValue}`].value] )
        }
      })
    }
    setTableData(dataCopy)
  }

  return(
    tableData ? 
    <TableContainer>
      <Table>
      <TableHead>
            <StyledTableRow>
              {columnsToRender.map((item)=> {
                return (
                  <TableHeaderCell 
                  key={`TableHeaderCell-${Object.keys(tableData[0])[item]}`}
                  id={`TableHeaderCell-${Object.keys(tableData[0])[item]}`}
                  data={`${Object.keys(tableData[0])[item]}`}
                  onClick={() => handleTableHeaderCellClick({id: `TableHeaderCell-${Object.keys(tableData[0])[item]}`})}
                  >
                   <b>{titleCaseHelper(Object.keys(tableData[0])[item].split(".").pop())}</b>
                   {sortValue === Object.keys(tableData[0])[item] ? 
                    ` ${sortOrder} `
                   : ""}
                  </TableHeaderCell>)
              })}
            </StyledTableRow>
      </TableHead>
      <TableBody>
        {tableData.map((item, index)=>{
          return (
            <StyledTableRow
            key={`TableRow-${Object.keys(item)[0].split(".")[0]}-${trim(index)}`}
            id={`TableRow-${Object.keys(item)[0].split(".")[0]}-${trim(index)}`}
            onClick={(e) => handleTableRowClick({e, id: `TableRow-${Object.keys(item)[0].split(".")[0]}-${trim(index)}`})}
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
    </TableContainer> : "")
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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}