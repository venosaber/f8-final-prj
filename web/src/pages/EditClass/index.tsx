import {FHeader} from "../../components";
import {Box, Button, Container, Grid, Paper, TextField, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {type ChangeEvent, type FocusEvent, type FormEvent, useEffect, useRef, useState} from "react";
import {getMethod, putMethod} from "../../utils/api.ts";
import {toast} from 'react-toastify';
import CircularProgress from "@mui/material/CircularProgress";

interface EditClassForm {
    name: string,
    code: string
}

export default function EditClass() {

    const navigate = useNavigate();
    const {classId} = useParams();

    const [formData, setFormData] = useState<EditClassForm>({
        name: '',
        code: ''
    });

    const [helperTexts, setHelperTexts] = useState<EditClassForm>({
        name: '',
        code: ''
    });

    const [touched, setTouched] = useState({
        name: false,
        code: false
    });

    const validate = {
        name: (value: string) => {
            if (!value) {
                setHelperTexts(prev => ({...prev, name: 'Vui lòng nhập tên lớp học!'}));
                return false;
            }
            setHelperTexts(prev => ({...prev, name: ''}));
            return true;
        },

        code: (value: string) => {
            if (!value) {
                setHelperTexts(prev => ({...prev, code: 'Vui lòng nhập mã bảo vệ!'}));
                return false;
            }
            if (value.length < 6) {
                setHelperTexts(prev => ({...prev, code: 'Vui lòng nhập tối thiểu 6 ký tự!'}));
                return false;
            }

            setHelperTexts(prev => ({...prev, code: ''}));
            return true;
        }
    }

    const onBlur = (e: FocusEvent<HTMLInputElement>) => {
        setTouched({
            ...touched,
            [e.target.name]: true
        })
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        onBlur(e);
        validate[name as keyof EditClassForm](value);
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        validate[name as keyof EditClassForm](value);
    }

    // flag to lock
    const isLocked = useRef<boolean>(false);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // check the flag immediately
        if (isLocked.current) {
            return;
        }

        // turn on the lock immediately
        isLocked.current = true;
        setIsWaiting(true);

        // set all touched to true
        const curTouched = {...touched};
        Object.keys(touched).forEach((key) => {
            curTouched[key as keyof EditClassForm] = true;
        })
        setTouched(curTouched);

        // check valid
        const isValid: boolean = validate.name(formData.name) && validate.code(formData.code);
        if (!isValid) {
            isLocked.current = false;
            setIsWaiting(false);
            return;
        }

        // submit logic
        const payload = {
            name: formData.name,
            code: formData.code,
        }

        const response = await putMethod(`/classes/${classId}`, payload)
        if (!response) {
            toast.error('Có lỗi, sửa thông tin thất bại!');
        } else {
            toast.success('Sửa thông tin lớp học thành công!');
            navigate('/classes');
        }

        isLocked.current = false;
        setIsWaiting(false);
    }

    const onCancel = () => {
        setFormData({name: '', code: ''});
        setHelperTexts({name: '', code: ''});
        setTouched({name: false, code: false});
        navigate('/classes');
    }

    useEffect(()=>{
        const onMounted = async () => {
            const classInfo = await getMethod(`/classes/${classId}`);
            const {name, code} = classInfo;
            setFormData({name, code});
        }

        onMounted();
    }, [classId])

    return (
        <>
            <FHeader/>
            <Container maxWidth={false}
                       sx={{
                           mt: '64px', backgroundColor: '#f0f2f5',
                           minHeight: 'calc(100vh - 64px)', p: 3,
                           display: 'flex', justifyContent: 'center', alignItems: 'center',
                       }}>
                <Paper sx={{
                    width: "100%",
                    maxWidth: "500px",

                    borderRadius: "10px",
                    overflow: "hidden", // to remain effect of border-radius with child grid items
                    boxShadow: "0 0 10px #000000"
                }}>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 3
                    }}>

                        {/* Headings */}
                        <Typography component={'h1'} variant={'h4'}
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: 1,
                                        color: 'text.primary',
                                        textAlign: 'center'
                                    }}>
                            Sửa thông tin lớp học
                        </Typography>

                        {/*  Register form  */}
                        <Box component={'form'} sx={{width: '100%'}}
                             onSubmit={onSubmit}
                        >
                            <Typography>Tên lớp học <span style={{color: '#ff0000'}}>*</span></Typography>
                            <TextField fullWidth size={'small'} sx={{my: 1}}
                                       placeholder={"Nhập tên lớp học"}

                                       name={"name"}
                                       value={formData.name}
                                       onChange={onChange}
                                       onBlur={handleBlur}
                                       error={touched.name && Boolean(helperTexts.name)}
                                       helperText={touched.name && helperTexts.name}
                            />

                            <Typography>Mã bảo vệ <span style={{color: '#ff0000'}}>*</span></Typography>
                            <TextField fullWidth size={'small'} sx={{my: 1}}
                                       placeholder={"Nhập mã bảo vệ"}

                                       name={"code"}
                                       value={formData.code}
                                       onChange={onChange}
                                       onBlur={handleBlur}
                                       error={touched.code && Boolean(helperTexts.code)}
                                       helperText={touched.code && helperTexts.code}
                            />

                            {/* Buttons */}
                            <Grid container sx={{
                                mt: 2, mb: 2,
                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                            }} spacing={2}>
                                <Grid size={{xs: 6}}>
                                    <Button
                                        fullWidth variant={'outlined'}
                                        color={'primary'} sx={{fontWeight: '600', borderRadius: 2}}
                                        onClick={onCancel}
                                    >Hủy</Button>
                                </Grid>

                                <Grid size={{xs: 6}}>
                                    <Button
                                        fullWidth variant={'contained'}
                                        color={'primary'}
                                        sx={{
                                            fontWeight: '600', borderRadius: 2,
                                            display: 'flex', alignItems: 'center', gap: '5px'
                                        }}
                                        type={'submit'}
                                        disabled={isWaiting}
                                    >
                                        Xác nhận sửa đổi
                                        {isWaiting && <CircularProgress color={'inherit'} size={20}/>}
                                    </Button>
                                </Grid>
                            </Grid>

                        </Box>

                    </Box>

                </Paper>
            </Container>
        </>
    )
}