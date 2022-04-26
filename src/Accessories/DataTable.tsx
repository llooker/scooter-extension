import React, { useContext, useEffect, useState, useRef } from 'react'
import {Table, TableHead as TableHeadLC, TableBody as TableBodyLC , TableDataCell, 
  Truncate, theme, Tooltip,  Flex, FlexItem, Text } from '@looker/components'
import {titleCaseHelper, sortHelper, colors, lowerCaseHelper} from '../utils'
import {trim} from 'lodash'
import {AppContext} from '../context'
import {Timer} from '@styled-icons/material'
import {TableContainer, StyledTableHead, StyledTableRow, StyledButton, StyledTableHeaderCell, StyledChip, IndicatorContainer, Indicator} from './Styled'

/**
 * Renders table consisting of scooter or technician data
 */
export const DataTable: React.FC = ({data, columnsToRender, initialSortValue, initialSortOrder, style}) => {
  // console.log("DataTable")
  // console.log({data, columnsToRender, initialSortValue, initialSortOrder, style})
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
        style={style}
        />
      <TableBody 
        tableData={tableData} 
        columnsToRender={columnsToRender} 
        handleRowClick={handleRowClick}
        handleDispatchClick={handleDispatchClick}
        selectedRow={selectedRow}
        style={style}
        />
    </Table>
    </TableContainer> : "")
}

const TableHead = ({tableData, columnsToRender, sortOrder, sortValue, handleHeaderCellClick, style}) => {
  const {zebra, pt, pb} = style;
  return (
    <StyledTableHead>
      <StyledTableRow background={theme.colors.background}>
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

const TableBody = ({tableData, columnsToRender, handleRowClick, handleDispatchClick, selectedRow, style}) => {
  const {zebra, pt, pb, mt, mb} = style;
  return (
    <TableBodyLC>
        {tableData.map((item, index)=>{
        const isScooter = Object.keys(item)[0].indexOf("scoot") > -1 ;
        const partialKey = isScooter ? "scooters" : "technicians";
        const rowKey = `TableRow-${partialKey}-${trim(index)}`;
        let backgroundColor = theme.colors.background;
        if (index === selectedRow) backgroundColor = theme.colors.key;
        else if (zebra){
          backgroundColor = index % 2 ? 
              colors.ui.hover : 
              colors.ui.light
        }
        let hoverBackground = zebra ? colors.ui.darkHover : theme.colors.background;
        let hoverColor = zebra ? colors.text.primary : colors.text.dark;
        
          return (
            <StyledTableRow
            key={rowKey}
            id={rowKey}
            onClick={() => isScooter ? handleRowClick(rowKey) : ""}
            background={ backgroundColor}
            hoverBackground={ hoverBackground}
            hoverColor={ hoverColor}
            marginTop={mt}
            marginBottom={mb}
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
                        pt={pt}
                        pb={pb}
                        >
                        <Truncate>
                          {isBattery ? <BatteryIndicator value={dataCellText}/>: 
                          isStatus ? 
                            <Status value={dataCellText} />
                            : isDuration ? 
                            <Flex alignItems="center">
                              <FlexItem>{dataCellText}</FlexItem>
                              <FlexItem>
                            <StyledButton onClick={(e) => {
                              e.stopPropagation();
                              handleDispatchClick(dataCellKey)}
                            }
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
 <IndicatorContainer background={background}>
   <Tooltip content={`${value}%`}>
    <Indicator background={background} width={`${value}%`} height="100%"/>
 </Tooltip>
 </IndicatorContainer>
  )
}

const Status = ({value}) => {
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



