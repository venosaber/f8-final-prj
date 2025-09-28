import {Box, Button, Grid, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useReducer, useState} from "react";
import type {ChangeEvent} from "react";
import type {ExamGroup} from "../../utils/types";
import {getMethod} from "../../utils/api.ts";
import {initState, reducer} from "./teacherReducer.ts";
import {TeacherAnswers} from '..';
import {toast} from "react-toastify";

export default function TeacherExamDetail() {
    const [state, dispatch] = useReducer(reducer, initState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const navigate = useNavigate();
    const {id, examGroupId, examId} = useParams();
    let examGroupIdNum = 0;
    let examIdNum = 0;
    if (examGroupId !== undefined && examId !== undefined) {
        examGroupIdNum = Number(examGroupId);
        examIdNum = Number(examId);
    }

    const handleBackToExamGroups = () => {
        navigate(`/class/${id}/exam`);
    };

    const handleBackToExamGroupDetail = () => {
        navigate(`/class/${id}/exam/${examGroupId}`);
    }

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files?.[0] ?? null;
        if (!file) return;
        if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
            alert('Vui lòng chọn file PDF hoặc hình ảnh');
            return;
        }
        setSelectedFile(file);

        const previewUrl: string = URL.createObjectURL(file);

        const uploadFile = {
            id: null,
            url: previewUrl,
            file_type: file.type.split('/')[1]
        }
        console.log(uploadFile);

        dispatch({type: 'UPLOAD_FILE', payload: uploadFile});
    }

    const [examGroup, setExamGroup] = useState<ExamGroup | null>(null);

    useEffect(() => {
        const onMounted = async () => {

            try {
                // examId already exists => edit mode
                if (examIdNum !== 0) {
                    const examData = await getMethod(`/exams/${examId}`);

                    dispatch({type: 'LOAD_INITIAL_DATA', payload: examData})
                }

                const examGroupData = await getMethod(`/exam_groups/${examGroupId}`);
                setExamGroup(examGroupData);
            } catch (e) {
                console.error('Error on loading data: ', e);
                toast.error('Có lỗi khi tải dữ liệu!');
            }
        }

        onMounted();
    }, [examGroupId, examId, dispatch, examIdNum]);

    return (
        <>
            <Box sx={{
                height: 'calc(100vh - 112px)',
                display: "flex",
                flexDirection: "column"
            }}>
                <Box sx={{display: 'flex', mb: 2, flexShrink: 0}}>
                    <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                    mr: 2
                                }}
                                onClick={handleBackToExamGroups}
                    >
                        Danh sách bài thi
                    </Typography>

                    <Typography variant="h6" fontWeight="bold"
                                sx={{mr: 2}}>{`>`}</Typography>

                    <Typography variant="h6" fontWeight="bold"
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                    mr: 2
                                }}
                                onClick={handleBackToExamGroupDetail}
                    >{examGroup?.name ?? ''}</Typography>

                    <Typography variant="h6" fontWeight="bold"
                                sx={{mr: 2}}>{`>`}</Typography>

                    <Typography variant="h6" fontWeight="bold">
                        {examIdNum ? state.name : 'Thêm đề bài'}
                    </Typography>
                </Box>

                <Box sx={{
                    flexGrow: 1,
                    minHeight: 0,
                }}>
                    <Grid container spacing={2} sx={{height: "100%"}}>
                        <Grid size={{xs: 12, lg: 5.5}} sx={{
                            height: '100%',
                            border: '1px dashed #cccccc',
                            backgroundColor: "#ffffff",

                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {
                                state?.file?.url ? (
                                    <Box sx={{
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        <iframe
                                            src={`${state.file.url}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                border: 'none',
                                                display: 'block'
                                            }}
                                        />
                                    </Box>
                                ) : (
                                    <>
                                        <input
                                            id="exam-upload"
                                            type="file"
                                            accept="application/pdf,image/*"
                                            style={{display: 'none'}}
                                            onChange={handleFileUpload}
                                        />
                                        <label htmlFor="exam-upload">
                                            <Button variant="contained" component="span" sx={{mt: 1}}>
                                                Tải lên từ máy
                                            </Button>
                                        </label>
                                    </>
                                )
                            }
                        </Grid>

                        <Grid size={{xs: 12, lg: 6.5}} sx={{
                            height: '100%',
                            border: 'none',
                            overflowY: 'auto',
                            backgroundColor: "#ffffff",

                        }}>
                            <TeacherAnswers
                                handleBackToExamGroupDetail={handleBackToExamGroupDetail}
                                examGroupIdNum={examGroupIdNum} examIdNum={examIdNum}
                                state={state} dispatch={dispatch}
                                selectedFile={selectedFile}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}