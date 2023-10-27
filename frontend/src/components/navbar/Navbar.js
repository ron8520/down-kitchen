import {AppBar, InputBase, Toolbar, Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountPopover from "./AccountPopover";
import React, {useState} from "react";
import {alpha, styled} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: '25%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: '50%',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

const Navbar = () => {
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    // handle search text filed input
    const handleChange = (event) => {
        setSearchInput(event.target.value);
    }

    const updateSearch = (event) => {
        if (event.key === 'Enter'){
            if (searchInput !== ''){
                navigate('/search/'+searchInput)
            } else {
                navigate('/')
            }
        }
    }

    return (
        <AppBar posistion={"fixed"}>
            <Toolbar
                style={{
                    justifyContent: "space-between",
                    display:"flex"
                }}
            >
                <Typography
                    variant="h6"
                >
                    Down Kitchen
                </Typography>

                <Search>
                    <SearchIconWrapper onClick={updateSearch}>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        fullWidth
                        onChange={(event) => handleChange(event)}
                        onKeyPress={(event) => updateSearch(event)}
                    />
                </Search>

                <AccountPopover />
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;
