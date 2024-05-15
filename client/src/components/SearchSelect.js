import React, { useState, useMemo } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  ListSubheader,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {amber} from "@mui/material/colors";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

export default function SearchSelect({allOptions, value, onChange}) {
  const [searchText, setSearchText] = useState("");
  const displayedOptions = useMemo(
    () => allOptions.filter((option) => containsText(option, searchText)),
    [searchText]
  );

  return (
      <FormControl fullWidth>
        <Select
          IconComponent={(props) => (<ArrowDownwardIcon sx={{fill:amber[300]}} {...props}/>)}
          variant={"standard"}
          MenuProps={{ autoFocus: false }}
          labelId="search-select-label"
          id="search-select"
          value={value}
          onChange={onChange}
          onClose={() => setSearchText("")}
          renderValue={() => value}
          sx={{
            '&:before': {
              borderColor: amber[300],
              borderWidth: "2px"
            },
          }}
        >
          <ListSubheader>
            <TextField
              size="small"
              // Autofocus on textfield
              autoFocus
              placeholder="Type to search..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
            />
          </ListSubheader>
          {displayedOptions.map((option, i) => (
            <MenuItem key={i} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
}