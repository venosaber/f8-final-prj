import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {CourseCard} from '..';
import type {Course} from '../../utils/types';

interface CourseGridProps {
    courses: Course[],
    role: string,
    setClassIdToDelete: (classId: number) => void,
    setIsOpenDialog: (isOpenDialog: boolean) => void
}

function CourseGrid({courses, role, setClassIdToDelete, setIsOpenDialog}: CourseGridProps) {
    if (!courses || courses.length === 0) {
        return (
            <Box sx={{textAlign: 'center', mt: 5}}>
                <Typography variant="h6" color="text.secondary">
                    Không tìm thấy lớp học nào.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {courses.map((course: Course) => (
                <Grid key={course.id} size={{xs: 12, md: 6, lg: 4}} width={'100%'}>
                    <CourseCard course={course}
                                role={role}
                                setClassIdToDelete={setClassIdToDelete}
                                setIsOpenDialog={setIsOpenDialog}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default CourseGrid;