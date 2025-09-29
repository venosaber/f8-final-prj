import {Box, Button, Container, Paper, TextField, Typography} from "@mui/material";
import {LogoElement} from "../../components";
import {type ChangeEvent, type FocusEvent, type FormEvent, useRef, useState} from "react";
import {postMethod} from "../../utils/api.ts";
import {toast} from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import {useNavigate} from "react-router-dom";

export default function ForgotPassword() {
    const navigate = useNavigate();

    /*************** form & validation *****************/
    const [email, setEmail] = useState('');

    const [helperTexts, setHelperTexts] = useState('');

    const [touched, setTouched] = useState(false);

    const validate = (value: string) => {
        if (!value) {
            setHelperTexts('Vui lòng nhập email!');
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(value)) {
            setHelperTexts('Địa chỉ email không hợp lệ!');
            return false;
        }

        setHelperTexts('');
        return true;
    }


    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        validate(e.target.value);
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setEmail(value);
        validate(value);
    }

    const [showSuccessful, setShowSuccessful] = useState(false);

    /******************* submit logic *********************/

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
        setTouched(true);

        // check valid
        const isValid: boolean = validate(email);

        if (!isValid) {
            isLocked.current = false;
            setIsWaiting(false);
            return;
        }

        // submit logic
        const payload = {email}
        const response = await postMethod('/auth/forgot-password', payload);
        if (!response) {
            toast.error('Thao tác thất bại, hãy thử lại!');
        } else {
            setShowSuccessful(true);
        }
        isLocked.current = false;
        setIsWaiting(false);
    }

    return (
        <Container maxWidth={false}
                   sx={{
                       backgroundColor: '#f0f2f5',
                       minHeight: '100vh', p: 3,
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
                    <LogoElement/>
                    {/* Headings */}
                    <Typography component={'h1'} variant={'h4'}
                                color={'error'}
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 3,
                                    textAlign: 'center'
                                }}>
                        Quên mật khẩu?
                    </Typography>

                    {
                        showSuccessful ?
                            (
                                <Typography component={'p'}
                                            sx={{
                                                mb: 2,
                                                textAlign: 'center'
                                            }}>
                                    Chúng tôi đã gửi email chứa link đặt lại mật khẩu cho bạn.
                                    Link chỉ có hiệu lực trong 15 phút, hãy kiểm tra hộp thư của bạn ngay bây giờ!
                                </Typography>
                            )
                            : (
                                <>
                                    <Typography component={'p'} variant={'h6'}
                                                sx={{
                                                    mb: 2,
                                                    textAlign: 'center'
                                                }}>
                                        Nhập email bạn dùng để đăng nhập và chúng tôi sẽ gửi cho bạn đường link đặt lại mật
                                        khẩu.
                                    </Typography>

                                    <Typography component={'p'}
                                                sx={{
                                                    mb: 2,
                                                    fontWeight: 600,
                                                    textAlign: 'center',
                                                    color: '#ff0000'
                                                }}>
                                        Lưu ý: liên kết chỉ có thể sử dụng thành công 1 lần, sau khi thay đổi mật khẩu thành công sẽ không còn hiệu lực.
                                    </Typography>

                                    {/*  form  */}
                                    <Box component={'form'} sx={{width: '100%'}}
                                         onSubmit={onSubmit}
                                    >
                                        <Typography>Email của bạn: </Typography>
                                        <TextField fullWidth size={'small'} sx={{my: 1}}
                                                   placeholder={"Vui lòng nhập email của bạn"}

                                                   name={"email"}
                                                   value={email}
                                                   onChange={onChange}
                                                   onBlur={handleBlur}
                                                   error={touched && Boolean(helperTexts)}
                                                   helperText={touched && helperTexts}
                                        />

                                        <Button
                                            size={'large'} variant={'contained'} fullWidth
                                            color={'success'} sx={{fontWeight: '600', borderRadius: 2, mt: 2}}
                                            type={'submit'}
                                            disabled={isWaiting}
                                        >
                                            Gửi link đặt lại mật khẩu
                                            {isWaiting && (<CircularProgress color={'inherit'} size={20}/>)}
                                        </Button>

                                    </Box>
                                </>
                            )
                    }

                    <Button
                        size={'large'} variant={'contained'} fullWidth
                        color={'primary'} sx={{fontWeight: '600', borderRadius: 2, mt: 2}}
                        onClick={()=> navigate('/login')}
                    >
                        Quay lại trang đăng nhập
                    </Button>


                </Box>

            </Paper>
        </Container>
    )
}