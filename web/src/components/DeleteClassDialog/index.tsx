import {Box, Button, Grid, Typography} from "@mui/material";
import {useState, useRef} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {deleteMethod} from "../../utils/api.ts";
import {toast} from "react-toastify";

interface DeleteClassDialogProps {
    isOpenDialog: boolean,
    setIsOpenDialog: (isOpenDialog: boolean) => void,
    classId: number | null,
    updateAfterDelete: () => void,
}

export default function DeleteClassDialog({
                                              isOpenDialog,
                                              setIsOpenDialog,
                                              classId,
                                              updateAfterDelete,
                                          }: DeleteClassDialogProps) {
    // flag to lock
    const isLocked = useRef<boolean>(false);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);

    const handleDeleteClass = async () => {
        // check the flag immediately
        if (isLocked.current) return;

        // if not locked, lock immediately
        isLocked.current = true;
        setIsWaiting(true);

        const response = await deleteMethod(`/classes/${classId}`);
        if (!response) {
            toast.error('Xóa lớp thất bại, hãy thử lại!');
        } else {
            toast.success('Xóa lớp thành công!');
            updateAfterDelete();
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
                        ⚠️ Xác nhận xóa lớp
                    </Typography>
                </Box>

                <Typography variant="body1" component="p" sx={{mt: 3}}>
                    Bạn thực sự chắc chắn muốn xóa lớp này ?
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
                            onClick={handleDeleteClass}
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