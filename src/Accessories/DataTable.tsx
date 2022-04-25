import React, { useContext, useEffect, useState, useRef } from 'react'
import {Table, TableHead as TableHeadLC, TableBody as TableBodyLC , TableRow,TableDataCell, 
  TableHeaderCell, Truncate, Button, theme, Box2, Tooltip, Chip, Flex, FlexItem, Text } from '@looker/components'
import {titleCaseHelper, sortHelper, defaultValueFormat, colors, lowerCaseHelper} from '../utils'
import styled from 'styled-components';
import {trim} from 'lodash'
import {AppContext} from '../context'
import {Timer} from '@styled-icons/material'

/**
 * Renders table consisting of scooter or technician data
 */
export const DataTable: React.FC = ({data, columnsToRender, initialSortValue, initialSortOrder}) => {
  // console.log("DataTable")
  // console.log({data, columnsToRender, initialSortValue, initialSortOrder})
  const {scooterToService, setScooterToService, setTechnicianToDispatch, windowHeight} = useContext(AppContext);
  const [tableData, setTableData] = useState(undefined)
  const [sortValue, setSortValue] = useState(undefined)
  const [sortOrder, setSortOrder] = useState(undefined)
  const [selectedRow, setSelectedRow] = useState(undefined)
  const prevSortValue = usePrevious(sortValue);
  const prevSortOrder = usePrevious(sortOrder);

  const handleRowClick = (id) => {
    const rowClicked = tableData[id.split("-").pop() || 0]
    setScooterToService(rowClicked)
    setTechnicianToDispatch(undefined)
    setSelectedRow(id.split("-").pop() || 0)
  } 

  const handleHeaderCellClick = (id) => {
    const thClicked =  document.getElementById(id);
    const thClickedDataAttr = thClicked.getAttribute('data');
    setSortValue(thClickedDataAttr)
    setSortOrder(prevSortOrder === "DESC" ? "ASC" : "DESC")
  } 

  const handleDispatchClick = (id) => {
    const rowDispatched = tableData[id.split("-").pop() || 0]
    setTechnicianToDispatch(rowDispatched)
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
      const sortedData = sortHelper({data, sortOrder, sortValue});
      setTableData(sortedData);
    }
  }, [sortValue, sortOrder, data])

  useEffect(()=> {
    if (scooterToService === undefined){
      setSelectedRow(undefined)
    }
  }, [scooterToService])

  return(
    tableData ? 
    <TableContainer height={Object.keys(tableData[0])[0].indexOf("scoot") > -1 ? 
    windowHeight - 140 : 
    ((windowHeight - 145) * .4)}>
      <Table>
      <TableHead 
        tableData={tableData} 
        columnsToRender={columnsToRender} 
        sortOrder={sortOrder} 
        sortValue={sortValue}
        handleHeaderCellClick={handleHeaderCellClick}
        />
      <TableBody 
        tableData={tableData} 
        columnsToRender={columnsToRender} 
        handleRowClick={handleRowClick}
        handleDispatchClick={handleDispatchClick}
        selectedRow={selectedRow}
        />
    </Table>
    </TableContainer> : "")
}

const TableHead = ({tableData, columnsToRender, sortOrder, sortValue, handleHeaderCellClick}) => {
  return (
    <StyledTableHead>
      <StyledTableRow background={colors.ui.light}>
        {columnsToRender.map((item, index)=> {
          const keyName = item.key;
          const headerCellKey = `TableHeaderCell-${keyName}-${index}`;
          if (keyName && tableData[0].hasOwnProperty(keyName)){
            return (
              <StyledTableHeaderCell 
              key={headerCellKey}
              id={headerCellKey}
              data={keyName}
              onClick={() => handleHeaderCellClick(headerCellKey)}
              >
                {titleCaseHelper(item.label)}
                {sortValue === keyName ? 
                  sortOrder === "ASC" ? " ▲ " : " ▼ "
                : ""}
              </StyledTableHeaderCell>)
          }
        })}
      </StyledTableRow>
    </StyledTableHead>
  )
}

