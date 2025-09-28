import {Box, Button, Grid, Typography} from "@mui/material";
import {useState, useRef} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {deleteMethod} from "../../utils/api.ts";
import {toast} from "react-toastify";

interface DeleteExamDialogProps {
    isOpenDialog: boolean,
    setIsOpenDialog: (isOpenDialog: boolean) => void,
    examIdNum: number,
    handleBackToExamGroupDetail: () => void
}

export default function DeleteExamDialog({
                                             isOpenDialog,
                                             setIsOpenDialog,
                                             examIdNum,
                                             handleBackToExamGroupDetail
                                         }: DeleteExamDialogProps) {
    // flag to lock
    const isLocked = useRef<boolean>(false);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);

    const handleDeleteExam = async () => {
        // check the flag immediately
        if (isLocked.current) return;

        // if not locked, lock immediately
        isLocked.current = true;
        setIsWaiting(true);

        const response = await deleteMethod(`/exams/${examIdNum}`);
        if (!response) {
            toast.error('Xóa đề thi thất bại, hãy thử lại!');
        } else {
            toast.success('Xóa đề thi thành công!');
            handleBackToExamGroupDetail();
        }

        // finally, unlock
        setIsOpenDialog(false);
        setIsWaiting(false);
        isLocked.current = false;

    }

    return (
        <>
            {/* Dark transparent overlay */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0,
                width: '100%', height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(1px)',
                zIndex: 1000,

                display: isOpenDialog ? 'block' : 'none'
            }}/>

            {/* Dialog content */}

            <Box sx={{
                position: 'fixed',
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '90%', maxWidth: '450px',
                backgroundColor: 'background.paper',
                borderRadius: '10px',
                zIndex: 1001,
                p: 2,

                display: isOpenDialog ? 'block' : 'none'
            }}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Typography variant="h5" component="h2" sx={{
                        fontWeight: 600,
                        mb: 1
                    }}>
                        ⚠️ Xác nhận xóa đề thi
                    </Typography>
                </Box>

                <Typography variant="body1" component="p" sx={{mt: 3}}>
                    Xóa đề thi sẽ xóa toàn bộ câu hỏi, đáp án của đề thi và các bài làm của học sinh.
                    Bạn vẫn muốn tiếp tục?
                </Typography>

                {/* Buttons */}
                <Grid container sx={{mt: 3, mb: 2}} spacing={2}>

                    <Grid size={{xs: 6}}>
                        <Button
                            fullWidth variant={'outlined'}
                            color={'primary'}
                            sx={{
                                fontWeight: 600,
                                borderRadius: '10px',
                            }}
                            onClick={() => setIsOpenDialog(false)}
                        >
                            Hủy
                        </Button>
                    </Grid>

                    <Grid size={{xs: 6}}>
                        <Button
                            fullWidth variant={'contained'}
                            color={'error'}
                            sx={{
                                fontWeight: 600,
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                            onClick={handleDeleteExam}
                            disabled={isWaiting}
                        >
                            Xác nhận xóa

                            {(isWaiting && <CircularProgress color={'inherit'} size={20}/>)}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}