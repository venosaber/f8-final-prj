import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ShareIcon from '@mui/icons-material/Share';
import type {Course} from '../../utils/types';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Tooltip} from "@mui/material";

interface CourseCardProps {
    course: Course,
    role: string,
    setClassIdToDelete: (classId: number) => void,
    setIsOpenDialog: (isOpenDialog: boolean) => void
}

const CourseCard = ({course, role, setClassIdToDelete, setIsOpenDialog}: CourseCardProps) => {
    const navigate = useNavigate();

    const onEnterClass = (course: Course) => {
        navigate(`/class/${course.id}`);
    };

    const baseUrl: string = window.location.origin;
    const linkToInvite = `${baseUrl}/invite?class=${course.id}`
    const onCopyLink = () => {
        navigator.clipboard.writeText(linkToInvite).then(() => {
            toast.info('Đã sao chép link lớp học!');
        }).catch((err) => {
            toast.error('Sao chép thất bại !');
            console.error('Failed to copy link to clipboard: ', err);
        })
    };

    const onEditClass = () => {
        navigate(`/class/edit/${course.id}`);
    }

    const onDeleteClass = () => {
        setClassIdToDelete(course.id);
        setIsOpenDialog(true);
    }

    return (
        <Card
            sx={{
                backgroundColor: '#29b6f6',
                color: 'white',
                borderRadius: '12px',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }
            }}
        >
            <Box sx={{p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                {/* Class name & Enter button */}
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1}}>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 'bold',
                            flexGrow: 1,
                            mr: 1,

                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {course.name}
                    </Typography>

                    <Button
                        size="small"
                        startIcon={<MeetingRoomIcon/>}
                        onClick={() => onEnterClass(course)}
                        sx={{
                            color: 'white',
                            fontSize: '16px',
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            p: '2px 8px',
                            minWidth: 'auto',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        Vào lớp
                    </Button>

                </Box>

                {/* Members count */}
                <Box sx={{
                    my: 'auto',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>

                    <Typography
                        variant="h2"
                        component="div"
                        sx={{fontWeight: 'bold', lineHeight: 1}}
                    >
                        {course.teachers.length + course.students.length}
                    </Typography>
                </Box>

                {/* Class code & Share button */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexGrow: 1,
                        mr: 1
                    }}>
                        <Typography variant="body2" sx={{color: 'rgba(255, 255, 255, 0.8)'}}>
                            Thành viên tham gia
                        </Typography>

                        { // students aren't allowed to see class code
                            role !== 'student' && (
                                <Typography variant="body2" sx={{color: 'rgba(255, 255, 255, 0.9)'}}>
                                    Mã lớp: {course.code}
                                </Typography>
                            )}

                    </Box>

                    {/*To center the tooltip for the Button, wrap the button inside Tooltip and div*/}
                    { // students aren't allowed to share the invite link
                        role !== 'student' && (
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Tooltip title={'Copy link mời vào lớp'} arrow>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<ShareIcon fontSize="inherit"/>}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                            textTransform: 'none',
                                            borderRadius: '16px',
                                            p: '2px 10px',
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            },
                                        }}
                                        onClick={onCopyLink}
                                    >
                                        Chia sẻ
                                    </Button>
                                </Tooltip>
                            </div>
                        )}

                </Box>

                {/* Edit and Delete buttons - Not for students */}
                {role !== 'student' && (
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        mt: 2
                    }}>
                        <Button variant={'contained'} color={'success'} size={'small'}
                                sx={{borderRadius: '5px'}}
                                onClick={onEditClass}
                        >
                            Sửa thông tin
                        </Button>
                        <Button variant={'contained'} color={'error'} size={'small'}
                                sx={{borderRadius: '5px'}}
                                onClick={onDeleteClass}
                        >
                            Xóa lớp
                        </Button>
                    </Box>
                )}
            </Box>

        </Card>
    );
};

export default CourseCard;