const TableBody = ({tableData, columnsToRender, handleRowClick, handleDispatchClick, selectedRow}) => {
  return (
    <TableBodyLC>
        {tableData.map((item, index)=>{
          
        const isScooter = Object.keys(item)[0].indexOf("scoot") > -1 ;
        const partialKey = isScooter ? "scooters" : "technicians";
        const rowKey = `TableRow-${partialKey}-${trim(index)}`;

          return (
            <StyledTableRow
            key={rowKey}
            id={rowKey}
            onClick={() => isScooter ? handleRowClick(rowKey) : ""}
            background={
              index == selectedRow ? theme.colors.key : 
              index % 2 ? 
              colors.ui.hover : 
              colors.ui.light //ui2 for now, needs to be fixed
            }
              >
                {columnsToRender.map((innerItem, innerIndex)=> {
                  const keyName = innerItem.key;
                  const dataCellKey = `TableDataCell-${keyName}-${trim(index)}`
                  const isBattery = keyName.indexOf("battery") > -1 ? true : false;
                  const isStatus = keyName.indexOf("status") > -1 ? true : false;
                  const isDuration = keyName.indexOf("duration") > -1 ? true : false;

                  //use value initially
                  //use text if defined
                  let dataCellText = item[keyName] && 
                  (item[keyName].value || item[keyName].value >= 0) ? 
                  item[keyName].value : 
                  undefined;

                  if (item[keyName] && item[keyName].hasOwnProperty("text")) dataCellText = item[keyName].text
                  if (keyName && dataCellKey && (dataCellText || dataCellText >= 0)){
                    return (
                      <TableDataCell
                        key={dataCellKey}
                        id={dataCellKey}
                        pt={isScooter ? theme.sizes.xxxsmall : theme.sizes.medium}
                        pb={isScooter ? theme.sizes.xxxsmall : theme.sizes.medium}
                        >
                        <Truncate>
                          {isBattery ? <BatteryIndicator value={dataCellText}/>: 
                          isStatus ? 
                            <Status value={dataCellText} />
                            : isDuration ? 
                            <Flex>
                              <FlexItem>{dataCellText}</FlexItem>
                              <FlexItem>
                            <StyledButton onClick={(e) => {
                              e.stopPropagation();
                              handleDispatchClick(dataCellKey)}
                            }
                            size="xsmall"
                            background={theme.colors.key}
                            marginLeft={theme.sizes.xsmall}
                            iconBefore={<Timer />}
                            disabled={keyName.indexOf("duration") > -1 ? false : true}
                            >Dispatch</StyledButton></FlexItem>
                            </Flex>
                            : <Text>{dataCellText}</Text> }
                  

                        </Truncate>                
                        </TableDataCell>)
                  }
            })}
              </StyledTableRow>
          )
        })}
      </TableBodyLC>
  )
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const BatteryIndicator = ({value}) => {
  let background = colors.battery.high;
  if (value < 25) background = colors.battery.low
  else if (value < 50) background = colors.battery.medium
  return (
 <IndicatorContainer>
   <Tooltip content={`${value}%`}>
    <Indicator background={background} width={`${value}%`} height="100%"/>
 </Tooltip>
 </IndicatorContainer>
  )
}

const Status = ({value}) => {
  // console.log("Status")
  // console.log({value})

  let valueAsKey = value;
  if (valueAsKey.indexOf(":") > -1 ) valueAsKey = valueAsKey.split(":").pop().trim();
  valueAsKey = lowerCaseHelper(valueAsKey.replace(/[\W_]+/g,"_"));
  return (
    <StyledChip background={colors.status[valueAsKey]}
      color={ colors.text.primary}
      readOnly={true}
    >{value}</StyledChip>
  )
}

 const TableContainer = styled(Box2)<{
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

 const StyledTableHead = styled(TableHeadLC)`
  position: sticky; 
  top: 0; z-index: 1;`;

 const StyledTableRow = styled(TableRow)<{
  background: string,
  padding: string,
}>`
  background: ${({ background }) => background};
  padding: ${({ padding }) => padding};
  cursor: pointer
`
const StyledButton = styled(Button)<{
  marginLeft: string
  background: string
}>`
margin-left: ${({ marginLeft }) => marginLeft};
background: ${({ background }) => background};
border-radius: 0;



`

const StyledTableHeaderCell = styled(TableHeaderCell)<{
}>`
font-weight: bold;
`

const StyledChip = styled(Chip)<{
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

const IndicatorContainer = styled.div`
  border: 1px solid ${theme.colors.ui4};
  height: 20px; 
  width: 80%; 
  margin: 0 auto;
  border-radius: ${({ theme }) => `${theme.sizes.xsmall}`};
  overflow: hidden;
  `

const Indicator = styled.div<{
  background: string,
  width: string,
  height: string
}>`
background: ${({ background }) => `${background}`};
width: ${({ width }) => width};
height: ${({ height }) => height};
`


