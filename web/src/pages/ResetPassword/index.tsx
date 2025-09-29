import {Box, Button, Container, Paper, TextField, Typography} from "@mui/material";
import {LogoElement} from "../../components";
import CircularProgress from "@mui/material/CircularProgress";
import {InputAdornment, IconButton} from "@mui/material";
import {VisibilityOff, Visibility} from "@mui/icons-material";
import {useNavigate, useSearchParams} from "react-router-dom";
import {type ChangeEvent, type FocusEvent, type FormEvent, type MouseEvent, useRef, useState} from "react";
import {postMethod} from "../../utils/api.ts";
import {getUserInfo} from "../../router/auth.ts";
import {NotFound} from "..";
import {toast} from "react-toastify";

interface TouchedProps {
    [key: string]: boolean,
}

export default function ResetPassword() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const token: string | null = searchParams.get('token');

    const [showSuccessful, setShowSuccessful] = useState<boolean>(false);

    /*************** form & validation *****************/
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [helperTexts, setHelperTexts] = useState({
        password: '',
        confirmPassword: ''
    });

    const [touched, setTouched] = useState<TouchedProps>({
        password: false,
        confirmPassword: false,
    });

    const validate: { [name: string]: (value: string) => boolean } = {
        password: (value: string) => {
            if (!value) {
                setHelperTexts(prev => ({...prev, password: 'Vui lòng nhập mật khẩu!'}));
                return false;
            }
            if (value.length < 6) {
                setHelperTexts(prev => ({...prev, password: 'Vui lòng nhập tối thiểu 6 ký tự!'}));
                return false;
            }

            setHelperTexts(prev => ({...prev, password: ''}));
            return true;
        },
        confirmPassword: (value: string) => {
            if (!value) {
                setHelperTexts(prev => ({...prev, confirmPassword: 'Vui lòng nhập lại mật khẩu!'}));
                return false;
            }
            if (formData.password && value !== formData.password) {
                setHelperTexts(prev => ({...prev, confirmPassword: 'Mật khẩu nhập lại phải trùng khớp!'}));
                return false;
            }

            setHelperTexts(prev => ({...prev, confirmPassword: ''}));
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
        validate[name](value);
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        validate[name](value);
    }

    /*********** show - hide password **************/
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

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
        const curTouched = {...touched};
        Object.keys(touched).forEach((key) => {
            curTouched[key] = true;
        })
        setTouched(curTouched);

        // check valid
        const isValid: boolean =
            validate.password(formData.password) &&
            validate.confirmPassword(formData.confirmPassword);

        if (!isValid) {
            isLocked.current = false;
            setIsWaiting(false);
            return;
        }

        // submit logic
        const payload = {
            token: token,
            newPassword: formData.password,
        }
        const response = await postMethod('/auth/reset-password', payload);
        if (!response) {
            toast.error('Đổi mật khẩu thất bại, hãy thử lại!');
        } else {
            setShowSuccessful(true);
        }
        isLocked.current = false;
        setIsWaiting(false);
    }

    // check if the token is expired
    if (!token) {
        return <NotFound/>
    }
    const {exp} = getUserInfo(token);

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
                        Đặt lại mật khẩu
                    </Typography>

                    {
                        exp < Date.now() / 1000 ?
                            (<>
                                <Typography component={'p'} variant={'h6'}
                                            sx={{
                                                mb: 2,
                                                textAlign: 'center'
                                            }}>
                                    <span>&#128543;</span> Rất tiếc, liên kết đã hết hạn.
                                </Typography>
                                <Button
                                    size={'large'} variant={'contained'} fullWidth
                                    color={'warning'} sx={{fontWeight: '600', borderRadius: 2, mt: 2}}
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Gửi lại yêu cầu đặt lại mật khẩu
                                </Button>
                            </>)
                            : showSuccessful ?
                                (
                                    <>
                                        <Typography component={'p'}
                                                    sx={{
                                                        mb: 2,
                                                        textAlign: 'center'
                                                    }}>
                                            Mật khẩu đã được cập nhật thành công!
                                        </Typography>
                                    </>
                                )
                                : (
                                    <>
                                        <Typography component={'p'} variant={'h6'}
                                                    sx={{
                                                        mb: 2,
                                                        fontWeight: 600,
                                                        textAlign: 'center'
                                                    }}>
                                            Hãy nhập và xác nhận mật khẩu mới
                                        </Typography>

                                        <Typography component={'p'}
                                                    sx={{
                                                        mb: 2,
                                                        textAlign: 'center',
                                                        color: '#ff0000'
                                                    }}>
                                            Lưu ý: Sau khi bạn đổi mật khẩu thành công, liên kết này sẽ bị vô hiệu hóa, không thể sử dụng lại.
                                        </Typography>

                                        {/*  form  */}
                                        <Box component={'form'} sx={{width: '100%'}}
                                             onSubmit={onSubmit}
                                        >
                                            <Typography>Mật khẩu mới: </Typography>
                                            <TextField fullWidth size={'small'} sx={{my: 1}}
                                                       placeholder={"Nhập mật khẩu"}

                                                       name={"password"}
                                                       value={formData.password}
                                                       onChange={onChange}
                                                       onBlur={handleBlur}
                                                       error={touched.password && Boolean(helperTexts.password)}
                                                       helperText={touched.password && helperTexts.password}

                                                       type={showPassword ? 'text' : 'password'}
                                                       slotProps={{
                                                           input: {
                                                               endAdornment:
                                                                   <InputAdornment position="end">
                                                                       <IconButton
                                                                           aria-label={
                                                                               showPassword ? 'hide the password' : 'display the password'
                                                                           }
                                                                           onClick={handleClickShowPassword}
                                                                           onMouseDown={handleMouseDownPassword}
                                                                           onMouseUp={handleMouseUpPassword}
                                                                           edge="end"
                                                                       >
                                                                           {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                                       </IconButton>
                                                                   </InputAdornment>
                                                           }
                                                       }}
                                            />

                                            <Typography>Xác nhận mật khẩu mới: </Typography>
                                            <TextField fullWidth size={'small'} sx={{my: 1}}
                                                       placeholder={"Nhập lại mật khẩu"}

                                                       name={"confirmPassword"}
                                                       value={formData.confirmPassword}
                                                       onChange={onChange}
                                                       onBlur={handleBlur}
                                                       error={touched.confirmPassword && Boolean(helperTexts.confirmPassword)}
                                                       helperText={touched.confirmPassword && helperTexts.confirmPassword}

                                                       type={showPassword ? 'text' : 'password'}
                                                       slotProps={{
                                                           input: {
                                                               endAdornment:
                                                                   <InputAdornment position="end">
                                                                       <IconButton
                                                                           aria-label={
                                                                               showPassword ? 'hide the password' : 'display the password'
                                                                           }
                                                                           onClick={handleClickShowPassword}
                                                                           onMouseDown={handleMouseDownPassword}
                                                                           onMouseUp={handleMouseUpPassword}
                                                                           edge="end"
                                                                       >
                                                                           {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                                       </IconButton>
                                                                   </InputAdornment>
                                                           }
                                                       }}
                                            />

                                            <Button
                                                size={'large'} variant={'contained'} fullWidth
                                                color={'success'} sx={{fontWeight: '600', borderRadius: 2, mt: 2}}
                                                type={'submit'}
                                                disabled={isWaiting}
                                            >
                                                Thay đổi mật khẩu
                                                {isWaiting && (<CircularProgress color={'inherit'} size={20}/>)}
                                            </Button>

                                        </Box>
                                    </>
                                )
                    }

                    <Button
                        size={'large'} variant={'contained'} fullWidth
                        color={'primary'} sx={{fontWeight: '600', borderRadius: 2, mt: 2}}
                        onClick={() => navigate('/login')}
                    >
                        Quay lại trang đăng nhập
                    </Button>

                </Box>

            </Paper>
        </Container>
    )
}