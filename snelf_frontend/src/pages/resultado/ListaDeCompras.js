import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { Box, TextField, Switch, FormControlLabel, Tooltip, IconButton, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Paper, ThemeProvider, createTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { StyleSheet } from '@react-pdf/renderer';
import { useEffect, useRef } from 'react';


const stylesLista = StyleSheet.create({
  boxDiv: {
    width: '85%',
    minHeight: '10%',
    overflow: 'hidden',
    border: '5px solid blue',
    padding: '50px',
    margin: '20px',
  },
  column: {
    float: 'left',
    width: '50%',
    textAlign: '-webkit-center',
  }
});

//tema
const theme = createTheme({
  components: {
    // Name of the component
    TableRow: {
      styleOverrides: {
        "&:hover": {
          //backgroundColor:alpha(0.78) /*where 0.5 stands for 50% opacity*/
        },
      },
    },
  },
});

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "CodigoNFe",
    numeric: true,
    disablePadding: false,
    label: "Código NFE",
  },
  {
    id: "DataEmissao",
    numeric: false,
    disablePadding: false,
    label: "Data de Emissão",
  },
  {
    id: "MunicipioEmitente",
    numeric: false,
    disablePadding: false,
    label: "Município Emitente",
  },
  {
    id: "unidadecomercial",
    numeric: false,
    disablePadding: false,
    label: "Unidade Comercial",
  },
  {
    id: "quantidadecomercial",
    numeric: true,
    disablePadding: false,
    label: "Quantidade Comercial",
  },
  {
    id: "valorunitariocomercial",
    numeric: true,
    disablePadding: false,
    label: "Valor Unitário Comercial",
  },
  {
    id: "DescricaoProduto",
    numeric: false,
    disablePadding: false,
    label: "Descrição do Produto",
  },
  {
    id: "CLEAN",
    numeric: true,
    disablePadding: false,
    label: "CLEAN",
  },
  // {
  //   id: "foiPredito",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Foi Predito?",
  // },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all medicamentos",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;
  const { rowsSelected } = props;
  const { rows } = props;
  const { setRows } = props;
  const { searchString } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <Typography sx={{ fontWeight: "bold" }} variant="h8">
          {searchString ? `Lista de compras para o produto ${searchString}` : ''}
          </Typography>
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => removeCelula(rows, rowsSelected, setRows)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const foiPredito = (val) => {
  if (val) {
    return "Sim";
  }
  return "Não";
};

const removeCelula = (rows, rowsSelected, setRows) => {
  rows = rows.filter((e) => rowsSelected.includes(e.id) === false);
  setRows(rows);
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ dataset, setDataset, selectDataset }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("nome");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [searchString, setSearchString] = React.useState("");
  const [rows, setRows] = React.useState(JSON.parse(JSON.stringify(dataset)));
  const [copyRows, setCopyRows] = React.useState(JSON.parse(JSON.stringify(dataset)));
  const [hiddenComponent, setHiddenComponent] = React.useState(true);

  const handleRowDeletion = (r) => {
    setRows(r);
    setSelected([]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const coloreLinha = (CLEAN) => {
    var corNaoPredito = { backgroundColor: "#DBF0FF" };
    var corPredito = { backgroundColor: "#FFDBDB" };
    if (CLEAN !== "N/I" && CLEAN !== "-1") {
      return corNaoPredito;
    } else {
      return corPredito;
    }
  };

  const showFilterComponent = () => {
    hiddenComponent === true ? setHiddenComponent(false) : setHiddenComponent(true);
  }
  
  const filterData = () => {
    
    var filteredRows = copyRows.filter((row) => {
      return row.CodigoNFe.toString().indexOf(document.getElementById('codigoNFE').value) !== -1 &&
      row.DataEmissao.toString().indexOf(document.getElementById('dataEmissao').value) !== -1 &&
      row.MunicipioEmitente.toString().indexOf(document.getElementById('municipioEmitente').value) !== -1 &&
      row.unidadecomercial.toString().indexOf(document.getElementById('unidadeComercial').value) !== -1 &&
      row.quantidadecomercial.toString().indexOf(document.getElementById('quantidadeComercial').value) !== -1 &&
      row.valorunitariocomercial.toString().indexOf(document.getElementById('valorUnitarioComercial').value) !== -1 &&
      row.DescricaoProduto.toString().indexOf(document.getElementById('descricaoProduto').value) !== -1 &&
      row.CLEAN.toString().indexOf(document.getElementById('clean').value) !== -1
    })

    setRows(filteredRows);
    setCopyRows(JSON.parse(JSON.stringify(dataset)));
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <ThemeProvider theme={theme}>
      {
        hiddenComponent ? null : (
        <div style={stylesLista.boxDiv}>
          <h1 style={{textAlign: 'center'}}>Filtrar</h1>
          <div style={stylesLista.column}>
            <div style={{margin: '10px'}}>
              <TextField id="codigoNFE" onChange={filterData} label="Código NFE" variant="filled" />              
            </div>
            <div style={{margin: '10px'}}>
              <TextField id="municipioEmitente" onChange={filterData} label="Município Emitente" variant="filled" />              
            </div>
            <div style={{margin: '10px'}}>
              <TextField id="quantidadeComercial" onChange={filterData} label="Quantidade Comercial" variant="filled" />              
            </div>
            <div style={{margin: '10px'}}>
              <TextField id="descricaoProduto" onChange={filterData} label="Descrição do Produto" variant="filled" />              
            </div>
          </div>
          <div style={stylesLista.column}>
            <div style={{margin: '10px'}}>
              <TextField id="dataEmissao" onChange={filterData} label="Data de Emissão" variant="filled" />              
            </div>
            <div style={{margin: '10px'}}>
              <TextField id="unidadeComercial" onChange={filterData} label="Unidade Comercial" variant="filled" />              
            </div>
            <div style={{margin: '10px'}}>
              <TextField id="valorUnitarioComercial" onChange={filterData} label="Valor Unitário Comercial" variant="filled" />              
            </div>
            <div style={{margin: '10px'}}>
              <TextField id="clean" onChange={filterData} label="CLEAN" variant="filled" />              
            </div>
          </div>
        </div>
        )}

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            rowsSelected={selected}
            rows={rows}
            setRows={handleRowDeletion}
            searchString={searchString}
          />
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon onClick={showFilterComponent} />
            </IconButton>
          </Tooltip>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {rows
                  .slice()
                  .sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={coloreLinha(row.CLEAN)}
                        root="true"
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={row.CodigoNFe}
                          scope="row"
                          padding="none"
                        >
                          {row.CodigoNFe}
                        </TableCell>
                        <TableCell align="right">{row.DataEmissao}</TableCell>
                        <TableCell align="right">
                          {row.MunicipioEmitente}
                        </TableCell>
                        <TableCell align="right">
                          {row.unidadecomercial}
                        </TableCell>
                        <TableCell align="right">
                          {row.quantidadecomercial}
                        </TableCell>
                        <TableCell align="right">
                          R${row.valorunitariocomercial}
                        </TableCell>
                        <TableCell align="right">
                          {row.DescricaoProduto}
                        </TableCell>
                        <TableCell align="right">{row.CLEAN}</TableCell>
                        {/* <TableCell align="right">
                          {foiPredito(
                            row.CLEAN !== "N/I" && row.CLEAN !== "-1"
                              ? false
                              : true
                          )}
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    </ThemeProvider>
  );
}
