import type {Question} from '../../utils/types';
import type {TeacherAnswersProps} from './types.ts';

import {
    Grid,
    Box,
    TextField,
    Button
} from '@mui/material';
import {useTeacherAnswers} from "./useTeacherAnswers.ts";
import {MemoizedQuestionUnit} from "./QuestionUnit.tsx";

export default function TeacherAnswers(props: TeacherAnswersProps) {

    const { state, examIdNum } = props;
    const { handlers, handleSubmit } = useTeacherAnswers(props);

    return (
        <>
            <Box
                component='form'
                sx={{'& > :not(style)': {m: 1}}}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >

                <Grid container spacing={2} sx={{p: 2}}>
                    <Grid size={{xs: 12, lg: 6}}>
                        <label htmlFor={'exam-name'}>
                            Tên đề
                            <span style={{color: "#ff0000", marginLeft: 5}}>*</span>
                        </label>
                        <TextField fullWidth size={'small'}
                                   id={'exam-name'}
                                   name={'name'}
                                   value={state.name}
                                   onChange={handlers.onNameChange}
                        />
                    </Grid>

                    <Grid size={{xs: 12, lg: 6}}>
                        <label htmlFor={'exam-code'}>
                            Mã đề
                            <span style={{color: "#ff0000", marginLeft: 5}}>*</span>
                        </label>
                        <TextField fullWidth size={'small'}
                                   id={'exam-code'}
                                   name={'code'}
                                   value={state.code}
                                   onChange={handlers.onCodeChange}
                        />
                    </Grid>

                    <Grid size={{xs: 12, lg: 6}}>
                        <label htmlFor={'exam-total_time'}>
                            Thời gian làm bài (phút)
                            <span style={{color: "#ff0000", marginLeft: 5}}>*</span>
                        </label>
                        <TextField fullWidth size={'small'}
                                   id={'exam-total_time'}
                                   name={'total_time'}
                                   value={state.total_time}
                                   onChange={handlers.onTotalTimeChange}
                        />
                    </Grid>

                    <Grid size={{xs: 12, lg: 6}}>
                        <label htmlFor={'exam-number_of_question'}>
                            Số câu
                            <span style={{color: "#ff0000", marginLeft: 5}}>*</span>
                        </label>
                        <TextField fullWidth size={'small'}
                                   id={'exam-number_of_question'}
                                   name={'number_of_question'}
                                   value={state.number_of_question}
                                   onChange={handlers.onAmountChange}
                        />
                    </Grid>
                </Grid>

                <Box>
                    {
                        state.questions.map((question: Question) =>
                            (
                                <MemoizedQuestionUnit question={question}
                                                      onTypeChange={handlers.onTypeChange}
                                                      onAnswerChange={handlers.onAnswerChange} />
                            ))
                    }
                </Box>

                <Box sx={{textAlign: 'center'}}>
                    <Button
                        variant="contained"
                        size="large"
                        type="submit"
                        sx={{fontWeight: 600, mt: 2}}
                    >
                        {examIdNum ? 'Chỉnh sửa đề bài' : 'Tạo đề bài'}
                    </Button>
                </Box>
            </Box>
        </>
    )

}


