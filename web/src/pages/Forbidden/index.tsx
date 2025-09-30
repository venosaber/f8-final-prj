import {useNavigate} from "react-router-dom";
import {Box, Button, Typography} from "@mui/material";

export default function Forbidden() {
    const navigate = useNavigate();
    const onGoBack = () => {
        navigate('/classes');
    }
    return (
        <Box sx={{textAlign: 'center', mt: '100px'}}>
            <Typography component={'h1'} variant={'h2'} color={'error'}>403 - Forbidden</Typography>
            <Typography component={'p'} variant={'h5'} sx={{mt: 3}}>
                You don't have permission to view this page.
            </Typography>
            <Button variant={'outlined'} sx={{mt: 4, p: 3}} onClick={onGoBack}>
                <Typography variant={'h6'}>Go back to home page here</Typography>
            </Button>
        </Box>
    )
}