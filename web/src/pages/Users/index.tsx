import {DeleteUserDialog, FHeader} from '../../components'
import {
    Container,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    Paper,
    TableContainer,
    Table, TableHead, TableBody, TableRow, TableCell
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import type {User} from '../../utils/types';

import {useState, useEffect, useMemo} from 'react';
import type {ChangeEvent} from 'react';
import {Loading} from '../../components';
import {getMethod} from "../../utils/api.ts";
import {useNavigate} from "react-router-dom";
import {getUserInfo, getValidAccessToken} from "../../router/auth.ts";

export default function Users() {
    const navigate = useNavigate();

    const userRoleName = (role: string) => {
        return role === 'student' ? 'Học sinh' : role === 'teacher' ? 'Giáo viên' : 'Admin';
    }

    const [users, setUsers] = useState<User[]>([]);

    const [searchStr, setSearchStr] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const filteredUsers: User[] = useMemo(() => users.filter(user => {
        return user.name.toLowerCase().includes(searchStr.toLowerCase())
            || user.email.toLowerCase().includes(searchStr.toLowerCase())
            || userRoleName(user.role).toLowerCase().includes(searchStr.toLowerCase())
            || user.id.toString().includes(searchStr);
    }), [users, searchStr]).sort((a, b) => a.id - b.id);

    const handleEditUser = (userId: number) => {
        navigate(`/profile/${userId}`);
    }

    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);

    const handleDeleteUser = (userId: number) => {
        setUserIdToDelete(userId);
        setIsOpenDialog(true);
    }

    const updateAfterDelete = () => {
        const updatedList: User[] = users.filter(user => user.id !== userIdToDelete);
        setUsers(updatedList); // re-render
        setUserIdToDelete(null);
    }

    useEffect(() => {
        const onMounted = async () => {
            const accessToken: string | null = await getValidAccessToken();
            if (!accessToken) {
                console.error("No valid access token, redirecting to login page");
                navigate('/login');
                return;
            }

            const {role} = getUserInfo(accessToken);
            if (role !== 'admin') {
                navigate('/403');
            }

            try {
                const usersData: User[] = await getMethod('/users');
                setUsers(usersData);
            } catch (err) {
                console.error("Error on loading users: ", err);
            } finally {
                setIsLoading(false);
            }
        }

        onMounted();
    }, []);

    if (isLoading) return <Loading/>

    return (
        <>
            <FHeader/>
            <Container maxWidth={false}
                       sx={{
                           mt: '64px', backgroundColor: '#f0f2f5',
                           minHeight: 'calc(100vh - 64px)', p: 3
                       }}>

                {/* Page title & controls */}
                <Box sx={{display: {md: 'flex'}, alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                    <Typography variant="h5" component="h1" gutterBottom sx={{fontWeight: 'bold', color: '#333'}}>
                        Danh sách người dùng
                    </Typography>

                    <Box sx={{mr: 2, my: 2, minWidth: '400px'}}>
                        <TextField
                            value={searchStr}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchStr(e.target.value)}
                            fullWidth
                            variant="outlined"
                            placeholder="Tìm kiếm theo tên, email hoặc vị trí, id"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                },
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{color: 'action.active'}}/>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Box>


                </Box>

                {/* Users table */}

                <TableContainer component={Paper} elevation={0} sx={{p: 2, overflowX: 'auto'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 600}}>ID</TableCell>
                                <TableCell sx={{fontWeight: 600}}>Tên</TableCell>
                                <TableCell sx={{fontWeight: 600}}>Email</TableCell>
                                <TableCell sx={{fontWeight: 600}}>Vị trí</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {
                                filteredUsers.map((user: User, index: number) => (
                                    <TableRow key={user.id}
                                              sx={index % 2 !== 0 ? {} : {backgroundColor: '#f0f0f0'}}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{userRoleName(user.role)}</TableCell>

                                        <TableCell sx={{display: 'flex', alignItems: 'center', gap: 3}}>
                                            <Button variant={'contained'} color={'success'}
                                                    size={'medium'} sx={{borderRadius: 2, px: 3}}
                                                    onClick={() => handleEditUser(user.id)}
                                            >
                                                Sửa
                                            </Button>
                                            <Button variant={'contained'} color={'error'}
                                                    size={'medium'} sx={{borderRadius: 2, px: 3}}
                                                    onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>

                </TableContainer>

            </Container>

            <DeleteUserDialog userId={userIdToDelete}
                              isOpenDialog={isOpenDialog}
                              setIsOpenDialog={setIsOpenDialog}
                              updateAfterDelete={updateAfterDelete}
            />
        </>
    )
}
