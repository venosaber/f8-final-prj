import {
    Box,
    Checkbox,
    Grid,
    MenuItem,
    Radio,
    Select,
    type SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import type {ChangeEvent} from "react";
import {memo} from "react";
import type {QuestionUnitProps} from './types.ts';


const QuestionUnit = ({question, onTypeChange, onAnswerChange, isDisplay}: QuestionUnitProps) => {
    const handleTypeChange = (e: SelectChangeEvent) => {
        onTypeChange(question.index, e.target.value);
    }

    const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
        onAnswerChange(question.index, question.type as 'single-choice' | 'multiple-choice', e.target.value, e.target.checked)
    }

    const options: string[] = ["A", "B", "C", "D"];

    let questionElement;
    switch (question.type) {
        case 'single-choice':
            questionElement = options.map((option: string, index: number) => {
                return (
                    <Box key={index} sx={{display: 'flex', alignItems: 'center'}}>
                        <Radio name={`question-${question.index}`}
                               onChange={handleAnswerChange}
                               checked={question.correct_answer === option}
                               id={`question-${question.index}-${option}`} value={option}/>
                        <label htmlFor={`question-${question.index}-${option}`}>{option}</label>
                    </Box>
                )
            });
            break;

        case 'multiple-choice':
            questionElement = options.map((option: string, index: number) => {
                return (
                    <Box key={index} sx={{display: 'flex', alignItems: 'center'}}>
                        <Checkbox name={`question-${question.index}`}
                                  onChange={handleAnswerChange}
                                  checked={question.correct_answer.includes(option)}
                                  id={`question-${question.index}-${option}`} value={option}/>
                        <label htmlFor={`question-${question.index}-${option}`}>{option}</label>
                    </Box>
                )
            });
            break;

        case 'long-response':
            questionElement = <TextField size={'small'} value={'Học sinh tự điền'} disabled/>;
            break;

        default:
            questionElement = <></>
    }

    return (isDisplay && (
        <Box sx={{m: "10px 0 10px 10px "}}>
            <Grid container spacing={2} alignItems={'center'}>
                <Grid size={{xs: 1.5, lg: 2}}>
                    <Typography sx={{fontSize: 20}}>Câu {question.index + 1}:</Typography>
                </Grid>

                <Grid size={{xs: 4, lg: 4}}>
                    <Select fullWidth size={'small'}
                            name={'questionType'}
                            onChange={handleTypeChange}
                            value={question.type}
                    >
                        <MenuItem value={'single-choice'}>Chọn một đáp án</MenuItem>
                        <MenuItem value={'multiple-choice'}>Chọn nhiều đáp án</MenuItem>
                        <MenuItem value={'long-response'}>Điền vào chỗ trống</MenuItem>
                    </Select>
                </Grid>

                <Grid size={{xs: 6.5, lg: 6}} sx={{display: 'flex', gap: '5px'}}>
                    {questionElement}
                </Grid>

            </Grid>
        </Box>
    ))
}

export const MemoizedQuestionUnit = memo(QuestionUnit);