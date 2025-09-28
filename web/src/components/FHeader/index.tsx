import {useEffect, useState, useMemo} from "react";
import type {MouseEvent} from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// icons
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';

import {Avatar, Menu, MenuItem} from "@mui/material";
import {AvatarDefault} from '..';

import {useNavigate, useParams, Link} from "react-router-dom";
import {deleteCookie, getUserInfo, getValidAccessToken} from "../../router/auth.ts";
import {getMethod} from "../../utils/api.ts";

interface UserBaseInfo {
    name: string;
    role: string;
    avatar_info: {
        id: number;
        url: string;
    } | null
}

export const CustomLogoIcon = () => (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 0.8}}>
        {/* Monitor part */}
        <Box
            sx={{
                width: '28px',
                height: '16px',
                border: '2.5px solid #0b3d91', // Dark blue
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography sx={{
                color: '#0b3d91',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                lineHeight: '1',
                letterSpacing: '1px'
            }}>--</Typography>
        </Box>
        {/* Bowtie part */}
        <Box
            sx={{
                width: '10px',
                height: '6px',
                backgroundColor: '#ff8c00',
                clipPath: 'polygon(0% 0%, 100% 0%, 80% 50%, 100% 100%, 0% 100%, 20% 50%)', // Bowtie shape
                marginTop: '1px',
            }}
        />
    </Box>
);

const drawerWidth = 240;

const getRoleLabel = (role: string) => {
    switch (role) {
        case 'admin':
            return 'Admin';
        case 'teacher':
            return 'Giáo viên';
        case 'student':
            return 'Học sinh';
        default:
            return 'Unknown';
    }
}

export default function DrawerAppBar() {

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const navigate = useNavigate();
    const handleChangeProfile = () => {
        navigate('/profile');
    }

    const handleLogout = () => {
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        navigate('/login');
    }

    /************** Set classname, username, role label ****************/
    const [className, setClassName] = useState<string>('');

    const [user, setUser] = useState<UserBaseInfo>({name: '', role: '', avatar_info: null});
    const displayAddClassButton = user.role === 'teacher' ? 'inline-flex' : 'none';
    const {id: classId} = useParams();

    useEffect(() => {
        const onMounted = async () => {
            const accessToken: string | null = await getValidAccessToken();
            if (!accessToken) {
                console.error("No valid access token, redirecting to login page");
                navigate('/login');
                return;
            }

            try {
                const {name, role, avatar_info} = getUserInfo(accessToken);
                setUser({name, role, avatar_info});

                // the ClassDetail page has an id, the Classes page doesn't
                if (classId) {
                    const {name} = await getMethod(`/classes/${classId}`)
                    setClassName(name);
                }

            } catch (err) {
                console.error("Error on loading data: ", err);
            }
        }

        onMounted();
    }, []);

    /************** For mobile **************/
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState: boolean) => !prevState);
    };

    const navItems = useMemo(() => [
        {
            text: 'Trang chủ',
            path: `/classes`
        },
        {
            text: 'Tổng quan',
            path: `/class/${classId}/`
        },
        {
            text: 'Bài thi',
            path: `/class/${classId}/exam`
        },
        {
            text: 'Thành viên',
            path: `/class/${classId}/member`
        }
    ], [classId]);

    const isDisabledPath = (path: string) => {
        return (!classId && path.includes(`/class/`));
    }

    const drawer = (
        <Box>
            <Box sx={{p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Box sx={{p: '10px'}}/>
                <Button onClick={() => navigate('/classes')}>
                    <CustomLogoIcon/>
                </Button>
                <button onClick={handleDrawerToggle} style={{border: 'none', background: 'none', cursor: 'pointer'}}>
                    <CloseIcon/>
                </button>
            </Box>
            <Divider/>
            <List component={'nav'}>
                {navItems.map((item) => (
                    <ListItemButton key={item.text}
                                    component={Link}
                                    to={item.path}
                                    onClick={handleDrawerToggle}
                                    sx={{textAlign: 'center'}}
                                    disabled={isDisabledPath(item.path)}
                    >
                        <ListItemText primary={item.text}/>
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar component="nav">
                <Toolbar sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {md: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>

                    {/* Logo Section */}
                    <Button sx={{display: 'flex', alignItems: 'center', cursor: 'pointer', textTransform: 'none'}}
                            onClick={() => navigate('/classes')}
                    >
                        <Box sx={{display: {xs: 'none', lg: 'block'}}}>
                            <CustomLogoIcon/>
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: '.05rem',
                                    lineHeight: 1.2
                                }}
                            >
                                <span style={{color: '#0b3d91'}}>BK</span>
                                <span style={{color: '#ff8c00'}}>Star</span>
                            </Typography>
                            <Typography
                                variant="caption"
                                component="div"
                                sx={{color: '#0b3d91', marginTop: '-4px', fontSize: '0.7rem', letterSpacing: '.05rem'}}
                            >
                                Classroom
                            </Typography>
                        </Box>
                    </Button>

                    <Box sx={{position: 'relative', left: '130px', display: {xs: 'none', md: 'block'}}}>
                        <Typography sx={{fontWeight: 600, fontSize: '1.2rem'}}>
                            {className}
                        </Typography>
                    </Box>

                    {/* Buttons: "Tạo lớp" and "Trang chủ" */}
                    <Box sx={{
                        display: {xs: 'none', md: 'flex'},
                        alignItems: 'center',
                        ml: 'auto',
                        mr: 1 /* Margin before the user section */
                    }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon/>}
                            sx={{
                                mr: 2,
                                color: '#1976d2',
                                borderColor: '#1976d2',
                                textTransform: 'none',
                                fontWeight: 500,
                                padding: '5px 15px',
                                '&:hover': {
                                    borderColor: '#1976d2',
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                },
                                display: displayAddClassButton
                            }}
                            onClick={() => navigate('/class/add')}
                        >
                            Tạo lớp
                        </Button>
                        <Button
                            startIcon={<HomeIcon/>}
                            sx={{
                                color: '#1976d2',
                                textTransform: 'none',
                                fontWeight: 500,
                            }}
                            onClick={() => navigate('/classes')}
                        >
                            Trang chủ
                        </Button>
                    </Box>

                    {/* User Section */}
                    <Box sx={{flexGrow: 0, ml: 2, display: 'flex', alignItems: 'center'}}>

                        <IconButton
                            onClick={handleOpenUserMenu}
                            sx={{
                                p: 0.5,
                                borderRadius: '4px',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            {/*Placeholder avatar*/}
                            {
                                user.avatar_info !== null
                                    ? <Avatar sx={{width: 36, height: 36, mr: 1}} src={user.avatar_info.url}/>
                                    : <AvatarDefault fullName={user.name} width={36} height={36} mr={1}/>
                            }

                            <Box
                                sx={{
                                    display: {xs: 'none', md: 'flex'},
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    mr: 0.5,
                                    textAlign: 'left'
                                }}>
                                <Typography variant="body2" sx={{color: '#202124', fontWeight: 500, lineHeight: 1.2}}>
                                    {user.name}
                                </Typography>
                                <Typography variant="caption" sx={{color: '#5f6368', lineHeight: 1.2}}>
                                    {getRoleLabel(user.role)}
                                </Typography>
                            </Box>
                            <ArrowDropDownIcon sx={{color: '#5f6368'}}/>
                        </IconButton>

                        <Menu
                            sx={{mt: '55px'}} // Adjust margin-top from anchor
                            id="menu-appbar-user"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}

                        >

                            <MenuItem onClick={handleChangeProfile}
                                      sx={{fontSize: '0.9rem', padding: '8px 16px'}}>
                                <Typography textAlign="left">Thông tin cá nhân</Typography>
                            </MenuItem>

                            <MenuItem onClick={handleLogout}
                                      sx={{fontSize: '0.9rem', padding: '8px 16px'}}>
                                <Typography textAlign="left">Đăng xuất</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>

        </Box>
    );
}
